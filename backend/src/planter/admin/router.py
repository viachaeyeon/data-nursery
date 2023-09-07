from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, case, extract, desc
from starlette.responses import JSONResponse
from datetime import date, datetime, timedelta
from collections import defaultdict


import src.auth.models as authModels
import src.planter.models as planterModels
import src.planter.admin.schemas as planterAdminSchemas
import src.crops.models as cropModels
from utils.database import get_db
from utils.db_shortcuts import get_current_user


router = APIRouter()


@router.get(
    "/dashboard/status",
    description="관리자 개요페이지 내 농가수, 작물수, 파종기, 누적파종량 가져오는 api 입니다.",
    status_code=200,
    response_model=planterAdminSchemas.DashboardResponse,
)
def get_admin_dashboard_data(request: Request, db: Session = Depends(get_db)):
    get_current_user("99", request.cookies, db)

    # 농가 수
    farmhouse_count = (
        db.query(authModels.FarmHouse)
        .filter(authModels.FarmHouse.is_del == False)
        .count()
    )
    # 작물 수
    crop_count = (
        db.query(cropModels.Crop).filter(cropModels.Crop.is_del == False).count()
    )
    # 파종기 수
    planter_count = (
        db.query(planterModels.Planter)
        .filter(planterModels.Planter.is_del == False)
        .count()
    )
    # 누적 파종량
    total_output = (
        db.query(func.sum(planterModels.PlanterOutput.output))
        # .filter(planterModels.PlanterOutput.is_del == False)
        .scalar()
    )

    return {
        "farmhouse_count": farmhouse_count,
        "crop_count": crop_count,
        "planter_count": planter_count,
        "total_output": total_output,
    }


