from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    login_id: str


class UserCreate(UserBase):
    password: str
    # code: str | None = "01"


class UserLogin(UserBase):
    password: str


class User(UserBase):
    id: int
    code: str
    # farm_house: Optional["FarmHouse"] = None

    class Config:
        from_attributes = True


class UserToken(BaseModel):
    access: str
    refresh: str


class FarmHouseBase(BaseModel):
    name: str
    nursery_number: str
    address: str
    phone: str


class FarmHouseCreate(FarmHouseBase):
    owner_id: int


class FarmHouse(FarmHouseBase):
    id: int
    owner: User

    class Config:
        from_attributes = True
