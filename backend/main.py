# FastAPI 앱을 초기화하는 프로젝트의 루트
from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import os

from src.auth import router as AuthRouter
from src.crops import router as CropRouter
from src.planter import router as PlanterRouter

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

app = FastAPI(title="data-nursery", description="헬퍼로보텍 자동파종기 데이터 플랫폼", version="0.0.1")

app.mount(
    "/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static"
)

app.include_router(AuthRouter.router, prefix="/api/auth", tags=["auth"])
app.include_router(CropRouter.router, prefix="/api/crop", tags=["crop"])
app.include_router(PlanterRouter.router, prefix="/api/planter", tags=["planter"])

# CORS 설정
origins = dotenv_values(".env")["CORS_ORIGINS"].split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 미들웨어
@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response
