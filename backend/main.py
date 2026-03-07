from fastapi import FastAPI, HTTPException
from services.llm import LLM

from routers import employee, task

app = FastAPI()
app.include_router(employee.router)
app.include_router(task.router)


@app.get("/")
def root():
    return {"status": "OK"}
