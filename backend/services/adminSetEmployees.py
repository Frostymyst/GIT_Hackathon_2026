import os
from typing import Any

import mysql.connector
from mysql.connector import Error


def insert_employee(
	connection: Any,
	ename: str,
	email: str,
	epassword: str,
	phonenumber: str,
	bdate: str,
	salary: float,
	title: str,
	dno: int,
) -> bool:
	"""Insert a new employee row and return a success flag."""
	query = (
		"INSERT INTO employees "
		"(ename, email, epassword, phonenumber, bdate, salary, title, hired_date, dno) "
		"VALUES (%s, %s, %s, %s, %s, %s, %s, CURDATE(), %s)"
	)

	cursor = connection.cursor()
	try:
		cursor.execute(
			query,
			(
				ename,
				email,
				epassword,
				phonenumber,
				bdate,
				salary,
				title,
				dno,
			),
		)
		connection.commit()
		return True
	finally:
		cursor.close()


def create_employee(
	ename: str,
	email: str,
	epassword: str,
	phonenumber: str,
	bdate: str,
	salary: float,
	title: str,
	dno: int,
) -> bool:
	"""Open a MySQL connection, insert an employee, and close cleanly."""
	connection = None
	try:
		connection = mysql.connector.connect(
			host=os.getenv("MYSQL_HOST", "127.0.0.1"),
			port=int(os.getenv("MYSQL_PORT", "3309")),
			user=os.getenv("MYSQL_USER", "tasklist"),
			password=os.getenv("MYSQL_PASSWORD", "password"),
			database=os.getenv("MYSQL_DB", "tasklist"),
		)
		return insert_employee(
			connection=connection,
			ename=ename,
			email=email,
			epassword=epassword,
			phonenumber=phonenumber,
			bdate=bdate,
			salary=salary,
			title=title,
			dno=dno,
		)
	except Error as exc:
		raise RuntimeError(f"Failed to insert employee: {exc}") from exc
	finally:
		if connection is not None and connection.is_connected():
			connection.close()


def delete_employee_row(
	connection: Any,
	eno: int,
) -> bool:
	"""Delete an employee row by eno and return a success flag."""
	query = (
		"DELETE FROM employees "
		"WHERE eno = %s"
	)

	cursor = connection.cursor()
	try:
		cursor.execute(
			query,
			(
				eno,
			),
		)
		connection.commit()
		return cursor.rowcount > 0
	finally:
		cursor.close()


def delete_employee(
	eno: int,
) -> bool:
	"""Open a MySQL connection, delete an employee by eno, and close cleanly."""
	connection = None
	try:
		connection = mysql.connector.connect(
			host=os.getenv("MYSQL_HOST", "127.0.0.1"),
			port=int(os.getenv("MYSQL_PORT", "3309")),
			user=os.getenv("MYSQL_USER", "tasklist"),
			password=os.getenv("MYSQL_PASSWORD", "password"),
			database=os.getenv("MYSQL_DB", "tasklist"),
		)
		return delete_employee_row(
			connection=connection,
			eno=eno,
		)
	except Error as exc:
		raise RuntimeError(f"Failed to delete employee: {exc}") from exc
	finally:
		if connection is not None and connection.is_connected():
			connection.close()