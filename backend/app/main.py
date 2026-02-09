# app/main.py
from fastapi import FastAPI,WebSocket, WebSocketDisconnect
from app.ws_manager import manager
from app.db import engine, Base, SessionLocal
from sqlalchemy import text  
from app.models import session, event, funnel_snapshot
from app.routers import events, sessions, funnel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(events.router)
app.include_router(sessions.router)
app.include_router(funnel.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)
