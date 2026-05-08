from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_acceso_modulo, oauth2_scheme

from controllers.sectors_controller import sectors_controller
from models.sectors_model import sectors

router = APIRouter()

new_sector = sectors_controller()

@router.post("/create_sector")
async def create_sector(sector: sectors,  request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "sectors")
    return new_sector.create_sector(sector)

@router.get("/get_sectors")
async def get_sectors(request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "sectors") 
    return new_sector.get_sectors()

@router.get("/get_sector/{id_sector}")
async def get_sector(id_sector: int,  request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "sectors")
    return new_sector.get_sector(id_sector)

@router.put("/edit_sector/{id_sector}")
async def edit_sector(id_sector: int, sector: sectors, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "sectors")
    return new_sector.edit_sector(id_sector, sector)

@router.delete("/delete_sector/{id_sector}")
async def delete_sector(id_sector: int, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "sectors")
    return new_sector.delete_sectors(id_sector)