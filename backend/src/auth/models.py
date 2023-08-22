from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, event, Text
from sqlalchemy.orm import relationship

from datetime import datetime

from database import AppModelBase

class User(AppModelBase):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    login_id = Column(String(length=20), unique=True, index=True)
    password = Column(String)
    code = Column(String(length=2), default="01")

    # is_del = Column(Boolean, default=False)
    # created_at = Column(DateTime, server_default=datetime.now(), nullable=False)
    # updated_at = Column(DateTime, nullable=True)

    user_farm_house = relationship("FarmHouse", uselist=False, back_populates="farm_house_user")

@event.listens_for(User, "before_update", propagate=True)
def set_updated_at(mapper, connection, target):
    target.updated_at = datetime.now()


class FarmHouse(AppModelBase):
    __tablename__ = "farm_houses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(length=255), unique=True, index=True)
    nursery_number = Column(String(length=244), unique=True, index=True)
    address = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
    phone = Column(String(length=20))

    # is_del = Column(Boolean, default=False)
    # created_at = Column(DateTime, server_default=datetime.now(), nullable=False)
    # updated_at = Column(DateTime, nullable=True)

    farm_house_user = relationship("User", back_populates="user_farm_house")
    # farm_house_planter = relationship("Planter", uselist=False, back_populates="planter_farm_house")