from pydantic import BaseModel
from datetime import date
class jobs(BaseModel):
    id_job: int = None
    id_graduate: int
    company: str
    id_sector: int
    position: str
    salary: float
    start_date: date
    end_date: date
    id_type: int
    related_to_career: bool
    active: bool