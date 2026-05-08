from pydantic import BaseModel
from datetime import date, time
class continuing_education(BaseModel):
    id_continuing_education: int = None
    id_graduate: int
    description_program: str
    education_type: str
    time: time
    education_date: date
    active: bool