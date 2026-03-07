from fastapi import APIRouter

router = APIRouter(prefix="/employee", tags=["employee"])


@router.get("/")
async def get_employees():
    """Get all employees"""
    # TODO


@router.post("/")
async def create_employee():
    """Create a new employee"""
    # TODO


@router.get("/{employee_id}")
async def get_employee(employee_id: int):
    """Get employee by ID"""
    # TODO


@router.delete("/{employee_id}")
async def delete_employee(employee_id: int):
    """Delete employee by ID"""
    # TODO


@router.patch("/{employee_id}")
async def update_employee(employee_id: int):
    """Update employee by ID"""
    # TODO


@router.get("/departments")
async def get_employee_departments():
    """Get all employee departments"""
    # TODO
