import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.work_supervisor_model import work_supervisor
from fastapi.encoders import jsonable_encoder

class work_supervisor_controller:
    def create_work_supervisor(self, work_supervisor: work_supervisor):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="INSERT INTO work_supervisor (id_program, first_name, last_name, id_graduate, id_job, contact_job, active) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            values=(work_supervisor.id_program, work_supervisor.frist_name, work_supervisor.last_name, work_supervisor.id_graduate, work_supervisor.id_job, work_supervisor.contact_job, work_supervisor.active)
            cursor.execute(querry, values)
            conn.commit()
            return {"resultado": "work supervisor creado"}
        except psycopg2.Error as err:
            conn.rollback()
            return {"error": str(err)}
        finally:
            conn.close()
    def get_all_work_supervisor(self):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()

            cursor.execute("""
                SELECT 
                    ws.id_supervisor,
                    p.program_name,
                    ws.first_name,
                    ws.last_name,
                    g.first_name || ' ' || g.last_name AS graduate_name,
                    j.company AS job_company,
                    ws.contact_job,
                    ws.active,
                    ws.creation_date,
                    ws.update_date
                FROM work_supervisor ws
                JOIN program p ON ws.id_program = p.id_program
                JOIN graduates g ON ws.id_graduate = g.id_graduate
                JOIN jobs j ON ws.id_job = j.id_job
                WHERE ws.active = %s
                ORDER BY ws.id_supervisor
            """, (True,))

            result = cursor.fetchall()
            supervisors = []

            for row in result:
                supervisors.append({
                    "id_supervisor": row[0],
                    "program_name": row[1],
                    "first_name": row[2],
                    "last_name": row[3],
                    "graduate_name": row[4],
                    "job_company": row[5],
                    "contact_job": row[6],
                    "active": row[7],
                    "creation_date": row[8],
                    "update_date": row[9]
                })

            if supervisors:
                return supervisors
            else:
                raise HTTPException(status_code=404, detail="Work supervisors not found")

        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
    def get_work_supervisor(self, id_supervisor: int):
        try:
            db = get_db_connection()
            cursor = db.cursor()
            query = "SELECT * FROM work_supervisor WHERE id_supervisor = %s"
            cursor.execute(query, (id_supervisor,))
            result = cursor.fetchone()
            if result:
                work_supervisor = {
                    "id_supervisor": result[0],
                    "id_program": result[1],
                    "frist_name": result[2],
                    "last_name": result[3],
                    "id_graduate": result[4],
                    "id_job": result[5],
                    "contact_job": result[6],
                    "active": result[7],
                    "creation_date": result[8],
                    "update_date": result[9]
                }
                return work_supervisor
            else:
                raise HTTPException(status_code=404, detail="job not found")
        except psycopg2.Error as err:
            print(err)
            db.rollback()
        finally:
            cursor.close()
            db.close()
    def edit_work_supervisor(self, id_supervisor: int, work_supervisor: work_supervisor):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="UPDATE work_supervisor SET id_program=%s, first_name=%s, last_name=%s, id_graduate=%s, id_job=%s, contact_job=%s, active=%s WHERE id_supervisor=%s"
            values=(work_supervisor.id_program,work_supervisor.frist_name,work_supervisor.last_name,work_supervisor.id_graduate,work_supervisor.id_job,work_supervisor.contact_job,work_supervisor.active,id_supervisor)
            cursor.execute(querry,values)
            conn.commit()
            return {"resultado": "work supervisor actualizado"}
        except psycopg2.Error as err:
            conn.rollback()
            return {"error": str(err)}
        finally:
            conn.close()
    def delete_work_supervisor(self, id_supervisor: int):
        try:
            db = get_db_connection()
            cursor = db.cursor()
            query = "UPDATE work_supervisor SET active = %s WHERE id_supervisor = %s"
            cursor.execute(query, (False, id_supervisor))
            db.commit()
            return {"message": "work_supervisor deleted successfully"}
        except (Exception, psycopg2.Error) as error:
            print("Error al eliminar el work_supervisor:", error)
            raise HTTPException(status_code=500, detail="Error al eliminar el work_supervisor")
        finally:
            cursor.close()
            db.close()