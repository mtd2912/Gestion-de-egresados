from pydantic import BaseModel
class users(BaseModel):
    id_user: int = None
    first_name: str
    last_name: str
    email: str
    password: str
    id_type: int
    active: bool = True