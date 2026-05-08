from fastapi import APIRouter, HTTPException, Request, Depends
from config.security import verificar_acceso_modulo, verificar_admin, oauth2_scheme
from controllers.job_offer_controller import job_offer_controller 
from models.job_offer_model import job_offer 

router = APIRouter()

new_job_offer = job_offer_controller()

@router.post("/create_job_offer")
async def create_job_offer(job_offer: job_offer,request: Request, token: str = Depends(oauth2_scheme)):
    verificar_admin(request)
    return new_job_offer.create_job_offer(job_offer)

@router.get("/get_job_offers")
async def get_job_offers(request: Request,  token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "job_offer")
    return new_job_offer.get_job_offers()

@router.get("/get_job_offer/{id_job_offer}")
async def get_job_offer( id_job_offer: int, request: Request,  token: str = Depends(oauth2_scheme)):
    verificar_acceso_modulo(request, "job_offer")
    return new_job_offer.get_job_offer(id_job_offer)

@router.put("/edit_job_offer/{id_job_offer}")
async def edit_job_offer(id_job_offer: int,  job_offer: job_offer,  request: Request, token: str = Depends(oauth2_scheme)):
    verificar_admin(request)
    return new_job_offer.edit_job_offer(id_job_offer, job_offer)

@router.delete("/delete_job_offer/{id_job_offer}")
async def delete_job_offer(id_job_offer: int, request: Request, token: str = Depends(oauth2_scheme)):
    verificar_admin(request)
    return new_job_offer.delete_job_offer(id_job_offer)