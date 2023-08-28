from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from utils.database import BaseModel, AppModelBase

# from src.planter.models import PlanterWork


class Crop(BaseModel):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    # TODO: Unique True 추가?
    name = Column(String(length=255), index=True)
    image = Column(String)
    color = Column(String(length=10))

    crop__planter_work = relationship(
        "PlanterWork",
        back_populates="planter_work__crop",
        primaryjoin="Crop.id == PlanterWork.crop_id",
    )
