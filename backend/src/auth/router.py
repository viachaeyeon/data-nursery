from fastapi import APIRouter, Depends, Request
from starlette.responses import JSONResponse
from sqlalchemy.orm import Session

import bcrypt
from datetime import datetime, timedelta

import src.auth.schemas as schemas
import src.auth.models as models
from utils.db_shortcuts import get_current_user
from utils.database import get_db
from utils.jwt_utils import create_access_token
from constant.jwt_set import JWT_ACCESS_TOKEN_EXPIRE_DAY
from constant.cookie_set import (
    AUTH_COOKIE_DOMAIN,
    AUTH_COOKIE_SECURE,
    AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN,
    AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN,
)


router = APIRouter()


@router.post("/test/sign-up", status_code=201, response_model=schemas.User)
def sign_up_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if not user.login_id or not user.password:
        return JSONResponse(
            status_code=400, content=dict(msg="ID and password must be provide")
        )

    db_user = (
        db.query(models.User).filter(models.User.login_id == user.login_id).first()
    )
    if db_user:
        return JSONResponse(
            status_code=400, content=dict(msg="This ID is already taken")
        )

    # TODO: 실제 회원가입 시 FarmHouse도 같이 생성
    hash_pw = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    new_user = models.User(
        login_id=user.login_id, password=hash_pw.decode("utf-8"), code=user.code
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", status_code=200, response_model=schemas.UserToken)
def login_user(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    if not user_data.login_id or not user_data.password:
        return JSONResponse(
            status_code=400, content=dict(msg="ID and password must be provide")
        )

    login_user = (
        db.query(models.User).filter(models.User.login_id == user_data.login_id).first()
    )

    if not login_user:
        return JSONResponse(status_code=400, content=dict(msg="NO_MATCH_USER"))

    is_verified = bcrypt.checkpw(
        user_data.password.encode("utf-8"), login_user.password.encode("utf-8")
    )
    if not is_verified:
        return JSONResponse(status_code=400, content=dict(msg="NO_MATCH_USER"))

    # 삭제된 유저인지 판단
    if login_user.is_del:
        return JSONResponse(status_code=400, content=dict(msg="DELETED_USER"))

    # l_type == "01" 농가, l_type == "99" 관리자
    access_token = create_access_token(login_user.login_id)
    response = JSONResponse(status_code=200, content=dict(msg="LOGIN_SUCCESS"))

    if user_data.l_type == "01" and not login_user.code == "01":
        # 농가인지 판단
        return JSONResponse(status_code=400, content=dict(msg="LOGIN_FAILED"))
    else:
        response.set_cookie(
            key=AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN,
            value=access_token,
            httponly=True,
            expires=(
                datetime.utcnow() + timedelta(days=JWT_ACCESS_TOKEN_EXPIRE_DAY)
            ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
            domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
            secure=True if AUTH_COOKIE_SECURE != "False" else False,
            samesite="lax",
        )
    if user_data.l_type == "99" and not login_user.code == "99":
        # 관리자인지 판단
        return JSONResponse(status_code=400, content=dict(msg="LOGIN_FAILED"))
    else:
        response.set_cookie(
            key=AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN,
            value=access_token,
            httponly=True,
            expires=(
                datetime.utcnow() + timedelta(days=JWT_ACCESS_TOKEN_EXPIRE_DAY)
            ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
            domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
            secure=True if AUTH_COOKIE_SECURE != "False" else False,
            samesite="lax",
        )

    # refresh_token = create_refresh_token(login_user.login_id)

    # response.set_cookie(
    #     key="_tr",
    #     value=refresh_token,
    #     httponly=True,
    #     expires=(
    #         datetime.utcnow() + timedelta(days=JWT_REFRESH_TOKEN_EXPIRE_DAY)
    #     ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
    #     domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
    #     secure=True if AUTH_COOKIE_SECURE != "False" else False,
    #     samesite="lax",
    # )

    return response


@router.get(
    "/common/user",
    status_code=200,
)
def get_user(request: Request, db: Session = Depends(get_db)):
    user = get_current_user("01", request.cookies, db)

    access_token = create_access_token(user.login_id)
    # refresh_token = create_refresh_token(user.login_id)

    response = JSONResponse(
        status_code=200,
        content={
            "user": {
                "id": user.id,
                "name": user.name,
            },
            "farm_house": {
                "id": user.user_farm_house.id,
                "name": user.user_farm_house.name,
                "nursery_number": user.user_farm_house.nursery_number,
                "phone": user.user_farm_house.phone,
            },
            "planter": {
                "id": user.user_farm_house.farm_house_planter.id,
                "serial_number": user.user_farm_house.farm_house_planter.serial_number,
                "is_register": user.user_farm_house.farm_house_planter.is_register,
            },
        },
    )

    response.set_cookie(
        key=AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN,
        value=access_token,
        httponly=True,
        expires=(
            datetime.utcnow() + timedelta(days=JWT_ACCESS_TOKEN_EXPIRE_DAY)
        ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
        domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
        secure=True if AUTH_COOKIE_SECURE != "False" else False,
        samesite="lax",
    )
    # response.set_cookie(
    #     key="_tr",
    #     value=refresh_token,
    #     httponly=True,
    #     expires=(
    #         datetime.utcnow() + timedelta(days=JWT_REFRESH_TOKEN_EXPIRE_DAY)
    #     ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
    #     domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
    #     secure=True if AUTH_COOKIE_SECURE != "False" else False,
    #     samesite="lax",
    # )

    return response


@router.get(
    "/admin/user",
    status_code=200,
)
def get_user(request: Request, db: Session = Depends(get_db)):
    user = get_current_user("99", request.cookies, db)

    access_token = create_access_token(user.login_id)
    # refresh_token = create_refresh_token(user.login_id)

    response = JSONResponse(
        status_code=200,
        content={
            "user": {
                "id": user.id,
                "name": user.name,
            }
        },
    )

    response.set_cookie(
        key="_taa",
        value=access_token,
        httponly=True,
        expires=(
            datetime.utcnow() + timedelta(days=JWT_ACCESS_TOKEN_EXPIRE_DAY)
        ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
        domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
        secure=True if AUTH_COOKIE_SECURE != "False" else False,
        samesite="lax",
    )
    # response.set_cookie(
    #     key="_tra",
    #     value=refresh_token,
    #     httponly=True,
    #     expires=(
    #         datetime.utcnow() + timedelta(days=JWT_REFRESH_TOKEN_EXPIRE_DAY)
    #     ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
    #     domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
    #     secure=True if AUTH_COOKIE_SECURE != "False" else False,
    #     samesite="lax",
    # )

    return response


# @router.post("/test/jwt-validate")
# def test_jwt_validate(token: schemas.UserToken, db: Session = Depends(get_db)):
#     valided_jwt = validate_token(token.access)

#     if not valided_jwt:
#         return JSONResponse(
#             status_code=401, content=dict(msg="USER_CERTIFICATION_EXPIRED")
#         )

#     return {"test": "test"}
