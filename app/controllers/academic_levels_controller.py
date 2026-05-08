import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.academic_levels_model import academic_levels
from fastapi.encoders import jsonable_encoder

class academic_levels_controller():
    def create_academic_level(self, AcademicLevel: academic_levels):
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query = "INSERT INTO academic_levels (description, active) VALUES (%s, %s)"
            cursor.execute(query, (AcademicLevel.description, AcademicLevel.active))
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
    def get_academic_level(self, id_level: int):
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query = "SELECT * FROM academic_levels WHERE id_level = %s"
            cursor.execute(query, (id_level,))
            row = cursor.fetchone()
            if row:
                return {
                    "id_level": row[0],
                    "description": row[1],
                    "active": row[2],
                    "creation_date": row[3],
                    "update_date": row[4]
                }
            else:
                return {"error": f"No se encontró el nivel académico con ID {id_level}"}   
        except Exception as err:
            print(f"Error en GET BY ID: {err}")
            return {"error": str(err)}
        finally:
            if conn:
                conn.close()
    def get_academic_levels(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM academic_levels WHERE active = %s", (True,))
            result = cursor.fetchall()
            academic_levels = []
            for row in result:
                academic_levels.append({
                    "id_level": row[0],
                    "description": row[1],
                    "active": row[2],
                    "creation_date": row[3],
                    "update_date": row[4]
                })
            if academic_levels:
                return academic_levels
            else:
                raise HTTPException(status_code=404, detail="academic levels not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def edit_academic_level(self, id_level: int, AcademicLevel: academic_levels):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE academic_levels SET description = %s, active = %s WHERE id_level = %s", (AcademicLevel.description, AcademicLevel.active, id_level))
            conn.commit()
            conn.close()
            return {"resultado": "Nivel academico actualizado"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def delete_academic_level(self, id_level: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE academic_levels SET active = %s WHERE id_level = %s", (False, id_level))
            conn.commit()
            conn.close()
            return {"resultado": "Nivel academico eliminado"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()