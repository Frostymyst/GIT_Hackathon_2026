from fastapi import APIRouter, HTTPException
import mysql.connector
from pydantic import BaseModel
from ..main import connection

router = APIRouter(prefix="/admin", tags=["admin"])


class CategoryRequest(BaseModel):
    cname: str


@router.post("/categories")
async def add_category(payload: CategoryRequest):
    """Create a task category."""
    sql, cursor = connection()
    try:
        cursor.execute(
            "INSERT INTO task_categories (cname) VALUES (%s)",
            (payload.cname,),
        )
        sql.commit()
        return {"status": "OK", "created": True}
    except mysql.connector.Error as err:
        if "Duplicate entry" in str(err):
            raise HTTPException(status_code=409, detail="Category already exists") from err
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()


@router.delete("/categories/{cname}")
async def remove_category(cname: str):
    """Delete a task category by name."""
    sql, cursor = connection()
    try:
        cursor.execute(
            "DELETE FROM task_categories WHERE cname = %s",
            (cname,),
        )
        sql.commit()
        deleted = cursor.rowcount > 0
        if not deleted:
            raise HTTPException(status_code=404, detail="Category not found")
        return {"status": "OK", "deleted": True}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err)) from err
    finally:
        if sql.is_connected():
            cursor.close()
            sql.close()
