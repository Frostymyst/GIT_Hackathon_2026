from fastapi import APIRouter, HTTPException
import mysql.connector
from pydantic import BaseModel
from services.adminSetCategories import create_category, delete_category
from services.adminSetDepartments import create_department, delete_department
from database import connection

router = APIRouter(prefix="/admin", tags=["admin"])


class CategoryRequest(BaseModel):
    cname: str


class DepartmentRequest(BaseModel):
    dname: str


@router.get("/categories")
async def get_categories():
    """Get all task categories."""
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


@router.post("/categories")
async def add_category(payload: CategoryRequest):
    """Create a task category."""
    try:
        created = create_category(cname=payload.cname)
        return {"status": "OK", "created": created}
    except RuntimeError as exc:
        if "Duplicate entry" in str(exc):
            raise HTTPException(
                status_code=409, detail="Category already exists"
            ) from exc
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.delete("/categories/{cname}")
async def remove_category(cname: str):
    """Delete a task category by name."""
    try:
        deleted = delete_category(cname=cname)
        if not deleted:
            raise HTTPException(status_code=404, detail="Category not found")
        return {"status": "OK", "deleted": True}
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/departments")
async def get_departments():
    """Get all departments."""
    sql, cursor = connection()
    try:
        cursor.execute("SELECT * FROM dept")
        departments = cursor.fetchall()
        return {"status": "OK", "departments": departments}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.post("/departments")
async def add_department(payload: DepartmentRequest):
    """Create a department."""
    try:
        created = create_department(dname=payload.dname)
        return {"status": "OK", "created": created}
    except RuntimeError as exc:
        if "Duplicate entry" in str(exc):
            raise HTTPException(
                status_code=409, detail="Department already exists"
            ) from exc
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.delete("/departments/{dname}")
async def remove_department(dname: str):
    """Delete a department by name."""
    try:
        deleted = delete_department(dname=dname)
        if not deleted:
            raise HTTPException(status_code=404, detail="Department not found")
        return {"status": "OK", "deleted": True}
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
