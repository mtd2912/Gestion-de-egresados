from pydantic import BaseModel
from datetime import date
class job_offer(BaseModel):
    id_job_offer: int = None
    position: str
    company: str
    salary: float
    id_type: int
    area: str
    email_contact: str
    offer_date: date
    program: int
    active: bool 