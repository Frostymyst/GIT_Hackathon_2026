from fastapi import APIRouter

router = APIRouter(prefix="/task", tags=["task"])


@router.get("/")
async def get_tasks():
    """Get all tasks"""
    # TODO


@router.post("/")
async def create_task():
    """Create a new task"""
    # TODO


@router.get("/{task_id}")
async def get_task(task_id: int):
    """Get task by ID"""
    # TODO


@router.delete("/{task_id}")
async def delete_task(task_id: int):
    """Delete task by ID"""
    # TODO


@router.patch("/{task_id}")
async def update_task(task_id: int):
    """Update task by ID"""
    # TODO


@router.get("/categories")
async def get_task_categories():
    """Get all task categories"""
    # TODO
