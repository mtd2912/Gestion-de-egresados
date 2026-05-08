from pydantic import BaseModel
from datetime import date
class faculty(BaseModel):
    id_faculty: int = None
    name: str
    active: bool