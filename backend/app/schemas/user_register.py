from pydantic import BaseModel, ConfigDict, StrictInt, StrictStr, field_validator


class UserRegisterInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nome: StrictStr
    email: StrictStr
    senha: StrictStr
    confirmacao_senha: StrictStr
    id_curso: StrictInt

    @field_validator("nome", mode="before")
    @classmethod
    def normalize_nome(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip().lower()
        return value
