import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.job_offer_model import job_offer
from fastapi.encoders import jsonable_encoder
from datetime import date

class job_offer_controller:
    def get_job_offers(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""SELECT jo.*, 
            ct.contract_name, p.program_name
            from job_offer jo
            join contract_types ct on jo.id_type = ct.id_type
            LEFT join PROGRAM p on jo.id_program = p.id_program
            ORDER by jo.id_offer""")
            result = cursor.fetchall()
            job_offers = []
            for row in result:
                job_offers.append({
                    "id_offer": row[0],
                    "position": row[1],
                    "company": row[2],
                    "salary": row[3],
                    "id_type": row[4],
                    "area": row[5],
                    "email_contact": row[6],
                    "offer_date": row[7],
                    "id_program": row[8],
                    "active": row[9],
                    "creation_date": row[10],
                    "update_date": row[11],
                    "contract_name": row[12],
                    "program_name": row[13]
                })
            if job_offers:
                return job_offers
            else:
                raise HTTPException(status_code=404, detail="job offer not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_job_offer(self, id_job_offer: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM job_offer WHERE id_offer = %s", (id_job_offer,))
            result = cursor.fetchone()
            if result:
                job_offer={
                    "id_offer": result[0],
                    "position": result[1],
                    "company": result[2],
                    "salary": result[3],
                    "id_type": result[4],
                    "area": result[5],
                    "email_contact": result[6],
                    "offer_date": result[7],
                    "id_program": result[8],
                    "active": result[9],
                    "creation_date": result[10],
                    "update_date": result[11]
                }
                return job_offer
            else:
                raise HTTPException(status_code=404, detail="job offer not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def edit_job_offer(self,id_job_offer: int, job_offer: job_offer):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="UPDATE job_offer SET position = %s, company = %s, salary = %s, id_type = %s, area = %s, email_contact = %s, offer_date = %s, id_program = %s, active = %s WHERE id_offer = %s"
            values=(job_offer.position, job_offer.company, job_offer.salary, job_offer.id_type, job_offer.area, job_offer.email_contact, job_offer.offer_date, job_offer.program, job_offer.active, id_job_offer)
            cursor.execute(querry, values)
            conn.commit()
            conn.close()
            return {"resultado": "job offer actualizado"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def delete_job_offer(self, id_job_offer: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE job_offer SET active = %s WHERE id_offer = %s", (False, id_job_offer))
            conn.commit()
            conn.close()
            return {"resultado": "job offer eliminado"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def create_job_offer(self, job_offer: job_offer):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query = "INSERT INTO job_offer (position, company, salary, id_type, area, email_contact, offer_date, id_program, active) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
            values = (job_offer.position, job_offer.company, job_offer.salary, job_offer.id_type, job_offer.area, job_offer.email_contact, job_offer.offer_date, job_offer.program, job_offer.active)
            cursor.execute(query, values)
            conn.commit()
            conn.close()
            return {"resultado": "job offer creado"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()