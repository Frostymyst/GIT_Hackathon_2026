import os
from typing import Any

import mysql.connector
from mysql.connector import Error


def insert_category(
	connection: Any,
	cname: str,
) -> bool:
	"""Insert a new category row and return a success flag."""
	query = (
		"INSERT INTO task_categories "
		"(cname) "
		"VALUES (%s)"
	)
	

	cursor = connection.cursor()
	try:
		cursor.execute(
			query,
			(
				cname,
			),
		)
		connection.commit()
		return True
	finally:
		cursor.close()


def create_category(
	cname: str,
) -> bool:
	"""Open a MySQL connection, insert a category, and close cleanly."""
	connection = None
	try:
		connection = mysql.connector.connect(
			host=os.getenv("MYSQL_HOST", "127.0.0.1"),
			port=int(os.getenv("MYSQL_PORT", "3306")),
			user=os.getenv("MYSQL_USER", "root"),
			password=os.getenv("MYSQL_PASSWORD", ""),
			database=os.getenv("MYSQL_DB", "tasklist"),
		)
		return insert_category(
			connection=connection,
			cname=cname,
		)
	except Error as exc:
		raise RuntimeError(f"Failed to insert category: {exc}") from exc
	finally:
		if connection is not None and connection.is_connected():
			connection.close()


def delete_category_row(
	connection: Any,
	cname: str,
) -> bool:
	"""Delete a category row and return a success flag."""
	query = (
		"DELETE FROM task_categories "
		"WHERE cname = %s"
	)

	cursor = connection.cursor()
	try:
		cursor.execute(
			query,
			(
				cname,
			),
		)
		connection.commit()
		return cursor.rowcount > 0
	finally:
		cursor.close()


def delete_category(
	cname: str,
) -> bool:
	"""Open a MySQL connection, delete a category, and close cleanly."""
	connection = None
	try:
		connection = mysql.connector.connect(
			host=os.getenv("MYSQL_HOST", "127.0.0.1"),
			port=int(os.getenv("MYSQL_PORT", "3306")),
			user=os.getenv("MYSQL_USER", "root"),
			password=os.getenv("MYSQL_PASSWORD", ""),
			database=os.getenv("MYSQL_DB", "tasklist"),
		)
		return delete_category_row(
			connection=connection,
			cname=cname,
		)
	except Error as exc:
		raise RuntimeError(f"Failed to delete category: {exc}") from exc
	finally:
		if connection is not None and connection.is_connected():
			connection.close()
