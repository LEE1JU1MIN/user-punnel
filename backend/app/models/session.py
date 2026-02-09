# app/models/session.py
# app/models/session.py
from sqlalchemy import Column, Integer, DateTime
from app.db import Base
from datetime import datetime

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=True)

    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)