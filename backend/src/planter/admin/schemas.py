from pydantic import BaseModel
from typing import Optional, List


class DashboardResponse(BaseModel):
    farmhouse_count: int
    crop_count: int
    planter_count: int
    total_output: int
