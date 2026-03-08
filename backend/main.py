from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os

from database import connection
from routers import admin, employee, task

app = FastAPI()

# Allow frontend dev servers to call backend APIs from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            "SELECT * FROM employees WHERE email = %s AND epassword = %s",
            (email, password),
        )
        employee = cursor.fetchone()
        if employee:
            return {"status": "OK", "employee": employee}
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()
