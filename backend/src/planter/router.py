from fastapi import APIRouter, Depends, Request
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload, aliased
from starlette.responses import JSONResponse

from datetime import datetime
from pytz import timezone

# import pytz

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


@router.get(
    "/work/working/list/{serial_number}",
    status_code=200,
    description="파종기 작업 중 작업중인 목록(WORKING, PAUSE 상태)을 불러올때 사용",
)
def planter_work_working_pause_list(
    request: Request, serial_number: str, db: Session = Depends(get_db)
):
    user = get_current_user("01", request.cookies, db)

    planter = user.user_farm_house.farm_house_planter
    # 유저에 등록된 시리얼번호와 일치하는지 확인
    if planter.serial_number != serial_number:
        return JSONResponse(status_code=400, content=dict(msg="NOT_MATCHED_PLANTER"))

    pw = aliased(models.PlanterWork)
    pws = aliased(models.PlanterWorkStatus)

    recent_status_subquery = (
        db.query(
            pws.planter_work_id,
            func.max(pws.id).label("last_pws_id"),
            # func.max(pws.created_at).label("max_created_at"),
        )
        .filter(pws.is_del == False)
        .group_by(pws.planter_work_id)
        .subquery()
    )

    planter_works_with_recent_working_or_pause_status = (
        db.query(pw)
        .join(recent_status_subquery, recent_status_subquery.c.planter_work_id == pw.id)
        .join(
            pws,
            (pws.planter_work_id == recent_status_subquery.c.planter_work_id)
            & (pws.id == recent_status_subquery.c.last_pws_id),
            # & (pws.created_at == recent_status_subquery.c.max_created_at),
        )
        .filter(
            pw.is_del == False,
            pw.planter_id == planter.id,
            pws.status.in_(["WORKING", "PAUSE"]),
        )
        .order_by(pw.created_at.desc())
    ).first()

    if not planter_works_with_recent_working_or_pause_status:
        return None

    planter_work_output = (
        planter_works_with_recent_working_or_pause_status.planter_works__planter_output
    )
    return {
        "id": planter_works_with_recent_working_or_pause_status.id,
        "crop_img": planter_works_with_recent_working_or_pause_status.planter_work__crop.image,
        "crop_kind": planter_works_with_recent_working_or_pause_status.crop_kind,
        "planter_work_output": planter_work_output.output
        if planter_work_output is not None
        else 0,
        "tray_total": planter_works_with_recent_working_or_pause_status.planter_work__planter_tray.total,
    }


@router.get(
    "/work/wait/list/{serial_number}",
    status_code=200,
    description="파종기 작업 중 대기중인 목록(WAIT 상태)을 불러올때 사용",
)
def planter_work_wait_list(
    request: Request,
    serial_number: str,
    page: int = 1,
    size: int = 8,
    db: Session = Depends(get_db),
):
    user = get_current_user("01", request.cookies, db)
    planter = user.user_farm_house.farm_house_planter
    if planter.serial_number != serial_number:
        return JSONResponse(status_code=400, content=dict(msg="NOT_MATCHED_PLANTER"))

    if page - 1 < 0:
        page = 0
    else:
        page -= 1

    pw = aliased(models.PlanterWork)
    pws = aliased(models.PlanterWorkStatus)

    recent_status_subquery = (
        db.query(pws.planter_work_id, func.max(pws.id).label("last_pws_id"))
        .filter(pws.is_del == False)
        .group_by(pws.planter_work_id)
        .subquery()
    )

    planter_works_with_recent_wait_status = (
        db.query(pw)
        .join(recent_status_subquery, recent_status_subquery.c.planter_work_id == pw.id)
        .join(
            pws,
            (pws.planter_work_id == recent_status_subquery.c.planter_work_id)
            & (pws.id == recent_status_subquery.c.last_pws_id),
        )
        .filter(pw.is_del == False, pw.planter_id == planter.id, pws.status == "WAIT")
        .order_by(pw.created_at.desc())
    )

    total = planter_works_with_recent_wait_status.count()

    result_data = []
    for planter_work in (
        planter_works_with_recent_wait_status.offset(page * size).limit(size).all()
    ):
        result_data.append(
            {
                "id": planter_work.id,
                "crop_name": planter_work.planter_work__crop.name,
                "crop_kine": planter_work.crop_kind,
                "seed_quantity": planter_work.seed_quantity,
                "tray_total": planter_work.planter_work__planter_tray.total,
            }
        )

    return {"total": total, "planter_works": result_data}


