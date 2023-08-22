from fastapi import APIRouter, Depends, HTTPException
from starlette.responses import JSONResponse
from sqlalchemy.orm import Session

import bcrypt



import src.auth.schemas as schemas
import src.auth.models as models
from utils.database import get_db

router = APIRouter()

@router.get("/test", status_code=200)
def get_auth():
    return {"message": "Authentication endpoint"}

@router.post("/sign-up", status_code=201,response_model=schemas.User)
def sign_up_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if not user.login_id or not user.password:        
        return JSONResponse(status_code=400, content=dict(msg="ID and password must be provide"))

    db_user = db.query(models.User).filter(models.User.login_id == user.login_id).first()
    if db_user:
        raise JSONResponse(status_code=400, content=dict(msg="This ID is already taken"))
    
    # TODO: 실제 회원가입 시 FarmHouse도 같이 생성
    hash_pw = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    new_user = models.User(login_id=user.login_id, password=hash_pw.decode("utf-8"))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", status_code=200, response_model=schemas.User)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    if not user.login_id or not user.password:        
        return JSONResponse(status_code=400, content=dict(msg="ID and password must be provide"))
    
    login_user = db.query(models.User).filter(models.User.login_id == user.login_id).first()
    
    if not login_user:
        return JSONResponse(status_code=400, content=dict(msg="NO_MATCH_USER"))

    is_verified = bcrypt.checkpw(user.password.encode("utf-8"), login_user.password.encode("utf-8"))
    if not is_verified:
        return JSONResponse(status_code=400, content=dict(msg="NO_MATCH_USER"))
    
    return JSONResponse(status_code=200, content=dict (id= 1, login_id="test",code= "01", test="ㅋㅋㅋ"))