from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from app.services.resilient_client import resilient_generate

router = APIRouter()

class ChatRequest(BaseModel):
    text: str

class ChatResponse(BaseModel):
    answer: str

@router.post("/ask", response_model=ChatResponse)
async def ask_question(request: ChatRequest):
    try:
        # Simple RAG-less chat for the optional "Ask" button
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful AI assistant embedded in the TruthLens Audit tool. "
                       "The user is using the 'Ask' button to ask a general question instead of auditing a claim. "
                       "Provide a clear, concise, and helpful answer."),
            ("user", "{text}")
        ])
        
        messages = prompt.format_messages(text=request.text)
        response = await resilient_generate(messages)
        return ChatResponse(answer=response.content)
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
