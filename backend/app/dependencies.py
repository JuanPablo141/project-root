import os
from collections.abc import Generator

import psycopg
from psycopg import Connection


def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured")

    return database_url


def get_db_connection() -> Generator[Connection, None, None]:
    connection = psycopg.connect(get_database_url())
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
