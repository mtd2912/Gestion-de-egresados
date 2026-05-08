from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_acceso_modulo, oauth2_scheme
from controllers.contract_types_controller import contract_types_controller
from models.contract_types_model import contract_types

router = APIRouter()

new_contract_type = contract_types_controller()

@router.post("/create_contract_type")
async def create_contract_type(
    contract_type: contract_types, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "contract_types")
    return new_contract_type.create_contract_type(contract_type)

@router.get("/get_contract_types")
async def get_contract_types(request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "contract_types")
    return new_contract_type.get_contract_types()

@router.get("/get_contract_type/{id_contract_type}")
async def get_contract_type(id_contract_type: int, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "contract_types")
    return new_contract_type.get_contract_type(id_contract_type)

@router.put("/edit_contract_type/{id_contract_type}")
async def edit_contract_type(id_contract_type: int, contract_type: contract_types, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "contract_types")
    return new_contract_type.edit_contract_type(id_contract_type, contract_type)

@router.delete("/delete_contract_type/{id_contract_type}")
async def delete_contract_type(id_contract_type: int, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "contract_types")
    return new_contract_type.delete_contract_type(id_contract_type)