from datetime import date
from typing import Any

from database import connection
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
    if category is not None:
        normalized_category = category.strip()
        if "," in normalized_category:
            raise ValueError("Task category must be a single value")
        category = normalized_category

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
    sql, cursor = connection()
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
            connection=sql,
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
        cursor.close()
        if sql.is_connected():
            sql.close()


def update_task(
    tno: int,
    name: str,
    email: str | None,
    summary: str,
    description: str,
    category: str | None,
    status: str,
) -> None:
    """Update an existing task by tno with new content and set ordering_access_date to today."""
    sql, cursor = connection()
    try:
        query = (
            "UPDATE task SET name = %s, summary = %s, description = %s, "
            "ordering_access_date = CURDATE(), status = %s"
        )
        params: list[Any] = [name, summary, description, status]
        if email is not None:
            query += ", email = %s"
            params.append(email)
        if category is not None:
            query += ", categories = %s"
            params.append(category)
        query += " WHERE tno = %s"
        params.append(tno)
        cursor.execute(query, params)
        sql.commit()
    except Error as exc:
        raise RuntimeError(f"Failed to update task: {exc}") from exc
    finally:
        cursor.close()
        if sql.is_connected():
            sql.close()
