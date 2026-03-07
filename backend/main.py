from fastapi import FastAPI
from services.llm import LLM
from services.email_service import fetch_emails

app = FastAPI()


@app.get("/")
def root():
    return {"status": "OK"}


@app.get("/ai-test")
def ai_test():
    ai = LLM()
    result = ai.handle_new_email(
        email_content="""
        Hi there,
        My name is Jack Koskie, I am emailing about order #12345 that I placed on August 1st. I received the package yesterday but one of the items was damaged. The product is a ceramic vase and it arrived with a large crack in it. I would like to request a return and refund for this item. Please let me know how to proceed with the return process. Thank you.""",
        valid_tags=["return", "product-issue", "billing", "general-inquiry"],
    )
    return result


@app.get("/email-test")
def email_test():
    emails = fetch_emails(n=1)
    if not emails:
        return {"error": "No emails found"}
    first = emails[0]
    content = f"From: {first.sender}\nSubject: {first.subject}\nDate: {first.date}\n\n{first.body}"
    ai = LLM()
    result = ai.handle_new_email(content, valid_tags=["billing", "support", "general"])
    return result
