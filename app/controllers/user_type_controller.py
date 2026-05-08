import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.user_type_model import user_type
from fastapi.encoders import jsonable_encoder

class user_type_controller:
    def create_user_type(self, user_type: user_type):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="INSERT INTO user_types (description, active) VALUES (%s, %s)"
            values=(user_type.description, user_type.active)
            cursor.execute(querry, values)
            conn.commit()
            return {"resultado": "user type creado"}
        except psycopg2.Error as err:
            conn.rollback()
            return {"error": str(err)}
        finally:
            conn.close()
    def get_all_user_type(self):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            query = "SELECT * FROM user_types WHERE active = %s"
            cursor.execute(query, (True,))
            result = cursor.fetchall()
            user_type = []
            for row in result:
                user_type.append({
                    "id_type": row[0],
                    "description": row[1],
                    "active": row[2],
                    "creation_date": row[3],
                    "update_date": row[4]
                })
            if user_type:
                return user_type
            else:
                raise HTTPException(status_code=404, detail="user type not found")
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
    def get_user_type(self, id_type):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            query = "SELECT * FROM user_types WHERE id_type = %s"
            cursor.execute(query, (id_type,))
            result = cursor.fetchone()
            if result:
                user_type = {
                    "id_type": result[0],
                    "description": result[1],
                    "active": result[2],
                    "creation_date": result[3],
                    "update_date": result[4]
                }
                return user_type
            else:
                raise HTTPException(status_code=404, detail="user type not found")
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            cursor.close()
            connection.close()
    def edit_user_type(self, id_type, user_type: user_type):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute("UPDATE user_types SET description = %s, active = %s WHERE id_type = %s", (user_type.description,user_type.active,id_type))
            connection.commit()
            cursor.close()
            return {"message": "user type updated successfully"}
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            connection.close()
    def delete_user_type(self, id_type):
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute("UPDATE user_types SET active = %s WHERE id_type = %s", (False, id_type))
            connection.commit()
            cursor.close()
            return {"message": "user type deleted successfully"}
        except psycopg2.Error as err:
            print(err)
            connection.rollback()
        finally:
            connection.close()