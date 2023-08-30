from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from starlette.responses import JSONResponse
from sqlalchemy.orm import Session

import bcrypt
from datetime import datetime, timedelta

import src.auth.schemas as schemas
import src.auth.models as models
import src.planter.models as planterModels
from utils.db_shortcuts import get_current_user
from utils.database import get_db
from utils.file_upload import single_file_uploader, delete_file
from utils.jwt_utils import create_access_token
from utils.db_shortcuts import get_, create_
from constant.jwt_set import JWT_ACCESS_TOKEN_EXPIRE_DAY
from constant.cookie_set import (
    AUTH_COOKIE_DOMAIN,
    AUTH_COOKIE_SECURE,
    AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN,
    AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN,
)


router = APIRouter()


@router.post(
    "/test/sign-up",
    description="test 유저 생성용입니다.<br/>파종기 정보가 같이 생성되지 않습니다.",
    status_code=201,
    response_model=schemas.User,
)
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


@router.post(
    "/login",
    description="유저 로그인시 사용합니다.<br/>일반유저(농가)와 관리자유저의 로그인 구분을 l_type의 값으로 판단합니다.<br/>01: 일반유저, 99: 관리자",
    status_code=200,
    response_model=schemas.UserToken,
)
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

    access_token = create_access_token(login_user.login_id)

    # l_type == "01" 농가, l_type == "99" 관리자
    if user_data.l_type != login_user.code:
        # 로그인 요청 타입과 유저 타입이 맞지 않는 경우 오류 리턴
        return JSONResponse(status_code=400, content=dict(msg="LOGIN_FAILED"))

    # 농가일 경우 쿠키 설정
    if user_data.l_type == "01":
        farm_house = login_user.user_farm_house
        planter = login_user.user_farm_house.farm_house_planter

        response = JSONResponse(
            status_code=200,
            content={
                "user": {
                    "id": login_user.id,
                    "name": login_user.name,
                },
                "farm_house": {
                    "id": farm_house.id,
                    "name": farm_house.name,
                    "farm_house_id": farm_house.farm_house_id,
                    "producer_name": farm_house.producer_name,
                    "nursery_number": farm_house.nursery_number,
                    "phone": farm_house.phone,
                },
                "planter": {
                    "id": planter.id,
                    "serial_number": planter.serial_number,
                    "is_register": planter.is_register,
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

    # 관리자일 경우 쿠키 설정
    if user_data.l_type == "99":
        response = JSONResponse(
            status_code=200,
            content={
                "user": {
                    "id": login_user.id,
                    "name": login_user.name,
                }
            },
        )

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

    return response


@router.get(
    "/common/user",
    description="일반유저 로그인 시 사용합니다.<br/>로그인 요청 시 _ta 키를 갖고있는 쿠키가 있어야합니다.<br/>로그인 성공 시 유저 정보를 리턴해줍니다.",
    status_code=200,
)
def get_user(request: Request, db: Session = Depends(get_db)):
    user = get_current_user("01", request.cookies, db)

    access_token = create_access_token(user.login_id)

    farm_house = user.user_farm_house
    planter = user.user_farm_house.farm_house_planter

    response = JSONResponse(
        status_code=200,
        content={
            "user": {
                "id": user.id,
                "name": user.name,
            },
            "farm_house": {
                "id": farm_house.id,
                "name": farm_house.name,
                "farm_house_id": farm_house.farm_house_id,
                "producer_name": farm_house.producer_name,
                "nursery_number": farm_house.nursery_number,
                "phone": farm_house.phone,
            },
            "planter": {
                "id": planter.id,
                "serial_number": planter.serial_number,
                "is_register": planter.is_register,
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

    return response


@router.get(
    "/admin/user",
    description="관리자 유저 로그인 시 사용합니다.<br/>로그인 요청 시 _taa 키를 갖고있는 쿠키가 있어야합니다.<br/>로그인 성공 시 유저 정보를 리턴해줍니다.",
    status_code=200,
    # openapi_extra="?"
    # include_in_schema=False,
)
def get_user(request: Request, db: Session = Depends(get_db)):
    user = get_current_user("99", request.cookies, db)

    access_token = create_access_token(user.login_id)

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

    return response


@router.post("/create/harmhouse", description="관리자페이지에서 농가 추가할때 사용", status_code=201)
async def create_farm_house(
    request: Request,
    serial_number: str = Form(...),
    nursery_number: str = Form(...),
    farm_house_id: str = Form(...),
    name: str = Form(...),
    producer_name: str = Form(...),
    phone: str = Form(...),
    address: str = Form(...),
    qrcode: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # api 요청한 유저가 관리자 유저인지 확인
    get_current_user("99", request.cookies, db)

    dup_check_user = get_(db, models.User, login_id=serial_number)
    if dup_check_user != None:
        return JSONResponse(status_code=404, content=dict(msg="DUPLICATED_LOGIN_ID"))

    dup_check_farm_house_name = get_(db, models.FarmHouse, name=name)
    if dup_check_farm_house_name != None:
        return JSONResponse(
            status_code=404, content=dict(msg="DUPLICATED_FARM_HOUSE_NAME")
        )
    dup_check_farm_house_nursery_number = get_(
        db, models.FarmHouse, nursery_number=nursery_number
    )
    if dup_check_farm_house_nursery_number != None:
        return JSONResponse(
            status_code=404, content=dict(msg="DUPLICATED_FARM_HOUSE_NURSERY_NUMBER")
        )
    dup_check_farm_house_id = get_(db, models.FarmHouse, farm_house_id=farm_house_id)
    if dup_check_farm_house_id != None:
        return JSONResponse(
            status_code=404, content=dict(msg="DUPLICATED_FARM_HOUSE_ID")
        )

    dup_check_planter_serial_number = get_(
        db, planterModels.Planter, serial_number=serial_number
    )
    if dup_check_planter_serial_number != None:
        return JSONResponse(
            status_code=404, content=dict(msg="DUPLICATED_PLANTER_SERIAL_NUMBER")
        )

    hash_pw = bcrypt.hashpw(phone.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    new_user = create_(
        db,
        models.User,
        login_id=serial_number,
        name=producer_name,
        password=hash_pw,
        code="01",
    )
    new_farm_house = create_(
        db,
        models.FarmHouse,
        farm_house_user=new_user,
        name=name,
        nursery_number=nursery_number,
        farm_house_id=farm_house_id,
        producer_name=producer_name,
        address=address,
        phone=phone,
    )

    saved_qrcode = await single_file_uploader(qrcode)

    if not saved_qrcode["is_success"]:
        return JSONResponse(status_code=400, content=dict(msg="FAIL_SAVE_QRCODE"))

    new_planter = create_(
        db,
        models.Planter,
        planter_farm_house=new_farm_house,
        serial_number=serial_number,
        qrcode=saved_qrcode["url"],
    )
    try:
        db.add(new_user)
        db.add(new_farm_house)
        db.add(new_planter)
        db.commit()
        db.refresh(new_user)
        db.refresh(new_farm_house)
        db.refresh(new_planter)
    except Exception as e:
        if saved_qrcode["is_success"]:
            await delete_file(saved_qrcode["url"])
        return JSONResponse(status_code=400, content=dict(msg="CREATED_FAILED"))

    return JSONResponse(status_code=201, content=dict(msg="CREATED_SUCCESS"))
