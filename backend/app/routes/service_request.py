from fastapi import APIRouter, HTTPException, Query
from app.models import service_request as db
from app.schemas.service_request import ServiceRequestSchema

router = APIRouter(prefix="/requests", tags=["Requests"])

@router.get("/")
def get_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    return db.get_all_requests(skip, limit)

@router.post("/", status_code=201)
def add_request(req: ServiceRequestSchema):
    inserted_id = db.create_request(req)
    return {"id": inserted_id}

@router.patch("/{id}/approve")
def approve_request(id: str):
    ok = db.update_status(id, "accepted")
    if not ok:
        raise HTTPException(404, "Request not found")
    return {"message": "Request approved"}

@router.patch("/{id}/reject")
def reject_request(id: str):
    ok = db.update_status(id, "rejected")
    if not ok:
        raise HTTPException(404, "Request not found")
    return {"message": "Request rejected"}


