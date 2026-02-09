from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import get_db
from app.models.event import Event as EventModel


router = APIRouter(prefix="/funnel", tags=["funnel"])


@router.get("/summary")
def funnel_summary(db: Session = Depends(get_db)):
    steps = ["home", "product", "cart", "success"]
    summary = []

    exit_count = (
        db.query(EventModel.user_id)
        .filter(EventModel.event_type == "exit")
        .distinct()
        .count()
    )

    total_sessions = (
        db.query(EventModel.user_id)
        .filter(EventModel.screen == "home")
        .distinct()
        .count()
    )

    counts_by_step = {}
    for step in steps:
        counts_by_step[step] = (
            db.query(EventModel.user_id)
            .filter(EventModel.screen == step)
            .distinct()
            .count()
        )

    worst_step = None
    worst_latency = -1
    exits_by_step = {}
    for step in steps:
        exits_by_step[step] = (
            db.query(EventModel.user_id)
            .filter(
                EventModel.event_type == "exit",
                EventModel.screen == step
            )
            .distinct()
            .count()
        )

    for idx, step in enumerate(steps):
        count = counts_by_step.get(step, 0)
        step_exit_count = exits_by_step.get(step, 0)

        conversion = round((count / total_sessions) * 100,
                           2) if total_sessions else 0

        avg_latency = db.query(func.avg(EventModel.system_latency))\
            .filter(
                EventModel.screen == step,
                EventModel.event_type == "navigate"
            ).scalar() or 0

        avg_think = db.query(func.avg(EventModel.user_think_time))\
            .filter(
                EventModel.screen == step,
                EventModel.event_type == "navigate"
            ).scalar() or 0

        if count == 0:
            drop_off_rate = 0
        else:
            drop_off_rate = (step_exit_count / count) * 100

        if avg_latency > worst_latency:
            worst_latency = avg_latency
            worst_step = step

        summary.append({
            "step": step,
            "name": step.capitalize(),
            "conversion_rate": conversion,
            "system_latency_ms": int(avg_latency),
            "user_think_time_ms": int(avg_think),
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
