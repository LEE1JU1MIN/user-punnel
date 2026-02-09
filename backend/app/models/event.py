# app/models/event.py
from sqlalchemy import Column, Integer, String, DateTime
from app.db import Base
from datetime import datetime

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False)
    screen = Column(String, nullable=False)
    next_screen = Column(String, nullable=False)
    user_think_time = Column(Integer, nullable=False)
    system_latency = Column(Integer, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    event_type = Column(String, nullable=False)
