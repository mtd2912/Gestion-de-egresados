from pydantic import BaseModel
from datetime import date
class graduates(BaseModel):
    id_graduate: int = None
    first_name: str
    last_name: str
    email: str
    phone: str
    birth_date: date
    graduation_year: int
    id_level: int
    id_status: int
    id_program: int
    active: bool