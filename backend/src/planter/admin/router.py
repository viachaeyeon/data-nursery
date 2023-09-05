from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from starlette.responses import JSONResponse

from datetime import datetime, date

import src.auth.models as authModels
import src.planter.models as planterModels
import src.planter.schemas as planterSchemas
import src.planter.admin.schemas as planterAdminSchemas
import src.crops.models as cropModels
from utils.database import get_db
from utils.db_shortcuts import get_, create_, get_current_user


router = APIRouter()


@router.get(
    "/admin/dashboard/status",
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
        .filter(planterModels.PlanterOutput.is_del == False)
        .scalar()
    )

    return {
        "farmhouse_count": farmhouse_count,
        "crop_count": crop_count,
        "planter_count": planter_count,
        "total_output": total_output,
    }


@router.get(
    "/admin/dashboard/real-time",
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

    # planters_data = (
    #     db.query(
    #         planterModels.Planter.id,
    #         authModels.FarmHouse.name.label("farm_house_name"),
    #         planterModels.PlanterStatus.status.label("planter_status"),
    #         func.sum(planterModels.PlanterOutput.output).label("planter_output"),
    #     )
    #     .join(
    #         authModels.FarmHouse,
    #         authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
    #     )
    #     .join(
    #         last_planter_status_subquery,
    #         last_planter_status_subquery.c.planter_id == planterModels.Planter.id,
    #     )
    #     .join(
    #         planterModels.PlanterStatus,
    #         planterModels.PlanterStatus.id
    #         == last_planter_status_subquery.c.last_status_id,
    #     )
    #     .join(
    #         planterModels.PlanterWork,
    #         planterModels.PlanterWork.planter_id == planterModels.Planter.id,
    #     )
    #     .join(
    #         planterModels.PlanterOutput,
    #         planterModels.PlanterOutput.planter_work_id == planterModels.PlanterWork.id,
    #     )
    #     .filter(
    #         planterModels.Planter.is_del == False,
    #         authModels.FarmHouse.is_del == False,
    #         # planterModels.PlanterOutput.created_at >= date.today(),
    #         planterModels.PlanterStatus.status.in_(["ON", "PAUSE", "OFF"]),
    #     )
    #     .group_by(
    #         planterModels.Planter.id,
    #         authModels.FarmHouse.name,
    #         planterModels.PlanterStatus.status,
    #     )
    #     .all()
    # )
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
            planterModels.PlanterOutput.planter_work_id == planterModels.PlanterWork.id,
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
        # .all()
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
