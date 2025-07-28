from fastapi import APIRouter, HTTPException, Query
from app.models import service_request as db
from app.schemas.service_request import ServiceRequestSchema

router = APIRouter(prefix="/requests", tags=["Requests"])

@router.get("/")
def get_requests():
    return db.get_all_requests()

@router.post("/", status_code=201)
def add_request(req: ServiceRequestSchema):
    inserted_id = db.create_request(req)
    return {"id": inserted_id}

@router.patch("/{id}/approve")
def approve_request(id: str):
    ok = db.update_status(id, "Completed")
    if not ok:
        raise HTTPException(404, "Request not found")
    return {"message": "Request approved"}

@router.patch("/{id}/reject")
def reject_request(id: str):
    ok = db.update_status(id, "Rejected")
    if not ok:
        raise HTTPException(404, "Request not found")
    return {"message": "Request rejected"}

@router.put("/{id}")
def update_request(id: str, req: ServiceRequestSchema):
    print(f"Updating request with ID: {id} and data: {req}")
    ok = db.update_request(id, req)
    if not ok:
        raise HTTPException(404, "Request not found")
    return {"message": "Request updated"}