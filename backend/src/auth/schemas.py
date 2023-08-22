from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    login_id: str

class UserCreate(UserBase):
    password: str
    code: str
    # code: str | None = "01"

class User(UserBase):
    id: int
    login_id: str
    code: str
    farm_house: "FarmHouse"

    class Config:
        from_attributes = True

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

