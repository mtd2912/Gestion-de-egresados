import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.employment_statuses_model import employment_statuses
from fastapi.encoders import jsonable_encoder

class employment_statuses_controller():
    def create_employment_status(self, employment_status: employment_statuses):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="INSERT INTO employment_statuses (description, active) VALUES (%s,%s)"
            cursor.execute(querry, (employment_status.description, employment_status.active))
            conn.commit()
            return {"employment status created successfully"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_employment_status(self, id_status: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM employment_statuses WHERE id_status = %s", (id_status,))
            row= cursor.fetchone()
            if row:
                employment_statuses={
                    "id_status": row[0],
                    "description": row[1],
                    "active": row[2],
                    "creation_date": row[3],
                    "update_date": row[4]
                }
                return employment_statuses
            else:
                raise HTTPException(status_code=404, detail="employment status not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_employment_statuses(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM employment_statuses WHERE active = %s", (True,))
            result = cursor.fetchall()
            employment_statuses = []
            for row in result:
                employment_statuses.append({
                    "id_status": row[0],
                    "description": row[1],
                    "active": row[2],
                    "creation_date": row[3],
                    "update_date": row[4]
                })
            if employment_statuses:
                return employment_statuses
            else:
                raise HTTPException(status_code=404, detail="employment status not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def edit_employment_status(self, id_status: int, employment_status: employment_statuses):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="UPDATE employment_statuses SET description = %s, active = %s WHERE id_status = %s"
            cursor.execute(querry, (employment_status.description, employment_status.active, id_status))
            conn.commit()
            return {"message": "employment status updated successfully"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def delete_employment_status(self, id_status: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="UPDATE employment_statuses SET active = %s WHERE id_status = %s"
            cursor.execute(querry, (False, id_status))
            conn.commit()
            return {"message": "employment status deleted successfully"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
            