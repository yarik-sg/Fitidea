from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, database_engine
from app.api.v1 import auth as auth_router
from app.api.v1 import products, favorites, programs, gyms

app = FastAPI(title="Fitidea API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=database_engine)


app.include_router(auth_router.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
app.include_router(favorites.router, prefix="/api/v1")
app.include_router(programs.router, prefix="/api/v1")
app.include_router(gyms.router, prefix="/api/v1")


@app.get("/health")
def healthcheck():
    return {"status": "ok"}
