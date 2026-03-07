from fastapi import APIRouter

router = APIRouter(prefix="/event", tags=["event"])


@router.get("/")
async def get_events():
    """Get all events"""
    # TODO


@router.post("/")
async def create_event():
    """Create a new event"""
    # TODO


@router.get("/{event_id}")
async def get_event(event_id: int):
    """Get event by ID"""
    # TODO


@router.delete("/{event_id}")
async def delete_event(event_id: int):
    """Delete event by ID"""
    # TODO


@router.patch("/{event_id}")
async def update_event(event_id: int):
    """Update event by ID"""
    # TODO


@router.get("/departments")
async def get_event_departments():
    """Get all event departments"""
    # TODO
