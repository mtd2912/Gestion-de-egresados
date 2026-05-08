import psycopg2
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.sectors_model import sectors
from fastapi.encoders import jsonable_encoder

class sectors_controller:
    def create_sector(self, sector: sectors):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="INSERT INTO sectors (name, active) VALUES (%s, %s)"
            cursor.execute(querry, (sector.name, sector.active))
            conn.commit()
            return {"message": "sector created successfully"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_sectors(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sectors WHERE active = %s", (True,))
            result = cursor.fetchall()
            sectors = []
            for row in result:
                sectors.append({
                    "id_sector": row[0],
                    "name": row[1],
                    "active": row[2],
                    "creation_date": row[3],
                    "update_date": row[4]
                })
            if sectors:
                return sectors
            else:
                raise HTTPException(status_code=404, detail="sectors not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def get_sector(self, id_sector: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sectors WHERE id_sector = %s", (id_sector,))
            row = cursor.fetchone()
            if row:
                sectors={
                    "id_sector": row[0],
                    "name": row[1],
                    "active": row[2],
                    "creation_date": row[3],
                    "update_date": row[4]
                }
                return sectors
            else:
                raise HTTPException(status_code=404, detail="sector not found")
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def edit_sector(self,id_sector:int, sector: sectors):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="UPDATE sectors SET name = %s, active = %s WHERE id_sector = %s"
            cursor.execute(querry, (sector.name, sector.active, id_sector))
            conn.commit()
            return {"message": "sector updated successfully"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()
    def delete_sectors(self, id_sector: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            querry="UPDATE sectors SET active = %s WHERE id_sector = %s"
            cursor.execute(querry, (False, id_sector))
            conn.commit()
            return {"message": "sector updated successfully"}
        except psycopg2.Error as err:
            print(err)
            conn.rollback()
        finally:
            conn.close()