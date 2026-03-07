from fastapi import FastAPI, HTTPException
from services.llm import LLM

from routers import admin, employee, task

app = FastAPI()
app.include_router(employee.router)
app.include_router(task.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"status": "OK"}
