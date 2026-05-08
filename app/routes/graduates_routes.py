from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_acceso_modulo, oauth2_scheme
from controllers.graduates_controller import graduates_controller
from models.graduates_model import graduates

router = APIRouter()

new_graduates = graduates_controller()

@router.post("/create_graduates")
async def create_graduates(graduates: graduates, request: Request, token: str = Depends(oauth2_scheme)):    
    verificar_acceso_modulo(request, "graduates")
    return new_graduates.create_graduates(graduates)

@router.get("/get_graduates")
async def get_graduates(request: Request, token: str = Depends(oauth2_scheme)):    
    verificar_acceso_modulo(request, "graduates")
    return new_graduates.get_graduates()

@router.get("/get_graduates/{id_graduate}")
async def get_graduate(id_graduate: int, request: Request, token: str = Depends(oauth2_scheme)):    
    verificar_acceso_modulo(request, "graduates")
    return new_graduates.get_graduate(id_graduate)

@router.put("/edit_graduates/{id_graduate}")
async def edit_graduate(id_graduate: int, graduates: graduates, request: Request, token: str = Depends(oauth2_scheme)):    
    verificar_acceso_modulo(request, "graduates")
    return new_graduates.edit_graduate(id_graduate, graduates)

@router.delete("/delete_graduates/{id_graduate}")
async def delete_graduate(id_graduate: int, request: Request, token: str = Depends(oauth2_scheme)):    
    verificar_acceso_modulo(request, "graduates")
    return new_graduates.delete_graduate(id_graduate)