from dotenv import dotenv_values

AUTH_COOKIE_DOMAIN = dotenv_values(".env")["AUTH_COOKIE_DOMAIN"]
AUTH_COOKIE_SECURE = dotenv_values(".env")["AUTH_COOKIE_SECURE"]
