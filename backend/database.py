import os
import mysql.connector


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
