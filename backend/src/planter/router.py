from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session, joinedload
from starlette.responses import JSONResponse

from datetime import datetime

import src.planter.models as models
import src.planter.schemas as schemas
from utils.database import get_db
from utils.db_shortcuts import get_, create_, get_current_user


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
        # latest_status = work.planter_work__planter_work_status[0]

        if latest_status.status == "WORKING":
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

    planter_work_output = get_(
        db,
        models.PlanterOutput,
        planter_work_id=planter_work_id,
    )

    if not planter_work_output:
        planter_work_output = create_(
            db,
            models.PlanterOutput,
            planter_work_id=planter_work_id,
        )

    # 파종기 마지막 동작상태 가져오기 (PlanterStatus)
    planter_status = (
        db.query(models.PlanterStatus)
        .join(models.PlanterStatus.planter_status__planter)
        .filter(models.Planter.id == planter_work.planter_id)
        .order_by(models.PlanterStatus.created_at.desc())
        .all()
    )
    status, output, operating_time = planter_data.data.split("||")
    # status가 0일 경우 파종기 상태(PlanterStatus) 및 작업 상태(PlanterWorkStatus) 완료 저장
    # status -> "1": 작업중("WORKING"), "0" : 작업완료("DONE")
    save_planter_stauts = None
    save_planter_work_status = None
    if status == "0":
        if not planter_status or planter_status[0].status != "OFF":
            save_planter_stauts = create_(
                db,
                models.PlanterStatus,
                planter_id=planter_work.planter_id,
                status="OFF",
            )
            db.add(save_planter_stauts)

        if planter_work.planter_work__planter_work_status[-1].status != "DONE":
            save_planter_work_status = create_(
                db,
                models.PlanterWorkStatus,
                planter_work_id=planter_work_id,
                status="DONE",
            )

            if not save_planter_work_status:
                return JSONResponse(
                    status_code=400,
                    content=dict(msg="ERROR_CREATE_PLANTER_WORK_STATUS"),
                )

            db.add(save_planter_work_status)

    elif status == "1":
        if not planter_status or planter_status[0].status != "ON":
            save_planter_stauts = create_(
                db,
                models.PlanterStatus,
                planter_id=planter_work.planter_id,
                status="ON",
            )
            db.add(save_planter_stauts)
    else:
        return JSONResponse(status_code=422, content=dict(msg="INVALID_STATUS_VALUE"))
    # output은 planter_work_output에 저장
    planter_work_output.output = output

    # operating_time 저장
    planter_work.operating_time = operating_time

    db.add(planter_work)
    db.add(planter_work_output)
    db.commit()
    db.refresh(planter_work)
    db.refresh(planter_work_output)
    if save_planter_stauts != None:
        db.refresh(save_planter_stauts)
    if save_planter_work_status != None:
        db.refresh(save_planter_work_status)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


# FIXME: 테스트 끝났을때 삭제하기
@router.post(
    "/test/planter/status/change",
    status_code=200,
    description="파종기 시리얼번호로 해당 api 요청 시 작업 상태가 WORKING으로 변경됩니다.\n테스트 종료 시 제거 예정",
)
def test_planter_status_change(serial_number: str, db: Session = Depends(get_db)):
    planter_work_status = (
        db.query(models.PlanterWorkStatus)
        .join(models.PlanterWorkStatus.planter_work_status__planter_work)
        .join(models.PlanterWork.planter_work__planter)
        .filter(
            models.Planter.is_del == False,
            models.Planter.serial_number == serial_number,
            models.PlanterWork.is_del == False,
            models.PlanterWorkStatus.is_del == False,
        )
        .order_by(models.PlanterWorkStatus.created_at.desc())
        .all()
    )

    if not planter_work_status:
        return JSONResponse(status_code=404, content=dict(msg="NO_PLANTER_WORK_STATUS"))

    if planter_work_status[0].status != "WORKING":
        planter_work = (
            db.query(models.PlanterWork)
            .join(models.PlanterWork.planter_work__planter)
            .filter(
                models.PlanterWork.is_del == False,
                models.Planter.serial_number == serial_number,
            )
            .order_by(models.PlanterWork.created_at.desc())
            .all()
        )
        new_planter_work_status = models.PlanterWorkStatus(
            planter_work_status__planter_work=planter_work[0], status="WORKING"
        )
        db.add(new_planter_work_status)
        db.commit()
        db.refresh(new_planter_work_status)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


@router.post("/farmhouse/register", status_code=200, description="농가에서 파종기 등록 시 사용")
def farm_house_register_planter(
    request: Request, serial_number: str, db: Session = Depends(get_db)
):
    user = get_current_user("01", request.cookies, db)
    planter = get_(db, models.Planter, is_del=False, serial_number=serial_number)

    if not user.user_farm_house.farm_house_planter == planter:
        return JSONResponse(status_code=422, content=dict(msg="INVALID_PLANTER"))

    if planter.is_register:
        return JSONResponse(status_code=422, content=dict(msg="ALEADY_REGISTERED"))

    planter.is_register = True
    planter.register_date = datetime.utcnow()
    db.add(planter)
    db.commit()
    db.add(planter)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


@router.post("/tray/create")
def craete_planter_tray(
    request: Request, tray_data: schemas.PlanterTrayBase, db: Session = Depends(get_db)
):
    new_planter_tray = create_(
        db,
        models.PlanterTray,
        width=tray_data.width,
        height=tray_data.height,
        total=tray_data.total,
    )

    db.add(new_planter_tray)
    db.commit()
    db.refresh(new_planter_tray)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


@router.get(
    "/tray/list", status_code=200, response_model=schemas.MultiplePlanterTrayResponse
)
def planter_tray_list(db: Session = Depends(get_db)):
    planter_trays = db.query(models.PlanterTray).filter_by(is_del=False).all()

    # planter_tray_list = [
    #     {"id": tray.id, "width": tray.width, "height": tray.height, "total": tray.total}
    #     for tray in planter_trays
    # ]

    return {"planter_trays": planter_trays}


@router.post("/work/create", status_code=201)
def create_planter_work(
    request: Request,
    work_data: schemas.PlanterWorkCreate,
    db: Session = Depends(get_db),
):
    user = get_current_user("01", request.cookies, db)

    new_work = create_(
        db,
        models.PlanterWork,
        planter_id=user.user_farm_house.farm_house_planter.id,
        planter_tray_id=work_data.planter_tray_id,
        crop_id=work_data.crop_id,
        crop_kind=work_data.crop_kind,
        sowing_date=work_data.sowing_date,
        deadline=work_data.deadline,
        order_quantity=work_data.order_quantity,
        seed_quantity=work_data.seed_quantity,
    )

    new_work_status = create_(
        db,
        models.PlanterWorkStatus,
        planter_work_status__planter_work=new_work,
        status="WAIT",
    )

    db.add(new_work)
    db.add(new_work_status)
    db.commit()
    db.refresh(new_work)
    db.refresh(new_work_status)
    return JSONResponse(status_code=201, content=dict(msg="CREATED_WORK"))
