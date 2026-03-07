from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()  # type: ignore[call-arg]
