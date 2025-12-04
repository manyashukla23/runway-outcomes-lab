import os
from typing import Optional


class Settings:
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:12345@localhost:5432/thelook"
    )


settings = Settings()

