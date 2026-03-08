import os
from typing import Any

import mysql.connector
from mysql.connector import Error


def insert_department_category(
    connection: Any,
    dno: int,
    cname: str,
) -> bool:
    """Insert a department-category mapping row and return a success flag."""
    query = "INSERT INTO dept_categories " "(dno, cname) " "VALUES (%s, %s)"

    cursor = connection.cursor()
    try:
        cursor.execute(
            query,
            (
                dno,
                cname,
            ),
        )
        connection.commit()
        return True
    finally:
        cursor.close()


def create_department_category(
    dno: int,
    cname: str,
) -> bool:
    """Open a MySQL connection, insert a mapping, and close cleanly."""
    connection = None
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "127.0.0.1"),
            port=int(os.getenv("MYSQL_PORT", "3306")),
            user=os.getenv("MYSQL_USER", "tasklist"),
            password=os.getenv("MYSQL_PASSWORD", "password"),
            database=os.getenv("MYSQL_DB", "tasklist"),
        )
        return insert_department_category(
            connection=connection,
            dno=dno,
            cname=cname,
        )
    except Error as exc:
        raise RuntimeError(f"Failed to insert department category: {exc}") from exc
    finally:
        if connection is not None and connection.is_connected():
            connection.close()


def delete_department_category_row(
    connection: Any,
    dno: int,
    cname: str,
) -> bool:
    """Delete a department-category mapping row and return a success flag."""
    query = "DELETE FROM dept_categories " "WHERE dno = %s AND cname = %s"

    cursor = connection.cursor()
    try:
        cursor.execute(
            query,
            (
                dno,
                cname,
            ),
        )
        connection.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()


def delete_department_category(
    dno: int,
    cname: str,
) -> bool:
    """Open a MySQL connection, delete a mapping, and close cleanly."""
    connection = None
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "127.0.0.1"),
            port=int(os.getenv("MYSQL_PORT", "3306")),
            user=os.getenv("MYSQL_USER", "tasklist"),
            password=os.getenv("MYSQL_PASSWORD", "password"),
            database=os.getenv("MYSQL_DB", "tasklist"),
        )
        return delete_department_category_row(
            connection=connection,
            dno=dno,
            cname=cname,
        )
    except Error as exc:
        raise RuntimeError(f"Failed to delete department category: {exc}") from exc
    finally:
        if connection is not None and connection.is_connected():
            connection.close()
