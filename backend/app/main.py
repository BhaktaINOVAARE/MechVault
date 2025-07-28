from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import service_request

app = FastAPI(title="MechVault API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # adjust to your Angular URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(service_request.router)

@app.get("/", tags=["Health"])
def read_root():
    return {"message": "FastAPI is working!"}