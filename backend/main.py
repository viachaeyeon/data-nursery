# FastAPI 앱을 초기화하는 프로젝트의 루트
from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import os

from utils.log_config import logger
from src.auth import router as AuthRouter
from src.crops import router as CropRouter
from src.planter import router as PlanterRouter
from src.planter.admin import router as PlanterAdminRouter
from utils.exceptions import AuthenticationException
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
app.include_router(CropRouter.router, prefix="/api/crop", tags=["crop"])
app.include_router(PlanterRouter.router, prefix="/api/planter", tags=["planter"])
app.include_router(
    PlanterAdminRouter.router, prefix="/api/planter", tags=["admin/planter"]
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
