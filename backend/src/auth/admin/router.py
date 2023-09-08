from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse
import bcrypt

from utils.database import get_db
from utils.db_shortcuts import get_current_user, create_, get_
import src.auth.models as authModels
import src.auth.schemas as authSchemas
import src.auth.admin.schemas as authAdminSchemas


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


@router.post("/admin/create", description="관리자 추가 api", status_code=200)
def create_admin_user(
    request: Request,
    user_data: authSchemas.UserCreate,
    admin_user_info_data: authAdminSchemas.AdminUserInfoCreate,
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)

    if user_data.code != "99":
        return JSONResponse(status_code=400, content=dict(msg="NOT_CRAETED_USER_CODE"))

    user_data.password = bcrypt.hashpw(
        user_data.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    new_user = create_(
        db,
        authModels.User,
        login_id=user_data.login_id,
        name=user_data.name,
        password=user_data.password,
        code=user_data.code,
    )

    new_admin_user_info = create_(
        db,
        authModels.AdminUserInfo,
        admin_user_info__user=new_user,
        company=admin_user_info_data.company,
        department=admin_user_info_data.department,
        position=admin_user_info_data.position,
        phone=admin_user_info_data.phone,
    )

    db.add(new_user)
    db.add(new_admin_user_info)
    db.commit()
    db.refresh(new_user)
    db.refresh(new_admin_user_info)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


@router.post("/admin/update/{user_id}", description="관리자 수정 api", status_code=200)
def update_admin_user(
    request: Request,
    user_id: int,
    user_data: authSchemas.UserUpdate,
    admin_user_info_data: authAdminSchemas.AdminUserInfoUpdate,
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)

    user = get_(db, authModels.User, id=user_id)
    admin_user_info = user.user__admin_user_info

    for field in user_data.__dict__:
        if getattr(user_data, field) is not None:
            if field == "password":
                setattr(
                    user,
                    field,
                    bcrypt.hashpw(
                        user_data.password.encode("utf-8"), bcrypt.gensalt()
                    ).decode("utf-8"),
                )
            else:
                setattr(user, field, getattr(user_data, field))

    for field in admin_user_info_data.__dict__:
        if getattr(admin_user_info_data, field) is not None:
            setattr(admin_user_info, field, getattr(admin_user_info_data, field))

    db.commit()
    db.refresh(user)
    db.refresh(admin_user_info)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


@router.get("/admin/user/list", description="관리자 목록 리스트 api", status_code=200)
def get_admin_user_list(request: Request, db: Session = Depends(get_db)):
    get_current_user("99", request.cookies, db)

    pass
