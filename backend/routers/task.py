from fastapi import APIRouter, HTTPException
from services.starvationOrganizer import fetch_starving_task_ids
from pydantic import BaseModel
from services.llm import LLM
from services.createTask import create_task
from datetime import date
import mysql.connector
import os

router = APIRouter(prefix="/task", tags=["task"])
ai = LLM()


def connection():
    sql = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "127.0.0.1"),
        port=int(os.getenv("MYSQL_PORT", "3309")),
        user=os.getenv("MYSQL_USER", "tasklist"),
        password=os.getenv("MYSQL_PASSWORD", "password"),
        database=os.getenv("MYSQL_DB", "tasklist"),
    )
    cursor = sql.cursor(dictionary=True)
    return sql, cursor


class CreateTaskRequest(BaseModel):
    email: str | None = None
    description: str
    due_date: int | None = None


@router.get("/")
async def get_tasks(category: str | None = None):
    """Get all tasks, or get tasks by category"""
    sql, cursor = connection()
    try:
        if category:
            if category == "null":
                cursor.execute("SELECT * FROM task WHERE categories IS NULL")
            else:
                cursor.execute("SELECT * FROM task WHERE categories = %s", (category,))
        else:
            cursor.execute("SELECT * FROM task")
        tasks = cursor.fetchall()
        return {"status": "OK", "tasks": tasks}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


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
    sql, cursor = connection()
    try:
        cursor.execute("SELECT * FROM task WHERE tno = %s", (task_id,))
        task = cursor.fetchone()
        if task:
            return {"status": "OK", "task": task}
        else:
            raise HTTPException(status_code=404, detail="Task not found")
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


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
