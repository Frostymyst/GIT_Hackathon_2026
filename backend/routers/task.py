from fastapi import APIRouter, HTTPException
from services.starvationOrganizer import fetch_starving_task_ids
from pydantic import BaseModel
from services.llm import LLM
from services.createTask import create_task
from datetime import date
import mysql.connector
from database import connection

router = APIRouter(prefix="/task", tags=["task"])
ai = LLM()


class CreateTaskRequest(BaseModel):
    email: str | None = None
    description: str
    due_date: int | None = None


class UpdateTaskCategoryRequest(BaseModel):
    category: str


@router.get("/")
async def get_tasks(category: str | None = None, cname: str | None = None):
    """Get all tasks, or get tasks by category"""
    sql, cursor = connection()
    try:
        requested_category = category if category is not None else cname
        if requested_category is not None and requested_category.strip() != "":
            normalized_category = requested_category.strip()
            if normalized_category.lower() == "null":
                cursor.execute("SELECT * FROM task WHERE categories IS NULL")
            else:
                cursor.execute(
                    "SELECT * FROM task WHERE LOWER(categories) = LOWER(%s)",
                    (normalized_category,),
                )
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

    sql, cursor = connection()
    try:
        cursor.execute("SELECT cname FROM task_categories")
        category_rows = cursor.fetchall()
        valid_categories = [row["cname"] for row in category_rows if row.get("cname")]
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()

    ai_response = ai.handle_new_email(
        description, valid_categories=valid_categories, valid_actions={}
    )

    name = ai_response.name
    summary = ai_response.summary
    category = (
        ai_response.category.strip() if isinstance(ai_response.category, str) else None
    )

    # Tasks are modeled with a single category value.
    if isinstance(category, str) and "," in category:
        raise HTTPException(
            status_code=400, detail="Task category must be a single value"
        )

    if category is not None:
        # Normalize LLM output to an existing category value (case-insensitive).
        category_map = {c.lower(): c for c in valid_categories}
        if category.lower() not in category_map:
            raise HTTPException(
                status_code=400,
                detail="Task category must be one of the existing categories",
            )
        category = category_map[category.lower()]

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


@router.get("/email/{eno}")
async def get_tasks_by_email(eno: int):
    """Get all tasks for a specific email number (eno)."""
    sql, cursor = connection()
    try:
        cursor.execute(
            """
            SELECT DISTINCT task.* FROM task
            LEFT JOIN workson ON task.tno = workson.tno
            WHERE workson.eno = %s OR task.assigned_to = %s
            """,
            (eno, eno),
        )
        tasks = cursor.fetchall()
        return {"status": "OK", "eno": eno, "tasks": tasks}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.get("/categories")
async def get_task_categories():
    """Get all task categories"""
    sql, cursor = connection()
    try:
        cursor.execute("SELECT * FROM task_categories")
        categories = cursor.fetchall()
        return {"status": "OK", "categories": categories}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


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


@router.get("/{task_id}/categories")
async def get_task_categories_by_id(task_id: int):
    """Get all categories for a specific task ID."""
    sql, cursor = connection()
    try:
        cursor.execute("SELECT categories FROM task WHERE tno = %s", (task_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Task not found")

        category_value = row.get("categories")
        categories = [category_value] if category_value else []
        return {"status": "OK", "task_id": task_id, "categories": categories}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.patch("/{task_id}/assign")
async def assign_task(task_id: int, employee_id: int | None = None):
    """Assign a task to an employee. If no employee_id is provided, the task will be unassigned."""
    sql, cursor = connection()
    try:
        # Check if the task exists
        cursor.execute("SELECT tno FROM task WHERE tno = %s", (task_id,))
        found_task = cursor.fetchone()
        if not found_task:
            raise HTTPException(status_code=404, detail="Task not found")

        # If an employee_id is provided, check if the employee exists
        if employee_id is not None:
            cursor.execute("SELECT eno FROM employees WHERE eno = %s", (employee_id,))
            found_employee = cursor.fetchone()
            if not found_employee:
                raise HTTPException(status_code=404, detail="Employee not found")

        if employee_id is not None:
            cursor.execute(
                "UPDATE task SET assigned_to = %s, status = 'in-progress' WHERE tno = %s",
                (employee_id, task_id),
            )
        else:
            cursor.execute(
                "UPDATE task SET assigned_to = NULL WHERE tno = %s", (task_id,)
            )
        sql.commit()
        return {"status": "OK", "task_id": task_id, "employee_id": employee_id}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.get("/category/{cname}")
async def get_tasks_by_category(cname: str):
    """Get all tasks that have the given category."""
    sql, cursor = connection()
    try:
        cursor.execute(
            "SELECT * FROM task WHERE LOWER(categories) = LOWER(%s)",
            (cname.strip(),),
        )
        tasks = cursor.fetchall()
        return {"status": "OK", "category": cname.strip(), "tasks": tasks}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.delete("/{task_id}")
async def delete_task(task_id: int):
    """Delete task by ID"""
    sql, cursor = connection()
    try:
        cursor.execute("DELETE FROM task WHERE tno = %s", (task_id,))
        sql.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"status": "OK", "deleted": True}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.patch("/{task_id}/status")
async def update_task(task_id: int, new_status: str | None = None):
    """Set a task's status to the next stage in the workflow"""
    STATUSES = ["new", "in-progress", "delayed", "completed"]

    sql, cursor = connection()
    try:
        cursor.execute("SELECT status FROM task WHERE tno = %s", (task_id,))
        task = cursor.fetchone()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        current_status = str(task["status"])
        if new_status:
            if new_status not in STATUSES:
                raise HTTPException(status_code=400, detail="Invalid new status")
            next_status = new_status
        else:
            try:
                next_status = (
                    "in-progress"
                    if current_status == "new"
                    else (
                        "completed"
                        if current_status == "in-progress"
                        else (
                            "in-progress"
                            if current_status == "delayed"
                            else current_status
                        )
                    )
                )
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid current status")

        cursor.execute(
            "UPDATE task SET status = %s WHERE tno = %s",
            (next_status, task_id),
        )
        sql.commit()

        return {"status": "OK", "new_status": next_status}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.patch("/{task_id}/category")
async def update_task_category(task_id: int, payload: UpdateTaskCategoryRequest):
    """Update a task's single category value."""
    next_category = (payload.category or "").strip()
    if not next_category:
        raise HTTPException(status_code=400, detail="Category is required")

    sql, cursor = connection()
    try:
        cursor.execute("SELECT tno FROM task WHERE tno = %s", (task_id,))
        found_task = cursor.fetchone()
        if not found_task:
            raise HTTPException(status_code=404, detail="Task not found")

        cursor.execute("SELECT cname FROM task_categories")
        category_rows = cursor.fetchall()
        category_map = {
            row["cname"].lower(): row["cname"]
            for row in category_rows
            if row.get("cname")
        }

        normalized = category_map.get(next_category.lower())
        if not normalized:
            raise HTTPException(
                status_code=400,
                detail="Task category must be one of the existing categories",
            )

        cursor.execute(
            "UPDATE task SET categories = %s WHERE tno = %s",
            (normalized, task_id),
        )
        sql.commit()
        return {"status": "OK", "task_id": task_id, "category": normalized}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.get("/starving")
def get_starving_tasks():
    """Return front-of-list starving task IDs by ordering_access_date."""
    try:
        return fetch_starving_task_ids()
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