@router.get(
    "/work/done/list/{serial_number}/{year}/{month}/{date}",
    status_code=200,
    description="파종기 작업 중 특정 날짜의 완료된 목록(DONE 상태)을 불러올때 사용<br/>year: 2023, month: 8, date: 31",
)
def planter_work_done_datetime_list(
    request: Request,
    serial_number: str,
    year: int,
    month: int,
    date: int,
    page: int = 1,
    size: int = 8,
    db: Session = Depends(get_db),
):
    user = get_current_user("01", request.cookies, db)
    planter = user.user_farm_house.farm_house_planter
    if planter.serial_number != serial_number:
        return JSONResponse(status_code=400, content=dict(msg="NOT_MATCHED_PLANTER"))

    if page - 1 < 0:
        page = 0
    else:
        page -= 1

    target_timezone = timezone("Asia/Seoul")
    target_date = datetime(year, month, date, tzinfo=target_timezone).date()

    pw = aliased(models.PlanterWork)
    pws = aliased(models.PlanterWorkStatus)

    recent_status_subquery = (
        db.query(
            pws.planter_work_id,
            func.max(pws.id).label("last_pws_id"),
        )
        .filter(pws.is_del == False)
        .group_by(pws.planter_work_id)
        .subquery()
    )

    planter_works_with_recent_done_status = (
        db.query(pw)
        .join(recent_status_subquery, recent_status_subquery.c.planter_work_id == pw.id)
        .join(
            pws,
            (pws.planter_work_id == recent_status_subquery.c.planter_work_id)
            & (pws.id == recent_status_subquery.c.last_pws_id),
        )
        .filter(
            pw.is_del == False,
            pw.planter_id == planter.id,
            pws.status == "DONE",
            # cast(func.timezone("Asia/Seoul", pw.created_at), Date) == target_date,
            func.Date(func.timezone("Asia/Seoul", pw.created_at)) == target_date,
        )
        .order_by(pw.created_at.desc())
    )

    total = planter_works_with_recent_done_status.count()
    total_seed_quantity = 0
    for planter_work in planter_works_with_recent_done_status.all():
        total_seed_quantity += planter_work.seed_quantity

    result_data = []
    for planter_work in (
        planter_works_with_recent_done_status.offset(page * size).limit(size).all()
    ):
        result_data.append(
            {
                "id": planter_work.id,
                "crop_name": planter_work.planter_work__crop.name,
                "crop_kine": planter_work.crop_kind,
                "seed_quantity": planter_work.seed_quantity,
                "tray_total": planter_work.planter_work__planter_tray.total,
            }
        )

    return {
        "total": total,
        "total_seed_quantity": total_seed_quantity,
        "planter_works": result_data,
    }


