import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.continuing_education_model import continuing_education
from fastapi.encoders import jsonable_encoder

class continuing_education_controller:
    def create_continuing_education(self, data: continuing_education):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="INSERT INTO continuing_education (id_graduate, description_program, education_type, time, education_date, active) VALUES (%s, %s, %s, %s, %s, %s)"
            cursor.execute(querry,(data.id_graduate, data.description_program, data.education_type, data.time, data.education_date, data.active))
            conn.commit()
            return {"employment status created successfully"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_continuing_education(self):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            query = "SELECT * FROM continuing_education WHERE active = %s"
            cursor.execute(query, (True,))
            result = cursor.fetchall()
            continued_education = []
            for row in result:
                continued_education.append({
                    "id_continuing_education": row[0],
                    "id_graduate": row[1],
                    "description_program": row[2],
                    "education_type": row[3],
                    "time": row[4],
                    "education_date": row[5],
                    "active": row[6],
                    "creation_date": row[7],
                    "update_date": row[8]
                })
            if continued_education:
                return continued_education
            else:
                raise HTTPException(status_code=404, detail="Continuing education not found")
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
    def get_continuing_education_by_id(self, id_continuing_education):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            query = "SELECT * FROM continuing_education WHERE id_continuing_education = %s"
            cursor.execute(query, (id_continuing_education,))
            row = cursor.fetchone()
            if row:
                continued_education={
                    "id_continuing_education": row[0],
                    "id_graduate": row[1],
                    "description_program": row[2],
                    "education_type": row[3],
                    "time": row[4],
                    "education_date": row[5],
                    "active": row[6],
                    "creation_date": row[7],
                    "update_date": row[8]
                }
                return continued_education
            else:
                raise HTTPException(status_code=404, detail="Continuing education not found")
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
    def edit_continuing_education(self, id_continuing_education, continuing_education:continuing_education):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            query = "UPDATE continuing_education SET description_program = %s, education_type = %s, time = %s, education_date = %s, active = %s WHERE id_continuing_education = %s"
            values = (continuing_education.description_program, continuing_education.education_type, continuing_education.time, continuing_education.education_date, True, id_continuing_education)
            cursor.execute(query, values)
            connection.commit()
            cursor.close()
            return {"message": "Continuing education updated successfully"}
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            connection.close()
    def delete_continuing_education(self, id_continuing_education):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            query = "UPDATE continuing_education SET active = %s WHERE id_continuing_education = %s"
            values = (False, id_continuing_education)
            cursor.execute(query, values)
            connection.commit()
            cursor.close()
            return {"message": "Continuing education delete successfully"}
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            connection.close()