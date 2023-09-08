from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from utils.database import get_db
from utils.db_shortcuts import get_current_user
import src.auth.models as authModels


router = APIRouter()


@router.get("/search/farm_house_id", description="관리자용 농가ID 검색 api", status_code=200)
def search_farm_house_id_for_admin(
    request: Request, search: str = None, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    farm_house_id_query = db.query(authModels.FarmHouse.farm_house_id)

    if search:
        farm_house_id_query = farm_house_id_query.filter(
            authModels.FarmHouse.farm_house_id.like(f"%{search}%")
        )

    farm_house_id_query = farm_house_id_query.order_by(
        authModels.FarmHouse.farm_house_id.asc()
    ).all()

    farm_house_id_response = [result[0] for result in farm_house_id_query]

    return farm_house_id_response


@router.get("/search/farmhouse_name", description="관리자용 농가명 검색 api", status_code=200)
def search_farmhouse_name_for_admin(
    request: Request, search: str = None, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    farmhouse_name_query = db.query(authModels.FarmHouse.name)

    if search:
        farmhouse_name_query = farmhouse_name_query.filter(
            authModels.FarmHouse.name.like(f"%{search}%")
        )

    farmhouse_name_query = farmhouse_name_query.order_by(
        authModels.FarmHouse.name.asc()
    ).all()

    farmhouse_name_response = [result[0] for result in farmhouse_name_query]

    return farmhouse_name_response
