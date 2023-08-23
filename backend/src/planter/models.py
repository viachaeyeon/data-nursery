from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from utils.database import BaseModel, AppModelBase


class Planter(BaseModel):
    __tablename__ = "planters"

    farm_house_id = Column(Integer, ForeignKey("farm_houses.id"))
    id = Column(Integer, primary_key=True, index=True)
    serial_number = Column(String(length=255))
    is_register = Column(Boolean, default=False)
    register_date = Column(DateTime, nullable=True)

    planter_farm_house = relationship("FarmHouse", back_populates="farm_house_planter")
