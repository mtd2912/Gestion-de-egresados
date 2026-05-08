import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.faculty_model import faculty
from fastapi.encoders import jsonable_encoder

class faculty_controller():
    def create_faculty(self, faculty: faculty):
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query = "INSERT INTO faculty (name,active) VALUES (%s,%s)"
            cursor.execute(query, (faculty.name, faculty.active))
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
    def get_faculty(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM faculty WHERE active = %s", (True,))
            columns = [desc[0] for desc in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            conn.close()
            return results
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_faculty_by_id(self, id_faculty):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            query = "SELECT * FROM faculty WHERE id_faculty = %s"
            cursor.execute(query, (id_faculty,))
            result = cursor.fetchone()
            if result:
                faculty = {
                    "id_faculty": result[0],
                    "name": result[1],
                    "active": result[2],
                    "creation_date": result[3],
                    "update_date": result[4]
                }
                return faculty
            else:
                raise HTTPException(status_code=404, detail="Faculty not found")
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
    def edit_faculty(self, id_faculty, faculty: faculty):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute("UPDATE faculty SET name = %s, active = %s WHERE id_faculty = %s", (faculty.name,faculty.active,id_faculty))
            connection.commit()
            cursor.close()
            return {"message": "Faculty updated successfully"}
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            connection.close()
    def delete_faculty(self, id_faculty):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute("UPDATE faculty SET active = %s WHERE id_faculty = %s", (False, id_faculty))
            connection.commit()
            cursor.close()
            return {"message": "Faculty deleted successfully"}
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            connection.close()