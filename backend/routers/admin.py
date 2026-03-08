from fastapi import APIRouter, HTTPException
import mysql.connector
from pydantic import BaseModel
from services.adminSetCategories import create_category, delete_category
from services.adminSetDepartments import create_department, delete_department
from services.adminSetDepartmentCategories import (
    create_department_category,
    delete_department_category,
)
from services.adminSetEmployees import create_employee, delete_employee
from database import connection
from datetime import date

router = APIRouter(prefix="/admin", tags=["admin"])


class CategoryRequest(BaseModel):
    cname: str


class DepartmentRequest(BaseModel):
    dname: str


class DepartmentCategoryRequest(BaseModel):
    cname: str


class EmployeeRequest(BaseModel):
    ename: str
    email: str
    epassword: str
    phonenumber: str
    bdate: str
    salary: float
    title: str
    dno: int


@router.get("/export")
async def export_admin_data():
    """Export all admin data (categories, departments, department categories)"""
    sql, cursor = connection()
    try:
        cursor.execute("SELECT * FROM task_categories")
        categories = cursor.fetchall()

        cursor.execute("SELECT * FROM dept")
        departments = cursor.fetchall()

        cursor.execute("SELECT * FROM dept_categories")
        dept_categories = cursor.fetchall()

        return {
            "exported_at": date.today().isoformat(),
            "categories": categories,
            "departments": departments,
            "dept_categories": dept_categories,
        }
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


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


@router.get("/departments/{dno}/categories")
async def get_department_categories(dno: int):
    """Get categories assigned to a department."""
    sql, cursor = connection()
    try:
        cursor.execute(
            "SELECT dc.dno, dc.cname FROM dept_categories dc WHERE dc.dno = %s",
            (dno,),
        )
        mappings = cursor.fetchall()
        return {"status": "OK", "categories": mappings}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.post("/departments/{dno}/categories")
async def add_category_to_department(dno: int, payload: DepartmentCategoryRequest):
    """Assign a category to a department."""
    try:
        created = create_department_category(dno=dno, cname=payload.cname)
        return {"status": "OK", "created": created}
    except RuntimeError as exc:
        if "Duplicate entry" in str(exc):
            raise HTTPException(
                status_code=409, detail="Category already assigned to department"
            ) from exc
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.delete("/departments/{dno}/categories/{cname}")
async def remove_category_from_department(dno: int, cname: str):
    """Remove a category from a department."""
    try:
        deleted = delete_department_category(dno=dno, cname=cname)
        if not deleted:
            raise HTTPException(
                status_code=404, detail="Department-category mapping not found"
            )
        return {"status": "OK", "deleted": True}
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/")
async def add_employee(payload: EmployeeRequest):
    """Create a new employee."""
    try:
        created = create_employee(
            ename=payload.ename,
            email=payload.email,
            epassword=payload.epassword,
            phonenumber=payload.phonenumber,
            bdate=payload.bdate,
            salary=payload.salary,
            title=payload.title,
            dno=payload.dno,
        )
        return {"status": "OK", "created": created}
    except RuntimeError as exc:
        if "Duplicate entry" in str(exc):
            raise HTTPException(
                status_code=409, detail="Employee already exists"
            ) from exc
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/leaderboard")
async def get_employee_leaderboard(limit: int = 20):
    """List employees by completed tasks count, descending."""
    sql, cursor = connection()
    try:
        safe_limit = limit if limit > 0 else 20
        cursor.execute(
            "SELECT e.eno AS employee_id, e.ename AS employee_name, "
            "COUNT(t.tno) AS completed_tasks "
            "FROM employees e "
            "LEFT JOIN task t ON t.assigned_to = e.eno AND t.status = 'completed' "
            "GROUP BY e.eno, e.ename "
            "ORDER BY completed_tasks DESC, employee_name ASC "
            "LIMIT %s",
            (safe_limit,),
        )
        leaderboard = cursor.fetchall()
        return {"status": "OK", "leaderboard": leaderboard}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.get("/{employee_id}")
async def get_employee(employee_id: int):
    """Get employee by ID"""
    sql, cursor = connection()
    try:
        cursor.execute("SELECT * FROM employees WHERE eno = %s", (employee_id,))
        employee = cursor.fetchone()
        if employee:
            return {"status": "OK", "employee": employee}
        raise HTTPException(status_code=404, detail="Employee not found")
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.delete("/{employee_id}")
async def remove_employee(employee_id: int):
    """Delete employee by ID"""
    try:
        deleted = delete_employee(eno=employee_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Employee not found")
        return {"status": "OK", "deleted": True}
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.patch("/{employee_id}")
async def update_employee(employee_id: int):
    """Update employee by ID"""
    # TODO
