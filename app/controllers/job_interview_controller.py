import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.job_interview_model import job_interview
from fastapi.encoders import jsonable_encoder

class job_interview_controller:
    def create_job_interview(self, job_interview: job_interview):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            values=(job_interview.id_graduate,job_interview.currently_employed,job_interview.related,job_interview.salary,job_interview.id_type)
            cursor.execute("INSERT INTO job_interview(id_graduate,currently_employed,related,salary,id_type) VALUES (%s,%s,%s,%s,%s)",values)
            conn.commit()
            return {"message":"job interview created"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_job_interviews(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM job_interview")
            result = cursor.fetchall()
            if result:
                return result
            else:
                raise HTTPException(status_code=404, detail="job interviews not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_job_interview(self, id_interview: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM job_interview WHERE id_interview = %s", (id_interview,))
            result = cursor.fetchone()
            if result:
                return result
            else:
                raise HTTPException(status_code=404, detail="job interview not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def edit_job_interview(self, id_job_interview: int, job_interview: job_interview):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query="update job_interview set id_graduate=%s,currently_employed=%s,related=%s,salary=%s,id_type=%s where id_interview=%s"
            values=(job_interview.id_graduate,job_interview.currently_employed,job_interview.related,job_interview.salary,job_interview.id_type,id_job_interview)
            cursor.execute(query,values)
            conn.commit()
            return {"message": "job interview updated successfully"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def delete_job_interview(self, id_job_interview: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM job_interview WHERE id_interview = %s", (id_job_interview,))
            conn.commit()
            return {"message": "job interview deleted successfully"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()