# FastAPI 앱을 초기화하는 프로젝트의 루트
from fastapi import FastAPI, Request, Response

# from fastapi.openapi.docs import get_swagger_ui_html
# from fastapi.openapi.utils import get_openapi
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import os

from utils.log_config import logger
from utils.exceptions import AuthenticationException

# from utils.database import get_db
# from utils.db_shortcuts import get_current_user
from src.auth import router as AuthRouter
from src.auth.admin import router as AuthAdminRouter
from src.crops import router as CropRouter
from src.crops.admin import router as CropAdminRouter
from src.planter import router as PlanterRouter
from src.planter.admin import router as PlanterAdminRouter
from constant.cookie_set import (
    AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN,
    AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN,
)

# from src.auth import models as AuthModel, router as AuthRouter
# from src.crops import models as CropModel, router as CropRouter
# from src.planter import models as PlanterModel, router as PlanterRouter

from settings import BASE_DIR

# from src.auth import router as AuthRouter
# from src.crops import router as CropRouter
# from src.planter import router as PlanterRouter

# from utils.database import AppModelBase


from dotenv import load_dotenv, dotenv_values

from utils.database import SessionLocal, engine


load_dotenv()

# AppModelBase.metadata.create_all(bind=engine)
# AuthModel.AppModelBase.metadata.create_all(bind=engine)
# CropModel.AppModelBase.metadata.create_all(bind=engine)
# PlanterModel.AppModelBase.metadata.create_all(bind=engine)


app = FastAPI(
    title="data-nursery",
    description="헬퍼로보텍 자동파종기 데이터 플랫폼",
    version="0.0.1",
    # TODO: 배포시 해당 부분 주석 제거
    # docs_url=None,
    # redoc_url=None,
    # openapi_url=None,
)


@app.exception_handler(AuthenticationException)
async def api_authentication_exception_handler(
    request: Request, exc: AuthenticationException
):
    response = JSONResponse(status_code=401, content=dict(msg=exc.name))
    response.delete_cookie(AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN)
    response.delete_cookie(AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN)
    # response.delete_cookie("_tr")
    return response


app.mount(
    "/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static"
)

app.include_router(AuthRouter.router, prefix="/api/auth", tags=["auth"])
app.include_router(
    AuthAdminRouter.router, prefix="/api/admin/auth", tags=["admin/auth"]
)
app.include_router(CropRouter.router, prefix="/api/crop", tags=["crop"])
app.include_router(
    CropAdminRouter.router, prefix="/api/admin/crop", tags=["admin/crop"]
)
app.include_router(PlanterRouter.router, prefix="/api/planter", tags=["planter"])
app.include_router(
    PlanterAdminRouter.router, prefix="/api/admin/planter", tags=["admin/planter"]
)

# CORS 설정
origins = dotenv_values(".env")["CORS_ORIGINS"].split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[
        "accept",
        "accept-encoding",
        "authorization",
        "content-type",
        "dnt",
        "origin",
        "user-agent",
        "x-csrftoken",
        "x-requested-with",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials",
    ],
)


# 미들웨어
@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)

    try:
        request.state.db = SessionLocal()
        response = await call_next(request)

        logger.info(
            f"Request: {request.method} - {request.url} / {response.status_code}"
        )

    finally:
        request.state.db.close()
    return response


# @app.get("/docs")
# async def get_documentation(
#     username: str, password: str, db: Session = Depends(get_current_user(""))
# ):
#     return get_swagger_ui_html(
#         openapi_url=f"/openapi.json?username={username}&password={password}",
#         title="docs",
#     )


# @app.get("/openapi.json")
# async def openapi(request: Request, db: Session = Depends(get_db)):
#     get_current_user("99", request)
#     return get_openapi(title="FastAPI", version="0.1.0", routes=app.routes)
