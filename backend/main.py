from fastapi import FastAPI, HTTPException
import mysql.connector
import os

from database import connection
from routers import admin, employee, task

app = FastAPI()
app.include_router(employee.router)
app.include_router(task.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"status": "OK"}


@app.put("/login")
def login(email: str, password: str):
    sql, cursor = connection()
    try:
        cursor.execute(
            "SELECT * FROM employee WHERE email = %s AND password = %s",
            (email, password),
        )
        employee = cursor.fetchone()
        if employee:
            return {"status": "OK", "employee": employee}
        else:
            return HTTPException(status_code=401, detail="Invalid email or password")
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()
