from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_admin, oauth2_scheme
from controllers.user_controller import user_controller
from models.user_model import users

router = APIRouter()

new_user = user_controller()

@router.post("/create_user")
async def create_user(user_data: users):
    return new_user.create_user(user_data)

@router.get("/get_all_users")
async def get_all_users(
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    verificar_admin(request)
    return new_user.get_all_users()

@router.get("/get_user/{id_user}")
async def get_user(
    id_user: int,
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    verificar_admin(request)
    return new_user.get_user(id_user)

@router.put("/edit_user/{id_user}")
async def edit_user(
    id_user: int,
    user_data: users,
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    verificar_admin(request)
    return new_user.edit_user(id_user, user_data)

@router.delete("/delete_user/{id_user}")
async def delete_user(
    id_user: int,
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    verificar_admin(request)
    return new_user.delete_user(id_user)

@router.post("/validar_user")
async def validar_user(email: str, password: str):
    return new_user.validar_user(email, password)