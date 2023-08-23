from sqlalchemy import create_engine, Column, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker

from sqlalchemy.ext.declarative import declarative_base

from dotenv import dotenv_values

SQLALCHEMY_DATABASE_URL = dotenv_values(".env")["DATABASE_URL"]

engine = create_engine(
    # SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    SQLALCHEMY_DATABASE_URL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

AppModelBase = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class BaseModel(AppModelBase):
    __abstract__ = True

    is_del = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True,
    )

    # @classmethod
    # async def create(cls, db: AsyncSession, **kwargs):
    #     instance = cls(**kwargs)
    #     await db.add(instance)
    #     await db.commit()
    #     await db.refresh(instance)
    #     return instance

    # @classmethod
    # async def get(cls, db: AsyncSession, **kwargs):
    #     return await db.query(cls).filter_by(**kwargs).first()


# Use event listeners to automatically update `updated_at`
# @event.listens_for(BaseModel, "before_update", propagate=True)
# def set_updated_at(mapper, connection, target):
#     target.updated_at = func.now()
