from fastapi import APIRouter, HTTPException
from database import connection
import mysql.connector

router = APIRouter(prefix="/employee", tags=["employee"])


@router.get("/")
async def get_employees():
    """Get all employees"""
    # TODO
    return {"status": "OK", "employees": []}


@router.get("/search")
async def search_employees(query: str):
    """Search employees by name or email"""
    sql, cursor = connection()
    try:
        like_query = f"%{query}%"
        cursor.execute(
            "SELECT * FROM employee WHERE name LIKE %s OR email LIKE %s",
            (like_query, like_query),
        )
        employees = cursor.fetchall()
        return {"status": "OK", "employees": employees}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.post("/")
async def create_employee():
    """Create a new employee"""
    # TODO


@router.get("/{employee_id}")
async def get_employee(employee_id: int):
    """Get employee by ID"""
    # TODO


@router.delete("/{employee_id}")
async def delete_employee(employee_id: int):
    """Delete employee by ID"""
    # TODO


@router.patch("/{employee_id}")
async def update_employee(employee_id: int):
    """Update employee by ID"""
    # TODO


@router.get("/departments")
async def get_employee_departments():
    """Get all employee departments"""
    # TODO
