from fastapi import APIRouter, Depends, Request
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload, aliased
from starlette.responses import JSONResponse

from datetime import datetime
from pytz import timezone, utc

# import pytz

import src.planter.models as models
import src.planter.schemas as schemas
import src.crops.models as cropModels
from utils.database import get_db
from utils.db_shortcuts import get_, create_, get_current_user


router = APIRouter()
