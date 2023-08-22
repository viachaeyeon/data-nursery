from sqlalchemy import Column, String, Integer,Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from database import AppModelBase

class Planter(AppModelBase):
    __tablename__ = "planters"

    farm_house = Column(Integer, ForeignKey("farm_houses.id"))
    id = Column(Integer, primary_key=True, index=True)
    serial_number = Column(String(length=255))
    is_register = Column(Boolean, default=False)
    register_date = Column(DateTime, nullable=True)

    # is_del = Column(Boolean, default=False)
    # created_at = Column(DateTime, server_default=datetime.now(), nullable=False)
    # updated_at = Column(DateTime, nullable=False)

    planter_farm_house = relationship("FarmHouse", back_populates="farm_house_planter")