from datetime import date

from pydantic import BaseModel
class employment_statuses(BaseModel):
    id_status: int = None
    description: str
    active: bool