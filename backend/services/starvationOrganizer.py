import os
from typing import Any

import mysql.connector
from mysql.connector import Error

# Number of tasks to take from the front of the starvation-ordered list.
TASKS_FROM_FRONT = int(os.getenv("TASKS_FROM_FRONT", "5"))


def mark_tasks_as_ordered_today(connection: Any, task_ids: list[int]) -> None:
    """Update ordering_access_date to today's date for selected tasks."""
    if not task_ids:
        return

    placeholders = ", ".join(["%s"] * len(task_ids))
    query = (
        f"UPDATE task SET ordering_access_date = CURDATE() "
        f"WHERE tno IN ({placeholders})"
    )

    cursor = connection.cursor()
    try:
        cursor.execute(query, tuple(task_ids))
        connection.commit()
    finally:
        cursor.close()


def get_starving_task_ids(connection: Any) -> list[int]:
    """Return front-of-list starving task IDs and refresh their ordering_access_date."""
    query = "SELECT tno FROM task ORDER BY ordering_access_date ASC"

    cursor = connection.cursor()
    try:
        cursor.execute(query)
        rows = cursor.fetchall()
    finally:
        cursor.close()

    all_task_ids = [int(row[0]) for row in rows]
    selected_task_ids = all_task_ids[:TASKS_FROM_FRONT]
    mark_tasks_as_ordered_today(connection, selected_task_ids)

    return selected_task_ids


def fetch_starving_task_ids() -> list[int]:
    """Open a MySQL connection, fetch starving task IDs, and close cleanly."""
    connection = None
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "127.0.0.1"),
            port=int(os.getenv("MYSQL_PORT", "3306")),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", ""),
            database=os.getenv("MYSQL_DB", "tasklist"),
        )
        return get_starving_task_ids(connection)
    except Error as exc:
        raise RuntimeError(f"Failed to fetch starving tasks: {exc}") from exc
    finally:
        if connection is not None and connection.is_connected():
            connection.close()
