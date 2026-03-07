from fastapi import FastAPI, HTTPException
import mysql.connector
import os

from routers import admin, employee, task

app = FastAPI()
app.include_router(employee.router)
app.include_router(task.router)
app.include_router(admin.router)


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


@app.get("/")
def root():
    return {"status": "OK"}


@app.get("/login")
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
