import os
from typing import Any

import mysql.connector
from mysql.connector import Error


def insert_department(
	connection: Any,
	dname: str,
) -> bool:
	"""Insert a new department row and return a success flag."""
	query = (
		"INSERT INTO dept "
		"(dname) "
		"VALUES (%s)"
	)
	

	cursor = connection.cursor()
	try:
		cursor.execute(
			query,
			(
				dname,
			),
		)
		connection.commit()
		return True
	finally:
		cursor.close()


def create_department(
	dname: str,
) -> bool:
	"""Open a MySQL connection, insert a department, and close cleanly."""
	connection = None
	try:
		connection = mysql.connector.connect(
			host=os.getenv("MYSQL_HOST", "127.0.0.1"),
			port=int(os.getenv("MYSQL_PORT", "3309")),
			user=os.getenv("MYSQL_USER", "tasklist"),
			password=os.getenv("MYSQL_PASSWORD", "password"),
			database=os.getenv("MYSQL_DB", "tasklist"),
		)
		return insert_department(
			connection=connection,
			dname=dname,
		)
	except Error as exc:
		raise RuntimeError(f"Failed to insert department: {exc}") from exc
	finally:
		if connection is not None and connection.is_connected():
			connection.close()


def delete_department_row(
	connection: Any,
	dname: str,
) -> bool:
	"""Delete a department row and return a success flag."""
	query = (
		"DELETE FROM dept "
		"WHERE dname = %s"
	)

	cursor = connection.cursor()
	try:
		cursor.execute(
			query,
			(
				dname,
			),
		)
		connection.commit()
		return cursor.rowcount > 0
	finally:
		cursor.close()


def delete_department(
	dname: str,
) -> bool:
	"""Open a MySQL connection, delete a department, and close cleanly."""
	connection = None
	try:
		connection = mysql.connector.connect(
			host=os.getenv("MYSQL_HOST", "127.0.0.1"),
			port=int(os.getenv("MYSQL_PORT", "3309")),
			user=os.getenv("MYSQL_USER", "tasklist"),
			password=os.getenv("MYSQL_PASSWORD", "password"),
			database=os.getenv("MYSQL_DB", "tasklist"),
		)
		return delete_department_row(
			connection=connection,
			dname=dname,
		)
	except Error as exc:
		raise RuntimeError(f"Failed to delete department: {exc}") from exc
	finally:
		if connection is not None and connection.is_connected():
			connection.close()