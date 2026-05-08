from fastapi import APIRouter, HTTPException, Depends, Request
from config.security import verificar_acceso_modulo, oauth2_scheme

from controllers.jobs_controller import jobs_controller
from models.jobs_model import jobs

router = APIRouter()

new_job = jobs_controller()

@router.post("/create_job") 
async def create_job(  job: jobs, request:Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "jobs")
    return new_job.create_job(job)

@router.get("/get_jobs")
async def get_jobs(  request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "jobs")
    return new_job.get_jobs()

@router.get("/get_job/{id_job}")
async def get_job( id_job: int, request:Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "jobs")
    return new_job.get_job(id_job)

@router.put("/edit_job/{id_job}")
async def edit_job( id_job: int, job: jobs, request:Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "jobs")
    return new_job.edit_job(id_job, job)

@router.delete("/delete_job/{id_job}")
async def delete_job(  id_job: int, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "jobs")
    return new_job.delete_job(id_job)