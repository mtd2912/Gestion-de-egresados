from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_admin, oauth2_scheme
from controllers.user_type_controller import user_type_controller
from models.user_type_model import user_type

router = APIRouter()

new_user_type = user_type_controller()

@router.post("/create_user_type")
async def create_user_type(user_type: user_type, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_admin(request)
    return new_user_type.create_user_type(user_type)

@router.get("/get_all_user_type")
async def get_all_user_type( request: Request, token: str = Depends(oauth2_scheme)):
    verificar_admin(request)
    return new_user_type.get_all_user_type()

@router.get("/get_user_type/{id_type}")
async def get_user_type(id_type: int, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_admin(request)
    return new_user_type.get_user_type(id_type)

@router.put("/edit_user_type/{id_type}")
async def edit_user_type(id_type: int, user_type: user_type, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_admin(request)
    return new_user_type.edit_user_type(id_type, user_type)

@router.delete("/delete_user_type/{id_type}")
async def delete_user_type(id_type: int, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_admin(request)
    return new_user_type.delete_user_type(id_type)