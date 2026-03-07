from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..services.adminSetCategories import create_category, delete_category

router = APIRouter(prefix="/admin", tags=["admin"])


class CategoryRequest(BaseModel):
    cname: str


@router.post("/categories")
async def add_category(payload: CategoryRequest):
    """Create a task category."""
    try:
        created = create_category(cname=payload.cname)
        return {"status": "OK", "created": created}
    except RuntimeError as exc:
        # MySQL duplicate-key violations surface here from service exceptions.
        if "Duplicate entry" in str(exc):
            raise HTTPException(status_code=409, detail="Category already exists") from exc
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.delete("/categories/{cname}")
async def remove_category(cname: str):
    """Delete a task category by name."""
    try:
        deleted = delete_category(cname=cname)
        if not deleted:
            raise HTTPException(status_code=404, detail="Category not found")
        return {"status": "OK", "deleted": True}
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
