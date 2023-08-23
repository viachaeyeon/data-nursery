from fastapi import status
from jose import jwt

from typing import Union, Any
from datetime import datetime, timedelta

from constant.jwt_set import (
    JWT_SECRET_KEY,
    JWT_REFRESH_SECRET_KEY,
    JWT_ALGORITHM,
    JWT_ACCESS_TOKEN_EXPIRE_DAY,
    JWT_REFRESH_TOKEN_EXPIRE_DAY,
)


def create_access_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_time = datetime.utcnow() + expires_delta
    else:
        expires_time = datetime.now() + timedelta(days=JWT_ACCESS_TOKEN_EXPIRE_DAY)
        # INFO: 만료시간 초단위로 두고 테스트용
        # expires_time = datetime.utcnow() + timedelta(
        #     seconds=JWT_ACCESS_TOKEN_EXPIRE_DAY
        # )

    to_encode = {"exp": expires_time, "login_id": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, JWT_ALGORITHM)
    return encoded_jwt


def create_refresh_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_time = datetime.utcnow() + expires_delta
    else:
        expires_time = datetime.utcnow() + timedelta(days=JWT_REFRESH_TOKEN_EXPIRE_DAY)
        # INFO: 만료시간 초단위로 두고 테스트용
        # expires_time = datetime.utcnow() + timedelta(
        #     seconds=JWT_ACCESS_TOKEN_EXPIRE_DAY
        # )

    to_encode = {"exp": expires_time, "login_id": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_REFRESH_SECRET_KEY, JWT_ALGORITHM)
    return encoded_jwt


def regenerate_access_refresh_token(token: {"access": str, "refresh": str}):
    # TODO: access 토큰 유효성검사 후 만료되었을 경우, refresh 토큰 유효성검사 진행
    # TODO: refresh 토큰 살아있을 경우에는 access 토큰 재발급?
    # try:
    #     jwt.decode(token, )
    try:
        decoded_access_token = jwt.decode(
            token.access, JWT_SECRET_KEY, algorithms=JWT_ALGORITHM
        )
        print("=============================+")
        print("=============================+")
        print(decoded_access_token)
        print("=============================+")
        print("=============================+")
        # TODO: access, refresh 토큰 새로고침해서 리턴해주기
    except jwt.ExpiredSignatureError:
        print("===========================")
        print("===========================")
        print("Access Token 시간 만료")
        print("===========================")
        print("===========================")

        try:
            decoded_refresh_token = jwt.decode(
                token.refresh, JWT_REFRESH_SECRET_KEY, algorithms=JWT_ALGORITHM
            )
            # TODO: access, refresh 토큰 새로고침해서 리턴해주기
            print("=============================+")
            print("=============================+")
            print(decoded_refresh_token)
            print("=============================+")
            print("=============================+")

        except jwt.ExpiredSignatureError:
            return {"status": status.HTTP_401_UNAUTHORIZED}
        return {"status": status.HTTP_401_UNAUTHORIZED}
    return {"status": status.HTTP_200_OK}


# access_token 받아서 유효한 토큰인지 확인
def validate_token(access_token: str):
    try:
        jwt.decode(access_token, JWT_SECRET_KEY, algorithms=JWT_ALGORITHM)
    except:
        return False
    # INFO: 후에 각 만료토큰, 유효하지 않은 토큰 등 오류 핸들링 필요할때 사용
    # except jwt.ExpiredSignatureError:
    #     return False
    # except jwt.ExpiredSignatureError:
    #     return False
    return True
