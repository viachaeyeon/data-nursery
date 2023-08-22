### alembic 사용법

- models.py 파일 생성 시 alembic/env.py 파일에 해당 경로 작성해주어야함
  AppModelBase.metadata 자체적으로 모델에대해서는 모르기 때문에 생성한 models 파일들을 연결해줘야한다.

- 마이그레이션 파일 생성

```
alembic revision --autogenerate -m "commit message"
```

- 마이그레이션 파일 DB에 적용

```
alembic upgrade head
```

- alembic head 위치 변경

```
# alembic stamp <revision>
alembic stamp head
```
