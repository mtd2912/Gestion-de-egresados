from pydantic import BaseModel
class job_interview(BaseModel):
    id_interview: int = None
    id_graduate: int
    currently_employed: bool
    related: bool
    salary: float
    id_type: int
