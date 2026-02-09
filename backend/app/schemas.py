# app/schemas.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class EventCreate(BaseModel):
    user_id: str
    screen: str
    next_screen: str
    user_think_time: int
    system_latency: int
    timestamp: datetime
    event_type: str

class EventOut(EventCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
