from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import get_db
from app.models.event import Event as EventModel
from app.constants import FUNNEL_STEPS


router = APIRouter(prefix="/funnel", tags=["funnel"])


def get_exit_count(db: Session, steps: list[str]) -> int:
    return (
        db.query(EventModel)
        .filter(
            EventModel.event_type == "exit",
            EventModel.screen.in_(steps)
        )
        .count()
    )


def get_total_sessions(db: Session) -> int:
    return (
        db.query(EventModel.user_id)
        .filter(EventModel.screen == "home")
        .distinct()
        .count()
    )


def get_counts_by_step(db: Session, steps: list[str]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for step in steps:
        counts[step] = (
            db.query(EventModel.user_id)
            .filter(EventModel.screen == step)
            .distinct()
            .count()
        )
    return counts


def get_exits_by_step(db: Session, steps: list[str]) -> dict[str, int]:
    exits: dict[str, int] = {}
    for step in steps:
        exits[step] = (
            db.query(EventModel)
            .filter(
                EventModel.event_type == "exit",
                EventModel.screen == step
            )
            .count()
        )
    return exits


def get_latest_event(db: Session, step: str) -> EventModel | None:
    return (
        db.query(EventModel)
        .filter(
            EventModel.screen == step,
            EventModel.event_type == "navigate"
        )
        .order_by(EventModel.timestamp.desc())
        .first()
    )


def get_avg_latency(db: Session, step: str) -> tuple[float, float]:
    avg_system = (
        db.query(func.avg(EventModel.system_latency))
        .filter(
            EventModel.screen == step,
            EventModel.event_type == "navigate"
        ).scalar() or 0
    )
    avg_user = (
        db.query(func.avg(EventModel.user_think_time))
        .filter(
            EventModel.screen == step,
            EventModel.event_type == "navigate"
        ).scalar() or 0
    )
    return avg_system, avg_user


@router.get("/summary")
def funnel_summary(db: Session = Depends(get_db)):
    steps = FUNNEL_STEPS
    summary = []

    exit_count = get_exit_count(db, steps)
    total_sessions = get_total_sessions(db)
    counts_by_step = get_counts_by_step(db, steps)
    exits_by_step = get_exits_by_step(db, steps)
    worst_step = None
    worst_latency = -1

    for idx, step in enumerate(steps):
        count = counts_by_step.get(step, 0)
        step_exit_count = exits_by_step.get(step, 0)

        conversion = round((count / total_sessions) * 100,
                           2) if total_sessions else 0

        latest_event = get_latest_event(db, step)

        latest_system = latest_event.system_latency if latest_event else 0
        latest_user = latest_event.user_think_time if latest_event else 0

        avg_system, avg_user = get_avg_latency(db, step)

        if exit_count == 0:
            drop_off_rate = 0
        else:
            drop_off_rate = (step_exit_count / exit_count) * 100

        if latest_system > worst_latency:
            worst_latency = latest_system
            worst_step = step

        summary.append({
            "step": step,
            "name": step.capitalize(),
            "conversion_rate": conversion,
            "system_latency_ms": int(latest_system),
            "user_think_time_ms": int(latest_user),
            "avg_system_latency_ms": int(avg_system),
            "avg_user_think_time_ms": int(avg_user),
            "total_users": count,
            "drop_off_rate": round(drop_off_rate, 2)
        })

    overall_conversion = 0
    if total_sessions:
        success_count = next(
            (item["total_users"] for item in summary if item["step"] == "success"), 0)
        overall_conversion = round((success_count / total_sessions) * 100, 2)

    return {
        "kpis": {
            "total_users": total_sessions,
            "overall_conversion": overall_conversion,
            "worst_step": worst_step,
            "exit_count": exit_count
        },
        "steps": summary
    }
