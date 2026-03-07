import os
from datetime import date
from typing import Any

import mysql.connector
from mysql.connector import Error


def insert_task(
	connection: Any,
	email: str,
	summary: str,
	description: str,
	due_date: str | date,
	status: str = "new",
	assigned_to: int | None = None,
	category: str | None = None,
) -> int:
	"""Insert a new task row and return the generated task ID (tno)."""
	query = (
		"INSERT INTO task "
		"(email, summary, description, status, due_date, post_date, "
		"ordering_access_date, assigned_to, categories) "
		"VALUES (%s, %s, %s, %s, %s, CURDATE(), CURDATE(), %s, %s)"
	)

	cursor = connection.cursor()
	try:
		cursor.execute(
			query,
			(
				email,
				summary,
				description,
				status,
				due_date,
				assigned_to,
				category,
			),
		)
		connection.commit()
		return int(cursor.lastrowid)
	finally:
		cursor.close()


def create_task(
	email: str,
	summary: str,
	description: str,
	due_date: str | date,
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
			user=os.getenv("MYSQL_USER", "root"),
			password=os.getenv("MYSQL_PASSWORD", ""),
			database=os.getenv("MYSQL_DB", "tasklist"),
		)
		return insert_task(
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