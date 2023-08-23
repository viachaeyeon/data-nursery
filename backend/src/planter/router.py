from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from starlette.responses import JSONResponse

import src.planter.models as models
import src.planter.schemas as schemas

from utils.database import get_db

router = APIRouter()


@router.get("/test")
def get_planter():
    return {"message": "Planter endpoint"}


@router.get(
    "/{planter_sn}/latest-work",
    status_code=200,
    response_model=schemas.PlanterWorkResponse,
)
def get_lastest_work(planter_sn: str, db: Session = Depends(get_db)):
    planter = (
        db.query(models.Planter)
        .filter(
            models.Planter.is_del == False,
            models.Planter.serial_number == planter_sn,
        )
        .first()
    )

    if not planter:
        return JSONResponse(status_code=404, content=dict(msg="NO_MATCH_PLANTER"))

    planter_works = (
        db.query(models.PlanterWork)
        .options(joinedload(models.PlanterWork.planter_work__planter_work_status))
        .filter(models.PlanterWork.planter_id == planter.id)
        .order_by(models.PlanterWork.created_at.desc())
        .all()
    )

    if not planter_works:
        return JSONResponse(
            status_code=404, content=dict(msg="NO_WORK_FOUND_FOR_THIS_PLANTER")
        )

    latest_on_work = None

    for work in planter_works:
        latest_status = work.planter_work__planter_work_status[-1]

        if latest_status.status == "ON":
            latest_on_work = work
            break

    if not latest_on_work:
        return JSONResponse(status_code=404, content=dict(msg="NO_WORK_STATUS_ON"))

    return {
        "crop": latest_on_work.planter_work__crop,
        "planter_work_status": latest_on_work.planter_work__planter_work_status[-1],
        "planter_tray": latest_on_work.planter_work__planter_tray,
        "planter_work": latest_on_work,
    }
