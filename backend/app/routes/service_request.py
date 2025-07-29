from fastapi import APIRouter, HTTPException, Query
from app.models import service_request as db
from app.schemas.service_request import ServiceRequestSchema


router = APIRouter(tags=["Requests"])

@router.get("/get/requests")
def get_requests():
    return db.get_all_requests()

@router.post("/post/requests", status_code=201)
def add_request(req: ServiceRequestSchema):
    inserted_id = db.create_request(req)
    return {"id": inserted_id}

@router.patch("/update/requests/{id}/approve")
def approve_request(id: str):
    ok = db.update_status(id, "Completed")
    if not ok:
        raise HTTPException(404, "Request not found")
    return {"message": "Request approved"}

@router.patch("/update/requests/{id}/reject")
def reject_request(id: str):
    ok = db.update_status(id, "Rejected")
    if not ok:
        raise HTTPException(404, "Request not found")
    return {"message": "Request rejected"}

@router.put("/update/requests/{id}")
def update_request(id: str, req: ServiceRequestSchema):
    ok = db.update_request(id, req)
    if not ok:
        raise HTTPException(404, "Request not found")
    return {"message": "Request updated"}

@router.delete("/delete/requests/{id}")
def delete_request(id: str):
    ok = db.delete_status(id, "Deleted")
    if ok == 0:
        raise HTTPException(404, "Request not found")
    return {"message": "Request deleted"}