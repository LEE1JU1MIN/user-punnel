# app/models/funnel_snapshot.py
from sqlalchemy import Column, Integer, String, DateTime, Float
from app.db import Base
from datetime import datetime

class FunnelSnapshot(Base):
    __tablename__ = "funnel_snapshots"

    id = Column(Integer, primary_key=True)

    step = Column(String, nullable=False)
    conversion_rate = Column(Float, nullable=False)

    avg_system_latency = Column(Integer, nullable=False)
    avg_user_think_time = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)