from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from utils.database import get_db
from utils.db_shortcuts import get_current_user
import src.crops.models as cropModels


router = APIRouter()


@router.get("/search/crop_name", description="관리자용 작물명 검색 api", status_code=200)
def search_crop_name_for_admin(
    request: Request, search: str = None, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    crop_name_query = db.query(cropModels.Crop.name)

    if search:
        crop_name_query = crop_name_query.filter(
            cropModels.Crop.name.like(f"%{search}%")
        )

    crop_name_query = crop_name_query.order_by(cropModels.Crop.name.asc()).all()

    crop_name_response = [result[0] for result in crop_name_query]

    return crop_name_response