@router.get(
    "/dashboard/real-time",
    description="관리자 개요페이지 내 실시간 가동현황 불러오기",
)
def get_admin_dashboard_realtime_planter(
    request: Request, page: int = 1, size: int = 8, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    if page - 1 < 0:
        page = 0
    else:
        page -= 1

    last_planter_status_subquery = (
        db.query(
            planterModels.PlanterStatus.planter_id,
            func.max(planterModels.PlanterStatus.id).label("last_status_id"),
        )
        .filter(planterModels.PlanterStatus.is_del == False)
        .group_by(planterModels.PlanterStatus.planter_id)
        .subquery()
    )

    planters_data = (
        db.query(
            planterModels.Planter.id,
            authModels.FarmHouse.name.label("farm_house_name"),
            planterModels.PlanterStatus.status.label("planter_status"),
            func.sum(planterModels.PlanterOutput.output).label("planter_output"),
        )
        .join(
            authModels.FarmHouse,
            authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
        )
        .join(
            last_planter_status_subquery,
            last_planter_status_subquery.c.planter_id == planterModels.Planter.id,
        )
        .join(
            planterModels.PlanterStatus,
            planterModels.PlanterStatus.id
            == last_planter_status_subquery.c.last_status_id,
        )
        .outerjoin(
            planterModels.PlanterWork,
            planterModels.PlanterWork.planter_id == planterModels.Planter.id,
        )
        .outerjoin(
            planterModels.PlanterOutput,
            (
                planterModels.PlanterOutput.planter_work_id
                == planterModels.PlanterWork.id
            )
            & (planterModels.PlanterOutput.created_at >= date.today()),
        )
        .filter(
            planterModels.Planter.is_del == False,
            authModels.FarmHouse.is_del == False,
            # planterModels.PlanterOutput.created_at >= date.today(),
            # planterModels.PlanterStatus.status.in_(["ON", "PAUSE", "OFF"]),
        )
        .group_by(
            planterModels.Planter.id,
            authModels.FarmHouse.name,
            planterModels.PlanterStatus.id,
            planterModels.PlanterStatus.status,
        )
        .order_by(
            case(
                (planterModels.PlanterStatus.status == "ON", 1),
                (planterModels.PlanterStatus.status == "PAUSE", 2),
                (planterModels.PlanterStatus.status == "OFF", 3),
                else_=4,
            ),
            planterModels.PlanterStatus.id.desc(),
        )
    )

    total = planters_data.count()

    planter_responses = []

    for planter_id, farm_house_name, planter_status, planter_output in (
        planters_data.offset(page * size).limit(size).all()
    ):
        planter_responses.append(
            {
                "planter": planter_id,
                "farm_house_name": farm_house_name,
                "planter_status": planter_status,
                "planter_output": planter_output,
            }
        )

    return {"total": total, "planter": planter_responses}


@router.get(
    "/total-output",
    status_code=200,
    description="관리자 개요페이지 총 생산량 조회 api<br/>query_type = 'day' : 일별 조회<br/>query_type = 'month' : 월별 조회",
)
def get_total_output(request: Request, query_type: str, db: Session = Depends(get_db)):
    get_current_user("99", request.cookies, db)

    if query_type == "day":
        hourly_sums = (
            db.query(
                extract("hour", planterModels.PlanterOutput.updated_at).label("hour"),
                func.sum(planterModels.PlanterOutput.output).label("output_sum"),
            )
            .filter(
                func.Date(planterModels.PlanterOutput.updated_at)
                == datetime.utcnow().date()
            )
            .group_by("hour")
            .all()
        )

        return [{"hour": item[0], "output": item[1]} for item in hourly_sums]
    elif query_type == "month":
        hourly_sums = (
            db.query(
                extract("month", planterModels.PlanterOutput.updated_at).label("month"),
                func.sum(planterModels.PlanterOutput.output).label("output_sum"),
            )
            .filter(
                func.Date(planterModels.PlanterOutput.updated_at)
                == datetime.utcnow().date()
            )
            .group_by("month")
            .all()
        )

        return [{"month": item[0], "output": item[1]} for item in hourly_sums]

    else:
        return JSONResponse(status_code=433, content=dict(msg="UNPROCESSABLE_ENTITY"))


@router.get(
    "/crop/total-output",
    status_code=200,
    description="관리자 개요페이지 작물별 생산량 조회 api <br/>query_type = 'day' : 일별 조회<br/>query_type = 'month' : 월별 조회",
)
def get_crop_total_output(
    request: Request, query_type: str, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    grouped_data = defaultdict(list)

    if query_type == "day":
        houly_crop_sums = (
            db.query(
                cropModels.Crop.name,
                extract("hour", planterModels.PlanterOutput.updated_at).label("hour"),
                func.sum(planterModels.PlanterOutput.output).label("total_output"),
            )
            .join(
                planterModels.PlanterWork,
                cropModels.Crop.id == planterModels.PlanterWork.crop_id,
            )
            .join(
                planterModels.PlanterOutput,
                planterModels.PlanterWork.id
                == planterModels.PlanterOutput.planter_work_id,
            )
            .filter(
                func.Date(planterModels.PlanterOutput.updated_at)
                == datetime.utcnow().date()
            )
            .group_by(cropModels.Crop.name, "hour")
            .all()
        )

        for crop_name, hour, total_output in houly_crop_sums:
            crop_name = crop_name.lower()
            grouped_data[crop_name].append(
                {"hour": int(hour), "output": int(total_output)}
            )
    elif query_type == "month":
        monthly_crop_sums = (
            db.query(
                cropModels.Crop.name,
                extract("month", planterModels.PlanterOutput.updated_at).label("month"),
                func.sum(planterModels.PlanterOutput.output).label("total_output"),
            )
            .join(
                planterModels.PlanterWork,
                cropModels.Crop.id == planterModels.PlanterWork.crop_id,
            )
            .join(
                planterModels.PlanterOutput,
                planterModels.PlanterWork.id
                == planterModels.PlanterOutput.planter_work_id,
            )
            .filter(
                func.Date(planterModels.PlanterOutput.updated_at)
                == datetime.utcnow().date()
            )
            .group_by(cropModels.Crop.name, "month")
            .all()
        )

        for crop_name, month, total_output in monthly_crop_sums:
            crop_name = crop_name.lower()
            grouped_data[crop_name].append(
                {"month": int(month), "output": int(total_output)}
            )
    else:
        return JSONResponse(status_code=433, content=dict(msg="UNPROCESSABLE_ENTITY"))
    return grouped_data


@router.get(
    "/farmhouse/output",
    description="농가별 생산량을 당일, 당월 기준으로 조회하는 api<br/>query_type='day': 당일 조회<br/>query_type='month': 당월 조회",
    status_code=200,
)
def get_farmhouse_output(
    request: Request, query_type: str, db: Session = Depends(get_db)
):
    utc_now = datetime.utcnow()
    if query_type == "day":
        farmhouse_output = (
            db.query(
                authModels.FarmHouse.id,
                authModels.FarmHouse.name,
                func.sum(planterModels.PlanterOutput.output).label("total_output"),
            )
            .join(
                planterModels.Planter,
                authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
            )
            .join(
                planterModels.PlanterWork,
                planterModels.Planter.id == planterModels.PlanterWork.planter_id,
            )
            .join(
                planterModels.PlanterOutput,
                planterModels.PlanterWork.id
                == planterModels.PlanterOutput.planter_work_id,
            )
            .filter(func.Date(planterModels.PlanterOutput.updated_at) == utc_now.date())
            .group_by(authModels.FarmHouse.id, authModels.FarmHouse.name)
            .order_by(authModels.FarmHouse.name.asc())
            .all()
        )

        farmhouse_output_response = [
            {
                "farmhouse_id": result.id,
                "farmhouse_name": result.name,
                "total_output": int(result.total_output),
            }
            for result in farmhouse_output
        ]

    elif query_type == "month":
        farmhouse_output = (
            db.query(
                authModels.FarmHouse.id,
                authModels.FarmHouse.name,
                func.sum(planterModels.PlanterOutput.output).label("total_output"),
            )
            .join(
                planterModels.Planter,
                authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
            )
            .join(
                planterModels.PlanterWork,
                planterModels.Planter.id == planterModels.PlanterWork.planter_id,
            )
            .join(
                planterModels.PlanterOutput,
                planterModels.PlanterWork.id
                == planterModels.PlanterOutput.planter_work_id,
            )
            .filter(
                extract("year", planterModels.PlanterOutput.updated_at) == utc_now.year,
                extract("month", planterModels.PlanterOutput.updated_at)
                == utc_now.month,
            )
            .group_by(authModels.FarmHouse.id, authModels.FarmHouse.name)
            .order_by(desc("total_output"))
            .all()
        )

        farmhouse_output_response = [
            {
                "farmhouse_id": result.id,
                "farmhouse_name": result.name,
                "total_output": int(result.total_output),
            }
            for result in farmhouse_output
        ]
    else:
        return JSONResponse(status_code=433, content=dict(msg="UNPROCESSABLE_ENTITY"))
    return farmhouse_output_response


@router.get(
    "/planter/total-operating-time",
    description="파종기 가동시간을 전일, 전원을 기준으로 조회하는 api<br/>query_type='day': 전일 조회<br/>query_type='month': 전월 조회",
    status_code=200,
)
def get_planter_total_operating_time(
    request: Request, query_type: str, db: Session = Depends(get_db)
):
    utc_now = datetime.utcnow()

    if query_type == "day":
        yesterday = utc_now.date() - timedelta(days=1)
        total_planter_status_operating_time = (
            db.query(
                func.avg(planterModels.PlanterStatus.operating_time).label("total_avg")
            )
            .filter(
                planterModels.PlanterStatus.status == "OFF",
                planterModels.PlanterStatus.operating_time != 0,
                func.Date(planterModels.PlanterStatus.updated_at) == yesterday,
            )
            .scalar()
        )

        if not total_planter_status_operating_time:
            total_avg = 0
        else:
            total_avg = int(total_planter_status_operating_time)

        operating_time_farmhouse = (
            db.query(
                authModels.FarmHouse.name,
                func.sum(planterModels.PlanterStatus.operating_time).label(
                    "sum_operating_time"
                ),
            )
            .join(
                planterModels.Planter,
                authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
            )
            .join(
                planterModels.PlanterStatus,
                planterModels.Planter.id == planterModels.PlanterStatus.planter_id,
            )
            .filter(
                planterModels.PlanterStatus.status == "OFF",
                planterModels.PlanterStatus.operating_time != 0,
                func.Date(planterModels.PlanterStatus.updated_at) == yesterday,
            )
            .group_by(authModels.FarmHouse.name)
            .order_by(desc("sum_operating_time"))
            .all()
        )

    elif query_type == "month":
        this_month_first_day = utc_now.date().replace(day=1)
        last_month = this_month_first_day - timedelta(days=1)

        total_planter_status_operating_time = (
            db.query(
                func.avg(planterModels.PlanterStatus.operating_time).label("total_avg")
            )
            .filter(
                planterModels.PlanterStatus.status == "OFF",
                planterModels.PlanterStatus.operating_time != 0,
                extract("year", planterModels.PlanterStatus.updated_at)
                == last_month.year,
                extract("month", planterModels.PlanterStatus.updated_at)
                == last_month.month,
            )
            .scalar()
        )

        if not total_planter_status_operating_time:
            total_avg = 0
        else:
            total_avg = int(total_planter_status_operating_time)

        operating_time_farmhouse = (
            db.query(
                authModels.FarmHouse.name,
                func.sum(planterModels.PlanterStatus.operating_time).label(
                    "sum_operating_time"
                ),
            )
            .join(
                planterModels.Planter,
                authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
            )
            .join(
                planterModels.PlanterStatus,
                planterModels.Planter.id == planterModels.PlanterStatus.planter_id,
            )
            .filter(
                planterModels.PlanterStatus.status == "OFF",
                planterModels.PlanterStatus.operating_time != 0,
                extract("year", planterModels.PlanterStatus.updated_at)
                == last_month.year,
                extract("month", planterModels.PlanterStatus.updated_at)
                == last_month.month,
            )
            .group_by(authModels.FarmHouse.name)
            .order_by(desc("sum_operating_time"))
            .all()
        )
    else:
        return JSONResponse(status_code=433, content=dict(msg="UNPROCESSABLE_ENTITY"))

    if not operating_time_farmhouse:
        max_farmhouse_name = None
        max_farmhouse_sum_operating_time = 0
        min_farmhouse_name = None
        min_farmhouse_sum_operating_time = 0
    else:
        max_farmhouse_name = operating_time_farmhouse[0][0]
        max_farmhouse_sum_operating_time = operating_time_farmhouse[0][1]
        min_farmhouse_name = operating_time_farmhouse[-1][0]
        min_farmhouse_sum_operating_time = operating_time_farmhouse[-1][1]

    return {
        "total_avg": total_avg,
        "max": {
            "farmhouse_name": max_farmhouse_name,
            "operating_time": max_farmhouse_sum_operating_time,
        },
        "min": {
            "farmhouse_name": min_farmhouse_name,
            "operating_time": min_farmhouse_sum_operating_time,
        },
    }
