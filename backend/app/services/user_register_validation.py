from email.utils import parseaddr

from app.schemas.user_register import UserRegisterInput


class UserRegisterValidationError(Exception):
    def __init__(self, detail: str):
        super().__init__(detail)
        self.detail = detail


def validate_user_register_business_rules(payload: UserRegisterInput) -> None:
    _validate_nome(payload.nome)
    _validate_email(payload.email)
    _validate_senha(payload.senha)
    _validate_confirmacao_senha(payload.senha, payload.confirmacao_senha)


def _validate_nome(nome: str) -> None:
    if _is_blank(nome):
        raise UserRegisterValidationError("nome e obrigatorio")

    if any(not (char.isalpha() or char == " ") for char in nome):
        raise UserRegisterValidationError("nome deve conter apenas letras e espacos")


def _validate_email(email: str) -> None:
    if _is_blank(email):
        raise UserRegisterValidationError("email e obrigatorio")

    if not _is_valid_email_format(email):
        raise UserRegisterValidationError("email deve ter um formato valido")


def _validate_senha(senha: str) -> None:
    if _is_blank(senha):
        raise UserRegisterValidationError("senha e obrigatoria")

    has_upper = any(char.isupper() for char in senha)
    has_lower = any(char.islower() for char in senha)
    has_digit = any(char.isdigit() for char in senha)
    has_special = any(not char.isalnum() and not char.isspace() for char in senha)

    if len(senha) < 8 or not has_upper or not has_lower or not has_digit or not has_special:
        raise UserRegisterValidationError(
            "senha deve ter no minimo 8 caracteres, 1 letra maiuscula, 1 letra minuscula, 1 numero e 1 caractere especial"
        )


def _validate_confirmacao_senha(senha: str, confirmacao_senha: str) -> None:
    if _is_blank(confirmacao_senha):
        raise UserRegisterValidationError("confirmacao_senha e obrigatoria")

    if senha != confirmacao_senha:
        raise UserRegisterValidationError("confirmacao_senha deve ser igual a senha")


def _is_blank(value: str) -> bool:
    return value.strip() == ""


def _is_valid_email_format(email: str) -> bool:
    parsed_email = parseaddr(email)[1]
    if parsed_email != email or email.count("@") != 1:
        return False

    local_part, domain = email.rsplit("@", 1)
    if not local_part or not domain or "." not in domain:
        return False

    if domain.startswith(".") or domain.endswith(".") or ".." in email:
        return False

    return True
