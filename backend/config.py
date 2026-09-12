from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Default to prod: an unset ENVIRONMENT must not expose the interactive
    # API docs. Neither container sets this var, so the default IS production.
    environment: str = "prod"
    spark_swarm_api_url: str = "https://sparkswarm.com/api/v1"
    spark_swarm_api_key: str | None = None


settings = Settings()
