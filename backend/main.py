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
