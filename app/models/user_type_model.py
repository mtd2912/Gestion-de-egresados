from pydantic import BaseModel
class user_type(BaseModel):
    id_type: int = None
    description: str
    active: bool