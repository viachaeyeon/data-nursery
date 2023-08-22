# FastAPI 앱을 초기화하는 프로젝트의 루트
from fastapi import  FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

import src.auth.models as AuthModel
import src.planter.models as PlanterModel

from dotenv import load_dotenv

from database import SessionLocal, engine


load_dotenv()

AuthModel.AppModelBase.metadata.create_all(bind=engine)
PlanterModel.AppModelBase.metadata.create_all(bind=engine)

app = FastAPI(
    title="data-nursery",
    description="헬퍼로보텍 자동파종기 데이터 플랫폼",
    version="0.0.1"
)

# CORS 설정
origins = [
    "http://192.168.2.100:3000",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
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

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

