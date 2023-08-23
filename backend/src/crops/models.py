from sqlalchemy import Column, Integer, String

from utils.database import BaseModel, AppModelBase


class Crop(BaseModel):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    image = Column(String)
    color = Column(String(length=10))
