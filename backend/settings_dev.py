# Configurações específicas para desenvolvimento
# Este arquivo pode ser importado no settings.py quando DEBUG=True

import os

# Database para desenvolvimento com PostgreSQL
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB", "financeapp_dev"),
        "USER": os.environ.get("POSTGRES_USER", "financeuser"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "financepass"),
        "HOST": os.environ.get("POSTGRES_HOST", "postgres-dev"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}

# Cache com Redis para desenvolvimento
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://redis-dev:6379/1",
    }
}

# Configurações de desenvolvimento
DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "backend"]

# CORS para desenvolvimento
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

# Logging para desenvolvimento
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

# Email backend para desenvolvimento (console)
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Static files para desenvolvimento
STATIC_ROOT = "/app/backend/staticfiles"
MEDIA_ROOT = "/app/backend/media"
