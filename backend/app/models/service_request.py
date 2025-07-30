from datetime import datetime
from bson import ObjectId
from app.database import collection
from app.schemas.service_request import ServiceRequestSchema
from typing import Optional, Dict, Any
from pytz import timezone

def serialize(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    if not doc:
        return {}
    doc = dict(doc)                 # copy
    doc["id"] = str(doc.pop("_id"))
    return doc


def build_query(
    vehicleNo: Optional[str] = None,
    ownerName: Optional[str] = None,
    preferredDate: Optional[str] = None,
    preferredTime: Optional[str] = None
) -> Dict[str, Any]:
    """Build MongoDB query dictionary based on filters"""
    query = {}
    
    if vehicleNo:
        query["vehicle_number"] = {"$regex": vehicleNo, "$options": "i"}
    if ownerName:
        query["name"] = {"$regex": ownerName, "$options": "i"}
    if preferredDate:
        query["requested_date"] = preferredDate
    if preferredTime:
        query["requested_time"] = preferredTime
        
    return query

def get_filtered_requests(
    skip: int = 0,
    limit: int = 5,
    vehicleNo: Optional[str] = None,
    ownerName: Optional[str] = None,
    preferredDate: Optional[str] = None,
    preferredTime: Optional[str] = None
) -> Dict[str, Any]:
    """Get paginated and filtered requests"""
    query = build_query(vehicleNo, ownerName, preferredDate, preferredTime)
    
    cursor = collection.find(query).skip(skip).limit(limit)
    total = collection.count_documents(query)
    
    return {
        "requests": [serialize(doc) for doc in cursor],
        "total": total
    }

def convert_to_utc(indian_time_str: str) -> datetime:
    """Convert Indian time string to UTC datetime"""
    try:
        # Parse Indian time string (e.g., "Wed Jul 16 2025 00:00:00 GMT+0530")
        dt = datetime.strptime(indian_time_str, '%a %b %d %Y %H:%M:%S GMT%z')
        # Convert to UTC and remove timezone info
        return dt.astimezone(timezone('UTC')).replace(tzinfo=None)
    except ValueError:
        raise ValueError("Invalid date format")


######################################################################

# new functions added for pagination requests
def get_paginated_requests(skip: int, limit: int) -> list[dict]:
    cursor = collection.find().skip(skip).limit(limit)
    return [serialize(doc) for doc in cursor]

def get_total_requests_count() -> int:
    return collection.count_documents({})

######################################################################
# def get_all_requests() -> list[dict]:
#     cursor = collection.find()
#     return [serialize(doc) for doc in cursor]

def create_request(payload: ServiceRequestSchema) -> str:
    doc = payload.model_dump()
    doc["created_at"] = datetime.utcnow()
    result = collection.insert_one(doc)
    return str(result.inserted_id)

def update_status(id: str, status: str) -> bool:
    res = collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": status}}
    )
    return res.modified_count == 1

def update_request(id: str, payload: ServiceRequestSchema) -> bool:
    doc = payload.model_dump()
    res = collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": doc}
    )
    return res.modified_count == 1

def get_dashboard_summary() -> dict:
    total     = collection.count_documents({})
    Pending   = collection.count_documents({"status": "Pending"})
    Completed  = collection.count_documents({"status": "Completed"})
    Rejected  = collection.count_documents({"status": "Rejected"})
    
    return {
        "total": total,
        "Pending": Pending,
        "Completed": Completed,
        "Rejected": Rejected
    }

def delete_status(id: str) -> int:
    res = collection.delete_one(
        {"_id": ObjectId(id)},
    )
    return res.deleted_count