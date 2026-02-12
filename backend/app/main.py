# app/main.py
import os

from fastapi import FastAPI,WebSocket, WebSocketDisconnect
from app.ws_manager import manager
from app.db import engine, Base, SessionLocal
from sqlalchemy import text  
from app.models import session, event, funnel_snapshot
from app.routers import events, sessions, funnel
from app.routers.funnel import funnel_summary
from fastapi.middleware.cors import CORSMiddleware
from app.models.event import Event as EventModel


app = FastAPI()

app.include_router(events.router)
app.include_router(sessions.router)
app.include_router(funnel.router)


origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
extra_origins = os.getenv("FRONTEND_ORIGINS")
if extra_origins:
    for origin in extra_origins.split(","):
        origin = origin.strip()
        if origin:
            origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"status": "user_punnel backend running"}


@app.get("/db-check")
def db_check():
    db = SessionLocal()
    try:
        result = db.execute(text("SELECT 1")).scalar()
        return {"db_result": result}
    finally:
        db.close()

@app.websocket("/ws/metrics")
async def websocket_metrics(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            data = await ws.receive_json()

            if data.get("type") == "latency":
                event_id = data.get("event_id")
                client_latency = data.get("client_latency_ms")

                if event_id is not None and client_latency is not None:
                    db = SessionLocal()
                    try:
                        event = db.query(EventModel).filter(EventModel.id == event_id).first()
                        if event:
                            event.system_latency = client_latency
                            db.commit()

                            summary = funnel_summary(db)
                            await manager.broadcast(summary)
                    finally:
                        db.close()
    except WebSocketDisconnect:
        manager.disconnect(ws)
