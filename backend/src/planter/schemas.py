from pydantic import BaseModel

from datetime import datetime
from utils.database import TimezoneSchema


class PlanterWorkStatusBase(BaseModel):
    id: int
    status: str


class CropBase(BaseModel):
    id: int
    name: str


class PlanterTrayBase(BaseModel):
    pass


class PlanterTrayCreate(PlanterTrayBase):
    width: int
    height: int


class PlanterTray(PlanterTrayBase):
    id: int
    width: int
    height: int


class PlanterWorkBase(TimezoneSchema):
    crop_kind: str
    sowing_date: datetime
    deadline: datetime
    order_quantity: int | None = None
    seed_quantity: int | None = None
    operating_time: int | None = None


class PlanterWorkCreate(PlanterWorkBase):
    planter_id: int
    planter_tray_id: int
    crop_id: int


class PlanterWork(PlanterWorkBase):
    id: int
    planter_id: int


class PlanterWorkResponse(BaseModel):
    crop: CropBase
    planter_work_status: PlanterWorkStatusBase
    planter_tray: PlanterTray
    planter_work: PlanterWork


class PlanterOperatingDataCreate(BaseModel):
    data: str
