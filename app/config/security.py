from datetime import datetime, timedelta
from fastapi import Request, HTTPException
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "clave_super_segura"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

MODULOS_ADMIN = [
    "program", "faculty", "academic_levels", "employment_statuses",
    "contract_types", "sectors", "continuing_education", "work_supervisor",
    "jobs", "job_offer", "roles", "user_types", "users", "reports"
]

MODULOS_EGRESADOS = ["job_offer"]
METODOS_LECTURA = {"GET"}
METODOS_ESCRITURA = {"POST", "PUT", "DELETE"}

def crear_token(user: str, rol: int):
    payload = {
        "user": user,
        "rol": rol,
        "exp": datetime.utcnow() + timedelta(minutes=60)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(request: Request) -> dict:
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Token requerido")
    try:
        token = token.replace("Bearer ", "")
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return data
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")

def verificar_rol(request: Request, roles_permitidos: list[int]):
    data = verificar_token(request)
    if data["rol"] not in roles_permitidos:
        raise HTTPException(status_code=403, detail="No tienes permisos")
    return data

def verificar_acceso_modulo(request: Request, modulo: str):
    
    data    = verificar_token(request)
    rol     = data["rol"]
    metodo  = request.method

    if rol == 1:
        if modulo in MODULOS_ADMIN:
            return data
    if rol == 2:
        if modulo in MODULOS_ADMIN and metodo in METODOS_LECTURA:
            return data
        if metodo in METODOS_ESCRITURA:
            raise HTTPException(status_code=403,detail="Los administrativos solo pueden consultar, no crear/editar/eliminar")
    if rol == 3:
        if modulo in MODULOS_EGRESADOS and metodo in METODOS_LECTURA:
            return data
    raise HTTPException(status_code=403, detail="No tienes permisos para acceder a este módulo")

def verificar_admin(request: Request):
    data = verificar_token(request)
    if data["rol"] != 1:
        raise HTTPException(status_code=403, detail="Solo administradores pueden realizar esta acción")
    return data

def rol_requerido(roles_permitidos: list[int]):
    def wrapper(request: Request):
        return verificar_rol(request, roles_permitidos)
    return wrapper