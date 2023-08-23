from pydantic import BaseModel


class Crops(BaseModel):
    id: int
    name: str
    image: str
    color: str

    class Config:
        from_attributes = True
