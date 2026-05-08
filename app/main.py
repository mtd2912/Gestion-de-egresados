from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

from routes.program_routes import router as program_routes
from routes.employment_statuses_routes import router as employment_statuses_routes
from routes.academic_levels_routes import router as academic_levels_routes
from routes.continuing_education_routes import router as continuing_education_routes
from routes.graduates_routes import router as graduates_routes
from routes.sectors_routes import router as sectors_routes
from routes.contract_types_routes import router as contract_types_routes
from routes.job_offer_routes import router as job_offer_routes
from routes.jobs_routes import router as jobs_routes
from routes.work_supervisor_routes import router as work_supervisor_routes
from routes.job_interview_routes import router as job_interview_routes
from routes.facultu_routes import router as facultu_routes
from routes.user_type_routes import router as user_type_routes
from routes.users_routes import router as users_routes
from routes.roles_routes import router as roles_routes
from config.security import oauth2_scheme


app = FastAPI(
    title="API para el proyecto de graduados",
    description="API unificada para el proyecto de graduados con todas las funcionalidades",
    version="2.0.0",
)
origins = [
    #"http://localhost.tiangolo.com",
    "https://ep-mute-rice-amph35vl-pooler.c-5.us-east-1.aws.neon.tech",
    "http://localhost"
    #"http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite todas las conexiones (para desarrollo)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(roles_routes)
app.include_router(facultu_routes)
app.include_router(program_routes)
app.include_router(employment_statuses_routes)
app.include_router(academic_levels_routes)
app.include_router(continuing_education_routes)
app.include_router(graduates_routes)
app.include_router(sectors_routes)
app.include_router(contract_types_routes)
app.include_router(job_offer_routes)
app.include_router(jobs_routes)
app.include_router(work_supervisor_routes)
app.include_router(job_interview_routes)
app.include_router(user_type_routes)
app.include_router(users_routes)

vistas_path = os.path.join(os.path.dirname(__file__), '..', 'vistas')
app.mount("/", StaticFiles(directory=vistas_path, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)