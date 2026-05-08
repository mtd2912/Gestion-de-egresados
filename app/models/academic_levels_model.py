from pydantic import BaseModel
class academic_levels(BaseModel):
    id_level: int = None
    description: str
    active: bool