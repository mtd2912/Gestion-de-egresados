from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_acceso_modulo, oauth2_scheme
from controllers.faculty_controller import faculty_controller
from models.faculty_model import faculty

router = APIRouter()

new_faculty = faculty_controller()

@router.post("/create_faculties")
async def create_faculty(faculty: faculty, request:Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "faculty")
    return new_faculty.create_faculty(faculty)

@router.get("/get_faculties")
async def get_faculties(
    request: Request, 
    token: str = Depends(oauth2_scheme)
):
    verificar_acceso_modulo(request, "faculty")
    return new_faculty.get_faculty()

@router.get("/get_faculty/{id_faculty}")
async def get_faculty(id_faculty: int, request:Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "faculty")
    return new_faculty.get_faculty_by_id(id_faculty)

@router.put("/edit_faculty/{id_faculty}")
async def edit_faculty(id_faculty: int, faculty: faculty, request:Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "faculty")
    return new_faculty.edit_faculty(id_faculty, faculty)

@router.delete("/delete_faculty/{id_faculty}")
async def delete_faculty(id_faculty: int, request:Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "faculty")
    return new_faculty.delete_faculty(id_faculty)