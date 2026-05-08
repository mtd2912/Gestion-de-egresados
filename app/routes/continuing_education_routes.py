from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_acceso_modulo, oauth2_scheme
from controllers.continuing_education_controller import continuing_education_controller
from models.continuing_education_model import continuing_education

router = APIRouter()

new_continuing_education = continuing_education_controller()

@router.post("/create_continuing_education")
async def create_continuing_education(
    continuing_education: continuing_education,
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    verificar_acceso_modulo(request, "continuing_education")
    return new_continuing_education.create_continuing_education(continuing_education)

@router.get("/get_continuing_education")
async def get_continuing_education(
    request: Request,
    token: str = Depends(oauth2_scheme)
):    
    verificar_acceso_modulo(request, "continuing_education")
    return new_continuing_education.get_continuing_education()

@router.get("/get_continuing_education_by_id/{id_continuing_education}")
async def get_continuing_education_by_id(
    id_continuing_education: int,
    request: Request,
    token: str = Depends(oauth2_scheme)
):    
    verificar_acceso_modulo(request, "continuing_education")
    return new_continuing_education.get_continuing_education_by_id(id_continuing_education)

@router.put("/edit_continuing_education/{id_continuing_education}")
async def edit_continuing_education(
    id_continuing_education: int,
    continuing_education: continuing_education,
    request: Request,
    token: str = Depends(oauth2_scheme)
):    
    verificar_acceso_modulo(request, "continuing_education")
    return new_continuing_education.edit_continuing_education(id_continuing_education, continuing_education)

@router.delete("/delete_continuing_education/{id_continuing_education}")
async def delete_continuing_education(
    id_continuing_education: int,
    request: Request,
    token: str = Depends(oauth2_scheme)
):    
    verificar_acceso_modulo(request, "continuing_education")
    return new_continuing_education.delete_continuing_education(id_continuing_education)