import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.program_model import program
from fastapi.encoders import jsonable_encoder

class proram_controller:
    def create_program(self, Program: program):   
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="INSERT INTO program (program_name, id_faculty, active) VALUES (%s, %s, %s)"
            cursor.execute(querry, (Program.program_name, Program.faculty, Program.active))
            conn.commit()
            conn.close()
            return {"Program created"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_program(self, program_id: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM program WHERE id_program = %s ", (program_id,))
            result = cursor.fetchone()
            payload = []
            content = {} 
            content={
                    'id_program':int(result[0]),
                    'program_name':result[1],
                    'faculty':result[2],
                    'active':result[3],
                    'creation_date':result[4],
                    'update_date':result[5]
            }
            payload.append(content)
            json_data = jsonable_encoder(content)            
            if result:
               return  json_data
            else:
                raise HTTPException(status_code=404, detail="program not found")  
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_programs(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute("""
                SELECT 
                    p.id_program,
                    p.program_name,
                    f.name AS faculty_name,
                    p.active,
                    p.creation_date,
                    p.update_date
                FROM program p
                JOIN faculty f ON p.id_faculty = f.id_faculty
                ORDER BY p.id_program
            """)

            result = cursor.fetchall()
            programs = []

            for row in result:
                programs.append({
                    "id_program": row[0],
                    "program_name": row[1],
                    "faculty_name": row[2],
                    "active": row[3],
                    "creation_date": row[4],
                    "update_date": row[5]
                })

            if programs:
                return programs
            else:
                raise HTTPException(status_code=404, detail="programs not found")

        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def edit_program(self, program_id: int, Program: program):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE program SET program_name = %s, id_faculty = %s, active = %s WHERE id_program = %s", (Program.program_name, Program.faculty, Program.active, program_id))
            conn.commit()
            conn.close()
            return {"program updated"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close() 
    def delete_program(self, program_id: int): 
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE program SET active = %s WHERE id_program = %s", (False, program_id))
            conn.commit()
            conn.close()
            return {"program deleted"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close() 