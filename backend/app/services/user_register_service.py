from psycopg import Connection

from app.respositories.user_register_repository import create_user, course_exists, email_exists
from app.schemas.user_register import UserRegisterInput
from app.services.password_hasher import hash_password
from app.services.user_register_validation import validate_user_register_business_rules


class UserAlreadyExistsError(Exception):
    def __init__(self, detail: str = "email ja cadastrado"):
        super().__init__(detail)
        self.detail = detail


class CourseNotFoundError(Exception):
    def __init__(self, detail: str = "curso nao encontrado"):
        super().__init__(detail)
        self.detail = detail


def register_user(connection: Connection, payload: UserRegisterInput) -> int:
    validate_user_register_business_rules(payload)

    if email_exists(connection, payload.email):
        raise UserAlreadyExistsError()

    if not course_exists(connection, payload.id_curso):
        raise CourseNotFoundError()

    senha_hash = hash_password(payload.senha)

    return create_user(
        connection,
        nome=payload.nome,
        email=payload.email,
        senha_hash=senha_hash,
        id_curso=payload.id_curso,
    )
