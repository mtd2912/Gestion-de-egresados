from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_acceso_modulo, oauth2_scheme
from controllers.work_supervisor_controller import work_supervisor_controller
from models.work_supervisor_model import work_supervisor

router = APIRouter()

new_work_supervisor = work_supervisor_controller()

@router.post("/create_work_supervisor")
async def create_work_supervisor(work_supervisor: work_supervisor, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "work_supervisor")
    return new_work_supervisor.create_work_supervisor(work_supervisor)

@router.get("/get_all_work_supervisor")
async def get_all_work_supervisor(request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "work_supervisor")
    return new_work_supervisor.get_all_work_supervisor()

@router.get("/get_work_supervisor/{id_supervisor}")
async def get_work_supervisor(id_supervisor: int, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "work_supervisor")
    return new_work_supervisor.get_work_supervisor(id_supervisor)

@router.put("/edit_work_supervisor/{id_supervisor}")
async def edit_work_supervisor(id_supervisor: int, work_supervisor: work_supervisor, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "work_supervisor")
    return new_work_supervisor.edit_work_supervisor(id_supervisor, work_supervisor)

@router.delete("/delete_work_supervisor/{id_supervisor}")
async def delete_work_supervisor(id_supervisor: int, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "work_supervisor")
    return new_work_supervisor.delete_work_supervisor(id_supervisor)