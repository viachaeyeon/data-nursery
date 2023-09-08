from utils.jwt_utils import validate_token
from utils.exceptions import AuthenticationException
from constant.cookie_set import (
    AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN,
    AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN,
)

from src.auth.models import User


# user_type-> "01": 일반유저, "99": 관리자
def get_current_user(user_type: str, token: dict, db):
    if user_type == "01":
        if token.get(AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN) == None:
            raise AuthenticationException(name="INVALID_TOKEN")

        login_id = validate_token(token[AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN])
        user = get_(db, User, login_id=login_id)

        if not user:
            raise AuthenticationException(name="INVALID_USER")

        if user.code != "01":
            raise AuthenticationException(name="INVALID_USER_TYPE")

    elif user_type == "99":
        if token.get(AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN) == None:
            raise AuthenticationException(name="INVALID_TOKEN")

        login_id = validate_token(token[AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN])
        user = get_(db, User, login_id=login_id)

        if not user:
            raise AuthenticationException(name="INVALID_USER")

        if user.code != "99":
            raise AuthenticationException(name="INVALID_USER_TYPE")

    if user.is_del:
        raise AuthenticationException(name="DELETED_USER")

    # if  user.code != user_type:
    #     raise AuthenticationException(name="FAILED_LOGIN")

    return user


def get_(session, model, **kwargs):
    try:
        instance = session.query(model).filter_by(**kwargs).first()
        return instance
    except:
        return None


def get_list_(session, model, **kwargs):
    try:
        instance = (
            session.query(model)
            .filter_by(**kwargs)
            .order_by(model.created_at.desc())
            .all()
        )
        return instance
    except:
        return None


# def get_or_create_(session, model, **kwargs):
#     try:
#         instance = (
#             session.query(model)
#             .filter_by(**kwargs)
#             .order_by(model.created_at.desc())
#             .first()
#         )
#         if instance:
#             return instance
#         else:
#             instance = model(**kwargs)
#             session.add(instance)
#             session.commit()
#             session.refresh(instance)
#             return instance
#     except:
#         return None


def create_(session, model, **kwargs):
    try:
        instance = model(**kwargs)
        # session.add(instance)
        # session.commit()
        # session.refresh(instance)
        return instance
    except:
        return None
