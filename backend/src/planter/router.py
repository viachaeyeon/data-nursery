from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from starlette.responses import JSONResponse

import src.planter.models as models
import src.planter.schemas as schemas

from utils.database import get_db
from utils.db_shortcuts import get_, get_or_create_, create_

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


@router.post("/work/{planter_work_id}/output")
def create_planter_output(
    planter_work_id: int,
    planter_data: schemas.PlanterOperatingDataCreate,
    db: Session = Depends(get_db),
):
    planter_work = get_(db, models.PlanterWork, id=planter_work_id)

    if not planter_work:
        return JSONResponse(status_code=404, content=dict(msg="NO_MATCH_PLANTER_WORK"))

    planter_work_output = get_or_create_(
        db,
        models.PlanterOutput,
        planter_work_id=planter_work_id,
    )
    status, output, operating_time = planter_data.data.split("||")

    # status가 Off 될 경우 파종기 상태에 OFF 저장
    # status -> "1": 작업중("WORKING"), "0" : 작업완료("DONE")
    if status == "0" and planter_work.planter_work__planter_work_status[-1].status != "DONE":
        save_planter_work_status = create_(db, models.PlanterWorkStatus, planter_work_id=planter_work_id, status="DONE", test="123")

        if not save_planter_work_status:
            return JSONResponse(status_code=400, content=dict(msg="ERROR_CREATE_PLANTER_WORK_STATUS"))

    # output은 planter_work_output에 저장
    planter_work_output.output = output

    # operating_time 저장
    planter_work.operating_time = operating_time


    db.commit()

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))
