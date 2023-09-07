from pydantic import BaseModel
from typing import List, Optional

from datetime import datetime
from utils.database import TimezoneSchema


class PlanterBase(BaseModel):
    serial_number: str
    qrcode: str


class PlanterCreate(PlanterBase):
    pass


class Planter(PlanterBase):
    id: int


class PlanterStatusBase(BaseModel):
    planter_id: Optional[int]
    status: Optional[str]


class PlanterStatusCreate(PlanterStatusBase):
    pass


class PlanterStatus(PlanterStatusBase):
    id: Optional[int]


class PlanterWorkStatusBase(BaseModel):
    id: int
    status: str


class CropBase(BaseModel):
    id: int
    name: str


class PlanterTrayBase(BaseModel):
    width: int
    height: int
    total: int


class PlanterTray(PlanterTrayBase):
    id: int


class MultiplePlanterTrayResponse(BaseModel):
    planter_trays: List[PlanterTray]


class PlanterWorkBase(TimezoneSchema):
    crop_kind: str
    sowing_date: datetime
    deadline: datetime
    order_quantity: int | None = None
    seed_quantity: int | None = None
    # operating_time: int | None = None


class PlanterWorkCreate(PlanterWorkBase):
    # planter_id: int
    planter_tray_id: int
    crop_id: int


class PlanterWorkUpdate(BaseModel):
    sowing_date: Optional[datetime] = None
    deadline: Optional[datetime] = None
    crop_id: Optional[int] = None
    crop_kind: Optional[str] = None
    planter_tray_id: Optional[int] = None
    order_quantity: Optional[int] = None
    seed_quantity: Optional[int] = None
    is_del: Optional[bool] = None


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
