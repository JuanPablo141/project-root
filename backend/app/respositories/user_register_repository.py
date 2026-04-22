from psycopg import Connection
from psycopg.errors import UniqueViolation


class DuplicateEmailRepositoryError(Exception):
    pass


def email_exists(connection: Connection, email: str) -> bool:
    query = """
        SELECT 1
        FROM public.usuario
        WHERE LOWER(email) = LOWER(%s)
        LIMIT 1
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (email,))
        return cursor.fetchone() is not None


def course_exists(connection: Connection, id_curso: int) -> bool:
    query = """
        SELECT 1
        FROM public.curso
        WHERE id_curso = %s
        LIMIT 1
    """

    with connection.cursor() as cursor:
        cursor.execute(query, (id_curso,))
        return cursor.fetchone() is not None


def create_user(
    connection: Connection,
    *,
    nome: str,
    email: str,
    senha_hash: str,
    id_curso: int,
) -> int:
    query = """
        INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
        VALUES (%s, %s, %s, %s)
        RETURNING id_usuario
    """

    with connection.cursor() as cursor:
        try:
            cursor.execute(query, (nome, email, senha_hash, id_curso))
        except UniqueViolation as exc:
            raise DuplicateEmailRepositoryError from exc
        row = cursor.fetchone()

    if row is None:
        raise RuntimeError("Failed to create user")

    return int(row[0])