@router.patch(
    "/work/status/update/{planter_work_id}",
    status_code=200,
    description="파종기 작업 상태 변경 시 사용<br/>WAIT: 대기중, WORKING: 작업중, DONE: 완료, PAUSE: 일시정지",
)
def update_planter_work_status(
    request: Request, planter_work_id: int, status: str, db: Session = Depends(get_db)
):
    user = get_current_user("01", request.cookies, db)
    pw = aliased(models.PlanterWork)
    pws = aliased(models.PlanterWorkStatus)

    request_planter_work = get_(db, pw, id=planter_work_id)
    request_planter = request_planter_work.planter_work__planter

    last_planter_work_status = (
        db.query(pws)
        .filter(
            pws.is_del == False,
            pws.planter_work_id == planter_work_id,
        )
        .order_by(pws.created_at.desc())
        .first()
    )

    # 유저에 등록된 파종기 시리얼넘버와 요청한 Planter_work_id의 파종기 시리얼넘버 비교
    if (
        user.user_farm_house.farm_house_planter.serial_number
        != request_planter.serial_number
    ):
        return JSONResponse(
            status_code=404,
            content=dict(msg="NO_MATCH_PLANTER_WORK_WITH_ENROLLED_PLANTER"),
        )

    # 작업상태를 WORKING으로 변경
    if status == "WORKING":
        # 현재 상태가 WAIT일 경우
        if last_planter_work_status.status == "WAIT":
            last_planter_work_status_subquery = (
                db.query(pws.planter_work_id, func.max(pws.id).label("last_pwd_id"))
                .filter(pws.is_del == False)
                .group_by(pws.planter_work_id)
                .subquery()
            )

            check_working_puase_planter_work = (
                db.query(pw)
                .join(
                    last_planter_work_status_subquery,
                    last_planter_work_status_subquery.c.planter_work_id == pw.id,
                )
                .join(
                    pws,
                    (
                        pws.planter_work_id
                        == last_planter_work_status_subquery.c.planter_work_id
                    )
                    & (pws.id == last_planter_work_status_subquery.c.last_pwd_id),
                )
                .filter(
                    pw.is_del == False,
                    pw.planter_id == request_planter.id,
                    pws.status.in_(["WORKING", "PAUSE"]),
                )
                .order_by(pw.created_at.desc())
                .all()
            )

            # 현재 Planter의 PlanterWork 중 PlanterWorkStatus가 WORKING, PAUSE상태가 아니라면 WORKING으로 변경
            if not check_working_puase_planter_work:
                new_planter_work_status = create_(
                    db,
                    models.PlanterWorkStatus,
                    planter_work_id=planter_work_id,
                    status="WORKING",
                )
                db.add(new_planter_work_status)
                db.commit()
                db.refresh(new_planter_work_status)
                return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))
            # 이미 Planter에 등록된 PlanterWork 중 WORKING 또는 PAUSE 상태인 작업이 있어 오류 리턴
            else:
                return JSONResponse(
                    status_code=400, content=dict(msg="ALEADY_WORKING_PLANTER")
                )

        # 현재 상태가 PAUSE일 경우 : WORKING으로 변경
        elif last_planter_work_status.status == "PAUSE":
            new_planter_work_status = create_(
                db,
                models.PlanterWorkStatus,
                planter_work_id=planter_work_id,
                status="WORKING",
            )
            db.add(new_planter_work_status)
            db.commit()
            db.refresh(new_planter_work_status)
            return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))
        # 현재 상태가 DONE, WOKRING일 경우 : 오류 리턴
        else:
            return JSONResponse(
                status_code=400, content=dict(msg="ALEADY_DONE_OR_WOKRING")
            )
    # 현재 PlanterWorkStatus의 상태가 WORKING일 경우에만 동작
    elif status == "PAUSE":
        if last_planter_work_status.status == "WORKING":
            new_planter_work_status = create_(
                db,
                models.PlanterWorkStatus,
                planter_work_id=planter_work_id,
                status="PAUSE",
            )
            db.add(new_planter_work_status)
            db.commit()
            db.refresh(new_planter_work_status)
            return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))
        else:
            return JSONResponse(
                status_code=400, content=dict(msg="NOT_CHANGE_TO_PAUSE")
            )
    # 현재 상태가 WORKING, PAUSE 일 경우에만 동작
    elif status == "DONE":
        if (
            last_planter_work_status.status == "WORKING"
            or last_planter_work_status.status == "PAUSE"
        ):
            new_planter_work_status = create_(
                db,
                models.PlanterWorkStatus,
                planter_work_id=planter_work_id,
                status="DONE",
            )
            db.add(new_planter_work_status)
            db.commit()
            db.refresh(new_planter_work_status)
            return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))
        else:
            return JSONResponse(status_code=422, content=dict(msg="NOT_CHANGE_TO_DONE"))
    else:
        return JSONResponse(status_code=422, content=dict(msg="INVALID_REQUEST_VALUE"))
