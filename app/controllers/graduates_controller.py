import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.graduates_model import graduates
from fastapi.encoders import jsonable_encoder

class graduates_controller:
    def create_graduates(self, graduates: graduates):
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry = "INSERT INTO graduates (first_name, last_name, email, phone, birth_date, graduation_year, id_level, id_status, id_program, active) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(querry,(graduates.first_name, graduates.last_name, graduates.email, graduates.phone, graduates.birth_date, graduates.graduation_year, graduates.id_level, graduates.id_status, graduates.id_program, graduates.active))
            conn.commit()
            return {"resultado": "Nivel academico creado"}
        except Exception as err:
            if conn:
                conn.rollback()
            print(f"ERROR: {err}")
            return {"error": str(err)}
        finally:
            if conn:
                conn.close()
    def get_graduate(self, id_graduate: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM graduates WHERE id_graduate = %s", (id_graduate,))
            row = cursor.fetchone()
            if row:
                graduates={
                    "id_graduate": row[0],
                    "first_name": row[1],
                    "last_name": row[2],
                    "email": row[3],
                    "phone": row[4],
                    "birth_date": row[5],
                    "graduation_year": row[6],
                    "id_level": row[7],
                    "id_status": row[8],
                    "id_program": row[9],
                    "active": row[10],
                    "creation_date": row[11],
                    "update_date": row[12]
                }
                return graduates
            else:
                raise HTTPException(status_code=404, detail="graduates not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    def get_graduates(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT 
                    g.*,
                    p.program_name,
                    al.description AS academic_level,
                    es.description AS employment_status
                FROM graduates g
                JOIN program p ON g.id_program = p.id_program
                JOIN academic_levels al ON g.id_level = al.id_level
                JOIN employment_statuses es ON g.id_status = es.id_status
                order BY g.id_graduate
            """)
            result = cursor.fetchall()
            graduates = []
            for row in result:
                graduates.append({
                    "id_graduate": row[0],
                    "first_name": row[1],
                    "last_name": row[2],
                    "email": row[3],
                    "phone": row[4],
                    "birth_date": row[5],
                    "graduation_year": row[6],
                    "id_level": row[7],
                    "id_status": row[8],
                    "id_program": row[9],
                    "active": row[10],
                    "creation_date": row[11],
                    "update_date": row[12],
                    "program_name": row[13],
                    "academic_level": row[14],
                    "employment_status": row[15]
                })
            if graduates:
                return graduates
            else:
                raise HTTPException(status_code=404, detail="graduates not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def edit_graduate(self,id_graduate: int, graduates: graduates):
        try:
            conn=get_db_connection()
            cursor=conn.cursor()
            querry="UPDATE graduates SET first_name = %s, last_name = %s, email = %s, phone = %s, birth_date = %s, graduation_year = %s, id_level = %s, id_status = %s, id_program = %s, active = %s WHERE id_graduate = %s"
            values=(graduates.first_name, graduates.last_name, graduates.email, graduates.phone, graduates.birth_date, graduates.graduation_year, graduates.id_level, graduates.id_status, graduates.id_program, graduates.active, id_graduate)
            cursor.execute(querry, values)
            conn.commit()
            cursor.close()
            return {"resultado": "graduates editado"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def delete_graduate(self, id_graduate: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE graduates SET active = %s WHERE id_graduate = %s", (False, id_graduate))
            conn.commit()
            cursor.close()
            return {"resultado": "graduates eliminado"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()