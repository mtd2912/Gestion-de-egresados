from pydantic import BaseModel
class sectors(BaseModel):
    id_sector: int = None
    name: str
    active: bool