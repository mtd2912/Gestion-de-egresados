from pydantic import BaseModel
from datetime import date

class work_supervisor(BaseModel):
    id_supervisor: int = None
    id_program: int
    frist_name: str
    last_name: str
    id_graduate: int
    id_job: int
    contact_job: str
    active: bool