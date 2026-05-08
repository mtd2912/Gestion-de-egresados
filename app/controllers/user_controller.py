import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.user_model import users
from fastapi.encoders import jsonable_encoder

class user_controller:
    def create_user(self, user_data: users):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query = "INSERT INTO users (first_name, last_name, email, password, id_type, active) VALUES (%s, %s, %s, %s, %s, %s)"
            cursor.execute(query, (user_data.first_name, user_data.last_name, user_data.email, user_data.password, user_data.id_type, user_data.active))
            conn.commit()
            cursor.close()
            conn.close()
            return {"Resultado": "User created"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_all_users(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE active = %s", (True,))
            result = cursor.fetchall()
            users = []
            for row in result:
                users.append({
                    "id_user": row[0],
                    "first_name": row[1],
                    "last_name": row[2],
                    "email": row[3],
                    "password": row[4],
                    "id_type": row[5],
                    "active": row[6],
                    "creation_date": row[7],
                    "update_date": row[8]
                })
            if users:
                return users
            else:
                raise HTTPException(status_code=404, detail="sectors not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_user(self, id_user: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id_user = %s", (id_user,))
            row = cursor.fetchone()
            if row:
                user = {
                    "id_user": row[0],
                    "first_name": row[1],
                    "last_name": row[2],
                    "email": row[3],
                    "password": row[4],
                    "id_type": row[5],
                    "active": row[6],
                    "creation_date": row[7],
                    "update_date": row[8]
                }
                return user
            else:
                raise HTTPException(status_code=404, detail="user not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def edit_user(self, id_user: int, user_data: users):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            query = "UPDATE users SET first_name = %s, last_name = %s, email = %s, password = %s, id_type = %s, active = %s WHERE id_user = %s"
            cursor.execute(query, (user_data.first_name, user_data.last_name, user_data.email, user_data.password, user_data.id_type, user_data.active, id_user))
            conn.commit()
            cursor.close()
            conn.close()
            return {"Resultado": "User edited"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def delete_user(self, id_user: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("UPDATE users SET active = %s WHERE id_user = %s", (False, id_user))
            conn.commit()
            cursor.close()
            conn.close()
            return {"Resultado": "User deleted"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def validar_user(self, email: str, password: str):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
            user = cursor.fetchone()
            if user:
                user={
                    "email": user[3],
                    "password": user[4],
                    "id_type": user[5]
                }
                return jsonable_encoder(user)
            else:
                return {"Resultado": "User not found"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()