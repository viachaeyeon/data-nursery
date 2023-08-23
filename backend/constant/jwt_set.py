from dotenv import dotenv_values

JWT_SECRET_KEY = dotenv_values(".env")["JWT_SECRET_KEY"]
JWT_REFRESH_SECRET_KEY = dotenv_values(".env")["JWT_REFRESH_SECRET_KEY"]
JWT_ALGORITHM = dotenv_values(".env")["JWT_ALGORITHM"]
JWT_ACCESS_TOKEN_EXPIRE_DAY = 7
JWT_REFRESH_TOKEN_EXPIRE_DAY = 21
