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
            "SELECT employees.*, dept.dname"
            " FROM employees"
            " LEFT JOIN dept ON employees.dno = dept.dno"
            " WHERE employees.ename LIKE %s OR employees.email LIKE %s"
            " OR employees.eno LIKE %s OR dept.dname LIKE %s",
            (like_query, like_query, like_query, like_query),
        )
        employees = cursor.fetchall()
        return {"status": "OK", "employees": employees}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


