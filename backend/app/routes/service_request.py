from fastapi import APIRouter, HTTPException, Query
from app.models import service_request as db
from app.schemas.service_request import ServiceRequestSchema
from typing import Optional, Dict, Any


router = APIRouter(tags=["Requests"])

# @router.get("/get/requests")
# def get_requests():
#     return db.get_all_requests()




# @router.get("/get/requests")
# def get_requests(skip: int = Query(0, ge=0), limit: int = Query(5, gt=0)):
#     requests = db.get_paginated_requests(skip, limit)
#     total = db.get_total_requests_count()
#     return {"requests": requests, "total": total}

@router.get("/get/requests")
def get_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(5, gt=0),
    vehicleNo: Optional[str] = None,
    ownerName: Optional[str] = None,
    fromDate: Optional[str] = None,
    toDate: Optional[str] = None,
    preferredTime: Optional[str] = None
):
    """Endpoint for getting paginated and filtered requests"""
    return db.get_filtered_requests(
        skip=skip,
        limit=limit,
        vehicleNo=vehicleNo,
        ownerName=ownerName,
        fromDate=fromDate,
        toDate=toDate,
        preferredTime=preferredTime
    )

@router.get("/get/requests/stats")
def get_dashboard_stats():
    total = db.collection.count_documents({})
    pending = db.collection.count_documents({"status": "Pending"})
    completed = db.collection.count_documents({"status": "Completed"})
    return {
        "total": total,
        "pending": pending,
        "completed": completed
    }

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
    ok = db.delete_status(id)
    if ok == 0:
        raise HTTPException(404, "Request not found")
    return {"message": "Request deleted"}