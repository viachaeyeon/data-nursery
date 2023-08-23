from fastapi import APIRouter

router = APIRouter()


@router.get("/test")
def get_planter():
    return {"message": "Planter endpoint"}
