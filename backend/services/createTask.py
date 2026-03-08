import os
from datetime import date
from typing import Any

import mysql.connector
from mysql.connector import Error


def insert_task(
    connection: Any,
    name: str,
    email: str | None,
    summary: str,
    description: str,
    due_date: str | date | None,
    status: str = "new",
    assigned_to: int | None = None,
    category: str | None = None,
) -> int:
    """Insert a new task row and return the generated task ID (tno)."""
    columns = [
        "summary",
        "description",
        "status",
        "post_date",
        "ordering_access_date",
        "name",
    ]
    placeholders = ["%s", "%s", "%s", "CURDATE()", "CURDATE()", "%s"]
    params: list[Any] = [summary, description, status, name]

    if email is not None:
        columns.insert(0, "email")
        placeholders.insert(0, "%s")
        params.insert(0, email)

    if due_date is not None:
        columns.append("due_date")
        placeholders.append("%s")
        params.append(due_date)

    if assigned_to is not None:
        columns.append("assigned_to")
        placeholders.append("%s")
        params.append(assigned_to)

    if category is not None:
        columns.append("categories")
        placeholders.append("%s")
        params.append(category)

    query = (
        f"INSERT INTO task ({', '.join(columns)}) "
        f"VALUES ({', '.join(placeholders)})"
    )

    cursor = connection.cursor()
    try:
        cursor.execute(query, params)
        connection.commit()
        return int(cursor.lastrowid)
    finally:
        cursor.close()


def create_task(
    name: str,
    email: str | None,
    summary: str,
    description: str,
    due_date: str | date | None,
    status: str = "new",
    assigned_to: int | None = None,
    category: str | None = None,
) -> int:
    """Open a MySQL connection, insert a task, and close cleanly."""
    connection = None
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "127.0.0.1"),
            port=int(os.getenv("MYSQL_PORT", "3306")),
            user=os.getenv("MYSQL_USER", "tasklist"),
            password=os.getenv("MYSQL_PASSWORD", "password"),
            database=os.getenv("MYSQL_DB", "tasklist"),
        )
        return insert_task(
            name=name,
            connection=connection,
            email=email,
            summary=summary,
            description=description,
            status=status,
            due_date=due_date,
            assigned_to=assigned_to,
            category=category,
        )
    except Error as exc:
        raise RuntimeError(f"Failed to insert task: {exc}") from exc
    finally:
        if connection is not None and connection.is_connected():
            connection.close()
