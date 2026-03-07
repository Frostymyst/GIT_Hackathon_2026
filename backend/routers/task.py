from fastapi import APIRouter, HTTPException
from services.starvationOrganizer import fetch_starving_task_ids
from pydantic import BaseModel
from services.llm import LLM
from services.createTask import create_task
from datetime import date

router = APIRouter(prefix="/task", tags=["task"])
ai = LLM()


class CreateTaskRequest(BaseModel):
    email: str | None = None
    description: str
    due_date: int | None = None


@router.get("/")
async def get_tasks():
    """Get all tasks"""
    # TODO


@router.post("/")
async def make_new_task(task_data: CreateTaskRequest):
    """Create a new task"""
    email = task_data.email
    description = task_data.description
    due_date = task_data.due_date

    ai_response = ai.handle_new_email(
        description, valid_categories=[], valid_actions={}
    )

    name = ai_response.name
    summary = ai_response.summary
    category = ai_response.category

    print(name)
    print(summary)
    print(category)

    task_id = create_task(
        name,
        email,
        summary,
        description,
        date.fromtimestamp(due_date) if due_date else None,
        "new",
        None,
        category,
    )

    return {"status": "success", "task_id": task_id}


@router.get("/{task_id}")
async def get_task(task_id: int):
    """Get task by ID"""
    # TODO


@router.delete("/{task_id}")
async def delete_task(task_id: int):
    """Delete task by ID"""
    # TODO


@router.patch("/{task_id}")
async def update_task(task_id: int):
    """Update task by ID"""
    # TODO


@router.get("/categories")
async def get_task_categories():
    """Get all task categories"""
    # TODO


@router.get("/starving")
def get_starving_tasks():
    """Return front-of-list starving task IDs by ordering_access_date."""
    try:
        return fetch_starving_task_ids()
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
