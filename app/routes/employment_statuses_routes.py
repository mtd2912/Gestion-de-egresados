from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_acceso_modulo, oauth2_scheme

from controllers.employment_statuses_controller import employment_statuses_controller
from models.employment_statuses_model import employment_statuses

router = APIRouter()

new_employment_status = employment_statuses_controller()

@router.post("/create_employment_status")
async def create_employment_status(employment_status: employment_statuses,request: Request,token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "employment_statuses")
    return new_employment_status.create_employment_status(employment_status)

@router.get("/get_employment_statuses")
async def get_employment_statuses(request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "employment_statuses")
    return new_employment_status.get_employment_statuses()

@router.get("/get_employment_status/{id_status}")
async def get_employment_status(id_status: int,request: Request,token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "employment_statuses")
    return new_employment_status.get_employment_status(id_status)

@router.put("/edit_employment_status/{id_status}")
async def edit_employment_status(id_status: int,employment_status: employment_statuses,request: Request,token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "employment_statuses")
    return new_employment_status.edit_employment_status(id_status, employment_status)

@router.delete("/delete_employment_status/{id_status}")
async def delete_employment_status(id_status: int,request: Request,token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "employment_statuses")
    return new_employment_status.delete_employment_status(id_status)