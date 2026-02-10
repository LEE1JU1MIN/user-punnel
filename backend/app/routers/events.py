from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.event import Event as EventModel
from app.models.funnel_snapshot import FunnelSnapshot
from app.models.session import Session as SessionModel
from app.schemas import EventCreate, EventOut
from app.ws_manager import manager
from app.routers.funnel import funnel_summary


router = APIRouter(prefix="/events", tags=["events"])


@router.post("/", response_model=EventOut)
async def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = EventModel(**event.model_dump())
    db.add(db_event)
    db.commit()
    summary = funnel_summary(db)
    await manager.broadcast(summary)
    db.refresh(db_event)
    return db_event


@router.post("/clear")
async def clear_events(db: Session = Depends(get_db)):
    db.query(EventModel).delete()
    db.query(FunnelSnapshot).delete()
    db.query(SessionModel).delete()
    db.commit()
    summary = funnel_summary(db)
    await manager.broadcast(summary)
    return {"cleared": True}
