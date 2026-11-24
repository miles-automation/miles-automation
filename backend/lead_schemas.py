from pydantic import BaseModel, Field, ValidationInfo, field_validator

APPROVED_TAGS = {
    "utm_source": frozenset(
        {"google", "bing", "linkedin", "upwork", "direct", "newsletter"}
    ),
    "utm_medium": frozenset({"cpc", "paid_social", "organic", "referral", "email"}),
    "utm_campaign": frozenset({"miles_launch", "app_performance", "pre_ship_review"}),
}


class LeadRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: str = Field(min_length=1, max_length=320)
    company: str | None = Field(default=None, max_length=200)
    message: str | None = Field(default=None, max_length=5000)
    website: str | None = Field(default=None, max_length=200)

    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None

    @field_validator("utm_source", "utm_medium", "utm_campaign", mode="before")
    @classmethod
    def keep_approved_tag(cls, value: object, info: ValidationInfo) -> str | None:
        field = info.field_name
        if field and isinstance(value, str) and value in APPROVED_TAGS[field]:
            return value
        return None

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
