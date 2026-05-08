import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.jobs_model import jobs
from fastapi.encoders import jsonable_encoder

class jobs_controller:
    def create_job(self, job: jobs):
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="INSERT INTO jobs (id_graduate, company, id_sector, position, salary, start_date, end_date, id_type, related_to_career, active) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(querry, (job.id_graduate, job.company, job.id_sector, job.position, job.salary, job.start_date, job.end_date, job.id_type, job.related_to_career, job.active))
            conn.commit()
            cursor.close()
            return {"Resultado": "Job created successfully"}
        except psycopg2.Error as err:
            if conn:
                conn.rollback()
            print(f"Error de Base de Datos: {err}")
            raise HTTPException(status_code=500, detail=str(err))
        finally:
            if conn:
                conn.close()
    def get_jobs(self): 
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute("""
                SELECT 
                    j.id_job,
                    j.company,
                    j.position,
                    j.salary,
                    j.start_date,
                    j.end_date,
                    j.related_to_career,
                    j.active,
                    j.creation_date,
                    j.update_date,

                    g.first_name || ' ' || g.last_name AS graduate_name,
                    s.name AS sector_name,
                    ct.contract_name

                FROM jobs j
                JOIN graduates g ON j.id_graduate = g.id_graduate
                LEFT JOIN sectors s ON j.id_sector = s.id_sector
                LEFT JOIN contract_types ct ON j.id_type = ct.id_type

                WHERE j.active = %s
                ORDER BY j.id_job
            """, (True,))

            result = cursor.fetchall()
            jobs = []

            for row in result:
                jobs.append({
                    "id_job": row[0],
                    "company": row[1],
                    "position": row[2],
                    "salary": row[3],
                    "start_date": row[4],
                    "end_date": row[5],
                    "related_to_career": row[6],
                    "active": row[7],
                    "creation_date": row[8],
                    "update_date": row[9],
                    "graduate_name": row[10],
                    "sector_name": row[11],
                    "contract_name": row[12]
                })

            if jobs:
                return jobs
            else:
                raise HTTPException(status_code=404, detail="jobs not found")

        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_job(self,id_job:int):
        try:
            conn=get_db_connection()
            cursor=conn.cursor()
            cursor.execute("select * from jobs where id_job=%s", (id_job,))
            row = cursor.fetchone() 
            if row:
                job={
                    "id_job": row[0],
                    "id_graduate": row[1],
                    "company": row[2],
                    "id_sector": row[3],
                    "position": row[4],
                    "salary": row[5],
                    "start_date": row[6],
                    "end_date": row[7],
                    "id_type": row[8],
                    "related_to_career": row[9],
                    "active": row[10],
                    "creation_date": row[11],
                    "update_date": row[12]
                }
                return job
            else:
                raise HTTPException(status_code=404, detail="job not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def edit_job(self, id_job: int, job: jobs):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="UPDATE jobs SET id_graduate=%s, company=%s, id_sector=%s, position=%s, salary=%s, start_date=%s, end_date=%s, id_type=%s, related_to_career=%s, active=%s WHERE id_job=%s"
            cursor.execute(querry, (job.id_graduate, job.company, job.id_sector, job.position, job.salary, job.start_date, job.end_date, job.id_type, job.related_to_career, job.active, id_job))
            conn.commit()
            cursor.close()        
            if job:
                return job
            else:
                raise HTTPException(status_code=404, detail="job not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def delete_job(self,id_job:int):
        try:
            conn=get_db_connection()
            cursor=conn.cursor()
            cursor.execute("UPDATE jobs SET active=%s WHERE id_job=%s", (False, id_job))
            conn.commit()
            cursor.close()
            return{"Resultado":"Job deleted"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()