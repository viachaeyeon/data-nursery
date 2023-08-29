from dotenv import dotenv_values

AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN = dotenv_values(".env")[
    "AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN"
]
AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN = dotenv_values(".env")[
    "AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN"
]
AUTH_COOKIE_DOMAIN = dotenv_values(".env")["AUTH_COOKIE_DOMAIN"]
AUTH_COOKIE_SECURE = dotenv_values(".env")["AUTH_COOKIE_SECURE"]
