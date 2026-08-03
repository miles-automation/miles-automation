from pydantic import BaseModel, Field, field_validator


class LeadRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: str = Field(min_length=1, max_length=320)
    company: str | None = Field(default=None, max_length=200)
    message: str | None = Field(default=None, max_length=5000)
    website: str | None = Field(default=None, max_length=200)

    @field_validator("name", "email")
    @classmethod
    def validate_non_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must not be empty")
        return value

    @field_validator("email")
    @classmethod
    def validate_email_contains_at(cls, value: str) -> str:
        if "@" not in value:
            raise ValueError("must contain @")
        return value
