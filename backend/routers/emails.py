from fastapi import APIRouter
from schemas.email_schema import emailMsg
from services.email_service import fetch_emails
from services.llm import LLM

router = APIRouter(prefix="/email", tags=["email"])

@router.get("/summarize")
def summarize_email():
    emails = fetch_emails(1)
    if not emails:
        return {"error": "No emails found"}
    first = emails[0]
    content = f"From: {first.sender}\nSubject: {first.subject}\nDate: {first.date}\n\n{first.body}"
    ai = LLM()
    return ai.handle_new_email(content, valid_tags=["billing", "support", "general"])

@router.get("/{n}")
def get_emails(n: int):
    return fetch_emails(n)
