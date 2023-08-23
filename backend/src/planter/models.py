from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from utils.database import BaseModel, AppModelBase

# from src.auth.models import User, FarmHouse


class Planter(BaseModel):
    __tablename__ = "planters"

    farm_house_id = Column(Integer, ForeignKey("farm_houses.id"))
    id = Column(Integer, primary_key=True, index=True)
    serial_number = Column(String(length=255))
    is_register = Column(Boolean, default=False)
    register_date = Column(DateTime, nullable=True)

    planter_farm_house = relationship("FarmHouse", back_populates="farm_house_planter")
    planter__planter_status = relationship(
        "PlanterStatus",
        back_populates="planter_status__planter",
        primaryjoin="Planter.id == PlanterStatus.planter_id",
    )

    planter__planter_work = relationship(
        "PlanterWork",
        back_populates="planter_work__planter",
        primaryjoin="Planter.id == PlanterWork.planter_id",
    )


class PlanterTray(BaseModel):
    __tablename__ = "planter_trays"

    id = Column(Integer, primary_key=True, index=True)
    width = Column(Integer)
    height = Column(Integer)

    planter_tray__planter_work = relationship(
        "PlanterWork",
        back_populates="planter_work__planter_tray",
        primaryjoin="PlanterTray.id == PlanterWork.planter_tray_id",
    )


class PlanterStatus(BaseModel):
    __tablename__ = "planter_status"

    id = Column(Integer, primary_key=True, index=True)
    planter_id = Column(Integer, ForeignKey("planters.id"))
    status = Column(String(5))  # OFF, ON, PAUSE 중 하나 저장

    planter_status__planter = relationship(
        "Planter", back_populates="planter__planter_status"
    )


class PlanterWork(BaseModel):
    __tablename__ = "planter_works"

    id = Column(Integer, primary_key=True, index=True)
    planter_id = Column(Integer, ForeignKey("planters.id"))
    planter_tray_id = Column(Integer, ForeignKey("planter_trays.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    crop_kind = Column(String(255))
    sowing_date = Column(DateTime)
    deadline = Column(DateTime)
    order_quantity = Column(Integer)
    seed_quantity = Column(Integer)
    operating_time = Column(Integer)

    planter_work__planter = relationship(
        "Planter", back_populates="planter__planter_work"
    )
    planter_work__planter_tray = relationship(
        "PlanterTray", back_populates="planter_tray__planter_work"
    )
    planter_work__crop = relationship("Crop", back_populates="crop__planter_work")
