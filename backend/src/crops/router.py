from fastapi import APIRouter, Depends, UploadFile, File, Form
from starlette.responses import JSONResponse
from sqlalchemy.orm import Session

from utils.database import get_db
from utils.file_upload import single_file_uploader
import src.crops.schemas as schemas
import src.crops.models as models

router = APIRouter()


@router.post("/create", status_code=201)
async def crop_create(
    # name: str, color: str, image: UploadFile = File(...), db: Session = Depends(get_db)
    name: str = Form(...),
    color: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    saved_file = await single_file_uploader(image)

    if not saved_file["is_success"]:
        return JSONResponse(status_code=400, content=dict(msg="FAIL_SAVE_DATA"))

    new_crop = models.Crop(name=name, image=saved_file["url"], color=color)

    db.add(new_crop)
    db.commit()
    db.refresh(new_crop)

    return JSONResponse(status_code=201, content=dict(msg="CROP_CREATE_SUCCESS"))


# @router.get("/list", status_code=200)
# def get_crop_list()
