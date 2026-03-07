from fastapi import FastAPI, HTTPException
from services.llm import LLM

from routers import employee, task
from routers import emails as email_router

app = FastAPI()
app.include_router(employee.router)
app.include_router(task.router)
app.include_router(email_router.router)


@app.get("/")
def root():
    return {"status": "OK"}


@app.get("/ai-test")
def ai_test():
    ai = LLM()

    TAGS = ["return", "product-issue", "billing", "general-inquiry"]
    ACTIONS = {
        "request-info": "You should request the following information from the customer in order to allow support to better assist the customer. Valid fields to request information are: date of purchase, order number, customer name.",
        "escalate": "This action is to stop responding via a language model and to switch to a human. The information as to why this action will be taken should also be included.",
        "close-ticket": "If the conversation has been totally resolved and no further communication is necessary, you can include this action to indicate that the ticket should be closed.",
    }

    email_content = ai.prompt(
        "Write a sample customer email to a company. The email may be asking for a return, a product issue, a billing issue, or a general inquiry. The email should be somewhat detailed and should be at least a few sentences long. Only include the body of the email, do not include the subject line."
    )

    initial_result = ai.handle_new_email(
        email_content=email_content,
        valid_tags=TAGS,
        valid_actions=ACTIONS,
    )

    print(initial_result)

    ai_response = ai.generate_email_reply(
        email_content, initial_result.tags, initial_result.actions
    )

    print(ai_response)

    return {
        "email_content": email_content,
        "summary": initial_result.summary,
        "tags": initial_result.tags,
        "actions": initial_result.actions,
        "draft_reply": ai_response,
    }
