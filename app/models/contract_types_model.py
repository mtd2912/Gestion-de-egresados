from datetime import date

from pydantic import BaseModel
class contract_types(BaseModel):
    id_contract_type: int = None
    contract_name: str
    description: str
    duration: str
    active: bool