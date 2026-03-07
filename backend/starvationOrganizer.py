import os
from typing import Any

import mysql.connector
from mysql.connector import Error


def get_starving_task_ids(connection: Any) -> list[int]:
    """Return task IDs ordered by oldest last_accessed_date first."""
    query = "SELECT tno FROM task ORDER BY last_accessed_date ASC"

    cursor = connection.cursor()
    try:
        cursor.execute(query)
        rows = cursor.fetchall()
    finally:
        cursor.close()

    return [int(row[0]) for row in rows]


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
