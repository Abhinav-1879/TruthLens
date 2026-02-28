from typing import List
from app.models.schemas import Claim, ClaimType

def calculate_hallucination_score(claims: List[Claim]) -> float:
    """
    Calculates the detailed hallucination risk score [0-100].
    Formula:
    Score = (ContradictionRate * 2.0 + UnsupportedRatio * 0.5 + (1 - EvidenceHitRate) * 0.3) * 100
    
    Clamped at 100.
    """
    if not claims:
        return 0.0

    total_claims = len(claims)
    
    # 1. Contradiction Rate
    contradictions = len([c for c in claims if c.status == "contradicted"])
    contradiction_rate = contradictions / total_claims

    # 2. Unsupported Ratio (Unverifiable or Low Evidence)
    # Claims that are marked as verifiable but have no evidence, or are speculative without evidence
    unsupported = len([c for c in claims if c.status == "unverified" or c.evidence_strength < 0.3])
    unsupported_ratio = unsupported / total_claims

    # 3. Evidence Hit Rate (weighted average of evidence strength)
    total_strength = sum(c.evidence_strength for c in claims)
    evidence_hit_rate = total_strength / total_claims

    # Formula
    raw_score = (contradiction_rate * 2.0 + unsupported_ratio * 0.5 + (1.0 - evidence_hit_rate) * 0.3) * 100
    
    # Hard Overrides
    critical_errors = len([c for c in claims if c.fingerprint and c.fingerprint.impact_level in ["critical", "high"]])
    if critical_errors > 0:
        raw_score = max(raw_score, 100.0)
    
    return min(max(raw_score, 0.0), 100.0)

def calculate_integrity_score(claims: List[Claim]) -> float:
    """
    Calculates the Integrity Score [0-100].
    Focuses on 'Assertiveness vs Verification'. 
    If you are highly assertive but unverified, integrity drops.
    """
    if not claims:
        return 100.0
    
    scores = []
    for c in claims:
        if c.status == "verified":
            scores.append(100.0)
        elif c.status == "contradicted":
            scores.append(0.0)
        else:
            # Unverified: Penalize if high assertiveness
            # If assertiveness is 1.0 (very sure), and unverified, score = 0
            # If assertiveness is 0.0 (humble), and unverified, score = 100
            scores.append((1.0 - c.assertiveness_score) * 100)
            
    return sum(scores) / len(scores)

def calculate_confidence_gap(claims: List[Claim]) -> float:
    """
    Calculates the Confidence Gap [0-100].
    Gap = Average(Assertiveness - EvidenceStrength)
    """
    if not claims:
        return 0.0
        
    gaps = []
    for c in claims:
        gap = max(0.0, c.assertiveness_score - c.evidence_strength)
        gaps.append(gap * 100)
        
    return sum(gaps) / len(claims)

def generate_simple_explainer(claims: List[Claim], hallucination_score: float) -> str:
    """
    Generates a simple, non-AI explanation string.
    """
    total = len(claims)
    unverifiable = len([c for c in claims if c.status == "unverified"])
    contradicted = len([c for c in claims if c.status == "contradicted"])
    gap = calculate_confidence_gap(claims)
    
    reason = []
    if contradicted > 0:
        reason.append(f"{contradicted} ecosystem contradictions")
    if unverifiable > 0:
        reason.append(f"{unverifiable}/{total} claims unverifiable")
    if gap > 20:
        reason.append(f"Confidence exceeds evidence by {int(gap)}%")
        
    if not reason:
        return f"{int(hallucination_score)}% Risk - No major anomalies detected."
        
    return f"{int(hallucination_score)}% Risk because: {', '.join(reason)}."
