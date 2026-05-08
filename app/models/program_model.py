from datetime import date
from pydantic import BaseModel

class program(BaseModel):
    id_programa: int = None
    program_name: str
    faculty: int
    active: bool