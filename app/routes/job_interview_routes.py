from fastapi import APIRouter, HTTPException
from controllers.job_interview_controller import *

from models.job_interview_model import job_interview

router = APIRouter()

new_job_interview = job_interview_controller()

@router.post("/create_job_interview")
async def create_job_interview(job_interview: job_interview):
    return new_job_interview.create_job_interview(job_interview)

@router.get("/get_job_interviews")
async def get_job_interviews():
    return new_job_interview.get_job_interviews()

@router.get("/get_job_interview/{id_job_interview}")
async def get_job_interview(id_job_interview: int):
    return new_job_interview.get_job_interview(id_job_interview)

@router.put("/edit_job_interview/{id_job_interview}")
async def edit_job_interview(id_job_interview: int, job_interview: job_interview):
    return new_job_interview.edit_job_interview(id_job_interview, job_interview)

@router.delete("/delete_job_interview/{id_job_interview}")
async def delete_job_interview(id_job_interview: int):
    return new_job_interview.delete_job_interview(id_job_interview)