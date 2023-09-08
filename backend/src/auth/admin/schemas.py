from pydantic import BaseModel
from typing import Optional, List


class AdminUserInfoBase(BaseModel):
    company: str
    department: str
    position: str
    phone: str


class AdminUserInfoCreate(AdminUserInfoBase):
    pass
