from typing import List
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
import asyncio

from app.services.llm_provider import LLMFactory
from app.services.search_tool import SearchService
from app.models.schemas import Claim, AnalysisResponse, HallucinationFingerprint, ExecutiveBrief, ClaimType
from app.services.resilient_client import resilient_generate
from sqlmodel import Session, select, func
from app.models.db_models import AnalysisRecord
from app.services.scoring import (
    calculate_hallucination_score, 
    calculate_integrity_score, 
    calculate_confidence_gap, 
    generate_simple_explainer
)

class ExtractedClaim(BaseModel):
    atomic_fact: str = Field(description="The simplified atomic fact to be verified")
    quote: str = Field(description="The exact substring from the source text that supports this fact")
    claim_type: ClaimType = Field(description="The nature of the claim (factual_verifiable, speculative, etc.)")
    assertiveness: float = Field(description="How confident/specific the claim sounds linguistically (0.0 to 1.0). High for stats, years, names, or definitive language.")

class ExtractedClaimsList(BaseModel):
    claims: List[ExtractedClaim] = Field(description="List of atomic facts extracted from the text")

class NLIEngine:
    def __init__(self):
        self.llm = LLMFactory.get_llm(temperature=0.0)
        self.search_service = SearchService()

    async def extract_claims(self, text: str, question: str = None) -> List[ExtractedClaim]:
        parser = PydanticOutputParser(pydantic_object=ExtractedClaimsList)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert fact-checker. Your task is to break down complex text into simple, verifyable atomic claims. \n\n"
             "For each claim, you MUST:\n"
             "1. Extract the EXACT SUBSTRING (quote) from the original text.\n"
             "2. Classify the claim type:\n"
             "   - factual_verifiable: Specific facts (stats, dates, events, verifiable states).\n"
             "   - factual_unverifiable: Vague facts ('improved efficiency') hard to prove/disprove.\n"
             "   - inferential: Logical conclusions drawn from other facts.\n"
             "   - speculative: Predictions, possibilities, future tense.\n"
             "   - authority_reference: 'Experts say', 'Report claims' (verifying the attribution, not the content).\n"
             "3. Evaluate 'assertiveness' (0.0 to 1.0): How specific and confident does the claim sound? \n"
             "   - High (0.8-1.0): Contains specific numbers (67.4%), years (2031), named institutions (UNESCO), or definitive 'is/was' statements.\n"
             "   - Low (0.0-0.3): Contains 'likely', 'could', 'some', or general opinions.\n"
             "Ignore pure opinions.\n\n"
             "IMPORTANT: If a 'FOCUS QUESTION' is provided below, prioritize extracting claims that are relevant to answering or verifying that specific question."),
            ("user", "Text: {text}\nFocus Question: {question}\n\n{format_instructions}")
        ])
        
        # We need to construct the chain manually to pass messages to resilient_generate
        messages = prompt.format_messages(text=text, question=question or "None", format_instructions=parser.get_format_instructions())
        
        try:
            # Use Bramastra Resilient Invoker
            response = await resilient_generate(messages)
            result = parser.parse(response.content)
            return result.claims
        except Exception as e:
            print(f"Error extracting claims: {e}")
            raise e

    async def verify_claim(self, claim_data: ExtractedClaim) -> Claim:
        # 1. Search for evidence
        evidence_list = await self.search_service.get_evidence(claim_data.atomic_fact)
        evidence_text = "\n".join(evidence_list)
        
        if not evidence_text:
            return Claim(
                original_text=claim_data.atomic_fact,
                quote=claim_data.quote,
                atomic_fact=claim_data.atomic_fact,
                claim_type=claim_data.claim_type,
                status="unverified",
                confidence_score=0.0,
                evidence_strength=0.0,
                assertiveness_score=claim_data.assertiveness,
                evidence=[],
                explanation="No evidence found via search.",
                fingerprint=HallucinationFingerprint(
                    type="speculation" if claim_data.assertiveness < 0.5 else "fabrication",
                    description="No external evidence found to support this claim.",
                    impact_level="medium"
                )
            )

        # 2. Compare Claim vs Evidence using LLM (NLI)
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an automated fact-checking judge. You must compare a CLAIM against available EVIDENCE.\n"
             "Determine if the evidence SUPPORT, CONTRADICTS, or IS NEUTRAL to the claim.\n"
             "If there is a conflict or lack of support, you MUST categorize the error type (Hallucination Fingerprint).\n\n"
             "Fingerprint Types:\n"
             "- fabrication: Completely made up or contradicted by evidence.\n"
             "- outdated_fact: True in the past, but now false (check dates).\n"
             "- false_authority: Attributing a quote/action to the wrong entity.\n"
             "- speculation: Stating a hypothesis as fact.\n"
             "- none: The claim is verified and supported.\n\n"
             "Also evaluate Evidence Strength (0.0 to 1.0):\n"
             "- 1.0: Direct, unambiguous confirmation from a primary source.\n"
             "- 0.7: Strong support but minor details missing or secondary source.\n"
             "- 0.4: Weak support, partial match, or vague evidence.\n"
             "- 0.0: No evidence or complete contradiction.\n\n"
             "Impact Level: critical, high, medium, low, none."),
            ("user", "CLAIM: {claim}\nEVIDENCE: {evidence}\n\n{format_instructions}")
        ])
        
        class VerificationResult(BaseModel):
            status: str
            confidence: float
            evidence_strength: float = Field(description="Granular score of how well evidence supports the claim (0.0-1.0)")
            explanation: str
            fingerprint: HallucinationFingerprint

        parser = PydanticOutputParser(pydantic_object=VerificationResult)
        
        messages = prompt.format_messages(
            claim=claim_data.atomic_fact, 
            evidence=evidence_text,
            format_instructions=parser.get_format_instructions()
        )
        
        try:
            # Use Bramastra Resilient Invoker
            response = await resilient_generate(messages)
            result = parser.parse(response.content)
            
            # Map result status to our internal status schema
            status_map = {
                "supported": "verified",
                "verified": "verified",
                "contradicts": "contradicted",
                "contradicted": "contradicted",
                "refutes": "contradicted"
            }
            final_status = status_map.get(result.status.lower(), "unverified")
            
            return Claim(
                original_text=claim_data.atomic_fact,
                quote=claim_data.quote,
                atomic_fact=claim_data.atomic_fact,
                claim_type=claim_data.claim_type,
                status=final_status,
                confidence_score=result.confidence,
                evidence_strength=result.evidence_strength,
                assertiveness_score=claim_data.assertiveness,
                evidence=evidence_list,
                explanation=result.explanation,
                fingerprint=result.fingerprint
            )
        except Exception as e:
            print(f"Error verifying claim '{claim_data.atomic_fact}': {e}")
            raise e

    # Removed calculate_risk_level in favor of scoring.py service

    async def generate_executive_brief(self, text: str, claims: List[Claim], risk_score: float) -> ExecutiveBrief:
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a Chief Risk Officer. Your job is to translate technical AI hallucination data into a business Executive Brief.\n"
                 "Analyze the provided Text and the Verification Results.\n"
                 "Decide if this content is safe to ship.\n"
                 "Risk Thresholds:\n"
                 "- Critical/High Risk: REJECT\n"
                 "- Medium Risk: HOLD (requires manual review)\n"
                 "- Low Risk: SHIP\n\n"
                 "Output a JSON with:\n"
                 "- headline_risk_assessment\n"
                 "- business_impact\n"
                 "- compliance_flags\n"
                 "- action_recommendation"),
                ("user", "Text Summary: {text_snippet}\nRisk Score: {risk_score}\nBad Claims: {bad_claims}\n\n{format_instructions}")
            ])
            
            parser = PydanticOutputParser(pydantic_object=ExecutiveBrief)
            
            # Filter distinct bad claims for context
            bad_claims = [c.atomic_fact for c in claims if c.status in ["contradicted", "unverified"] or (c.fingerprint and c.fingerprint.impact_level in ["critical", "high"])]
            text_snippet = text[:500] + "..." if len(text) > 500 else text
            
            messages = prompt.format_messages(
                text_snippet=text_snippet,
                risk_score=risk_score,
                bad_claims=str(bad_claims),
                format_instructions=parser.get_format_instructions()
            )
            
            response = await resilient_generate(messages)
            return parser.parse(response.content)
            
        except Exception as e:
            print(f"Error generating brief: {e}")
            return ExecutiveBrief(
                headline_risk_assessment="Error Generating Brief",
                business_impact="Could not analyze business impact due to system error.",
                compliance_flags=[],
                action_recommendation="HOLD"
            )

    async def analyze_text(self, text: str, question: str = None, session: Session = None, user_id: int = None) -> AnalysisResponse:
        try:
            extracted_claims = await self.extract_claims(text, question=question)
        except Exception as e:
            print(f"CRITICAL ERROR in analyze_text: {e}")
            import traceback
            traceback.print_exc()
            return AnalysisResponse(
                overall_trust_score=0.0,
                hallucination_risk_level="Critical",
                risk_score=100.0,
                claims=[Claim(
                    original_text=text[:50]+"...",
                    quote=text[:50]+"...",
                    atomic_fact="System Error",
                    claim_type=ClaimType.FACTUAL_VERIFIABLE,
                    status="error",
                    confidence_score=0.0,
                    evidence_strength=0.0,
                    evidence=[],
                    explanation=f"Failed to extract claims: {str(e)}"
                )],
                summary_report=f"Analysis failed: {str(e)}"
            )
        
        results = []
        verified_count = 0
        
        for claim_data in extracted_claims:
            try:
                result = await self.verify_claim(claim_data)
                results.append(result)
                if result.status == "verified":
                    verified_count += 1
            except Exception as e:
                # If verification fails, we should probably record it as an error or unverified
                results.append(Claim(
                   original_text=claim_data.atomic_fact,
                   quote=claim_data.quote,
                   atomic_fact=claim_data.atomic_fact,
                   claim_type=claim_data.claim_type,
                   status="error",
                   confidence_score=0.0,
                   evidence_strength=0.0,
                   evidence=[],
                   explanation=f"Verification failed after retries: {str(e)}"
                ))
        
        # --- NEW SCORING SYSTEM ---
        integrity_score = calculate_integrity_score(results)
        hallucination_score = calculate_hallucination_score(results)
        confidence_gap = calculate_confidence_gap(results)
        explainer = generate_simple_explainer(results, hallucination_score)
        
        # Determine risk level (derived)
        if hallucination_score > 60: risk_level = "Critical"
        elif hallucination_score > 35: risk_level = "High"
        elif hallucination_score > 15: risk_level = "Medium"
        else: risk_level = "Low"

        # --- CONSISTENCY GUARD (Phase 7) ---
        # Clamp score changes to ±7% if same text analyzed previously
        if session and user_id:
            try:
                # Simple exact match for now. In production, use vector similarity or hash.
                statement = select(AnalysisRecord).where(
                    AnalysisRecord.user_id == user_id,
                    AnalysisRecord.text_content == text
                ).order_by(AnalysisRecord.created_at.desc()).limit(1)
                
                prev_record = session.exec(statement).first()
                
                if prev_record:
                    old_score = float(prev_record.risk_score)
                    diff = hallucination_score - old_score
                    
                    if abs(diff) > 7.0:
                        clamp = 7.0 if diff > 0 else -7.0
                        clamped_score = old_score + clamp
                        print(f"CONSISTENCY GUARD: Clamping score from {hallucination_score} to {clamped_score} (Old: {old_score})")
                        explainer += f" (Score smoothed from {int(hallucination_score)}% based on history)"
                        hallucination_score = clamped_score
                        
            except Exception as e:
                print(f"Error in consistency guard: {e}")

        brief = await self.generate_executive_brief(text, results, hallucination_score)
        
        # Calculate Confidence Interval (Simplified for now)
        confidence_interval = [max(0.0, hallucination_score - 5), min(100.0, hallucination_score + 5)]

        return AnalysisResponse(
            integrity_score=round(integrity_score, 1),
            hallucination_score=round(hallucination_score, 1),
            confidence_gap=round(confidence_gap, 1),
            simple_explainer=explainer,
            confidence_interval=confidence_interval,
            risk_score=round(hallucination_score, 1), # Compat
            question=question,
            claims=results,
            summary_report=f"Analyzed {len(results)} claims. Hallucination Score: {round(hallucination_score, 1)}%.",
            executive_brief=brief
        )
