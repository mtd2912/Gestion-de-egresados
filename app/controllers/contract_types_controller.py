import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.contract_types_model import contract_types
from fastapi.encoders import jsonable_encoder
class contract_types_controller():
    def create_contract_type(self,contract_type:contract_types):
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query = "INSERT INTO contract_types (contract_name,description,duration,active) VALUES (%s,%s,%s,%s)"
            cursor.execute(query, (contract_type.contract_name,contract_type.description,contract_type.duration,contract_type.active))
            conn.commit()
            return {"contrato creado"}
        except Exception as err:
            if conn:
                conn.rollback()
            print(f"ERROR: {err}")
            return {"error": str(err)}
        finally:
            if conn:
                conn.close()
    def get_contract_types(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM contract_types WHERE active = %s", (True,))
            result = cursor.fetchall()
            contract_types = []
            for row in result:
                contract_types.append({
                    "id_type": row[0],
                    "contract_name": row[1],
                    "description": row[2],
                    "duration": row[3],
                    "active": row[4],
                    "creation_date": row[5],
                    "update_date": row[6]
                })
            if contract_types:
                return contract_types
            else:
                raise HTTPException(status_code=404, detail="contract types not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_contract_type(self,id_contract_type:int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM contract_types WHERE id_type = %s", (id_contract_type,))
            row = cursor.fetchone()
            if row:
                contract_types={
                    "id_type":row[0],
                    "contract_name":row[1],
                    "description":row[2],
                    "duration":row[3],
                    "active":row[4],
                    "creation_date":row[5],
                    "update_date":row[6]
                }
                return contract_types
            else:
                raise HTTPException(status_code=404, detail="contract type not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def edit_contract_type(self, contract_type_id:int,contract_types:contract_types):
        try:
            conn =get_db_connection()
            cursor=conn.cursor()
            query="UPDATE contract_types SET contract_name = %s, description = %s, duration = %s WHERE id_type = %s"
            values=(contract_types.contract_name,contract_types.description,contract_types.duration,contract_type_id)
            cursor.execute(query,values)
            conn.commit()
            return {"message":"Contract type updated"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def delete_contract_type(self,id_contract_type:int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="UPDATE contract_types SET active = %s WHERE id_type = %s"
            cursor.execute(querry, (False, id_contract_type))
            conn.commit()
            cursor.close()
            conn.close()
            return {"message": "contract type deleted successfully"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback() 
        finally:
            conn.close()