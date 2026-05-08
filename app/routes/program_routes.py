from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_acceso_modulo, oauth2_scheme
from controllers.program_controller import proram_controller
from models.program_model import program

router = APIRouter()

new_program = proram_controller()

@router.post("/create_program")
async def create_program(
    Program: program,
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    verificar_acceso_modulo(request, "program")
    return new_program.create_program(Program)

@router.get("/get_program/{program_id}")
async def get_program(
    program_id: int,
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    verificar_acceso_modulo(request, "program")
    return new_program.get_program(program_id)

@router.get("/get_programs")
async def get_programs(
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    verificar_acceso_modulo(request, "program")
    return new_program.get_programs()

@router.put("/edit_program/{program_id}")
async def edit_program(
    program_id: int,
    Program: program,
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    verificar_acceso_modulo(request, "program")
    return new_program.edit_program(program_id, Program)

@router.delete("/delete_program/{program_id}")
async def delete_program(
    program_id: int,
    request: Request,
    token: str = Depends(oauth2_scheme)
):
    verificar_acceso_modulo(request, "program")
    return new_program.delete_program(program_id)