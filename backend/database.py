import os
import mysql.connector
from mysql.connector.cursor import MySQLCursorDict
from mysql.connector.abstracts import MySQLConnectionAbstract
from mysql.connector.pooling import PooledMySQLConnection


def connection() -> (
    tuple[PooledMySQLConnection | MySQLConnectionAbstract, MySQLCursorDict]
):
    sql = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "127.0.0.1"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER", "tasklist"),
        password=os.getenv("MYSQL_PASSWORD", "password"),
        database=os.getenv("MYSQL_DB", "tasklist"),
    )
    cursor: MySQLCursorDict = sql.cursor(dictionary=True)  # type: ignore[assignment]
    return sql, cursor
