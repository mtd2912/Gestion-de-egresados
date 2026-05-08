from fastapi import APIRouter, HTTPException, Form
from config.security import crear_token 
from controllers.user_controller import user_controller 

router = APIRouter()
user_ctrl = user_controller()

@router.post("/login")
async def login_U(
    username: str = Form(..., description="Tu correo electrónico"), 
    password: str = Form(..., description="Tu contraseña")
):
    user_data = user_ctrl.validar_user(username, password)

    if isinstance(user_data, dict) and user_data.get("Resultado") == "User not found":
        raise HTTPException(
            status_code=401, 
            detail="Credenciales incorrectas"
        )
        
    sub = user_data["email"]
    id_type = user_data["id_type"]
    token = crear_token(sub, id_type)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "rol": id_type
    }