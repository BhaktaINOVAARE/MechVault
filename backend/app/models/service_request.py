from datetime import datetime,timedelta
from bson import ObjectId
from app.database import collection
from app.schemas.service_request import ServiceRequestSchema
from typing import Optional, Dict, Any
from pytz import timezone
from pymongo import ASCENDING, DESCENDING

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
    fromDate: Optional[str] = None,
    toDate: Optional[str] = None,
    preferredTime: Optional[str] = None
) -> Dict[str, Any]:
    """Build MongoDB query dictionary based on filters (string-safe date matching)."""
    query = {}

    # Vehicle Number filter
    if vehicleNo:
        query["vehicle_number"] = {"$regex": vehicleNo, "$options": "i"}

    # Owner Name filter
    if ownerName:
        query["name"] = {"$regex": ownerName, "$options": "i"}

    # Date Range filter (string-safe for ISO 8601)
    if fromDate or toDate:
        date_query = {}

        if fromDate:
            if "T" not in fromDate:
                fromDate = f"{fromDate}T00:00:00.000Z"
            date_query["$gte"] = fromDate

        if toDate:
            if "T" not in toDate:
                toDate = f"{toDate}T23:59:59.999Z"
            date_query["$lte"] = toDate

        if date_query:
            query["requested_date"] = date_query

    # Preferred Time filter
    if preferredTime:
        query["requested_time"] = preferredTime

    print(f"✅ Final query sent to Mongo: {query}")  # Debug
    return query


def get_filtered_requests(
    skip: int = 0,
    limit: int = 5,
    vehicleNo: Optional[str] = None,
    ownerName: Optional[str] = None,
    fromDate: Optional[str] = None,
    toDate: Optional[str] = None,
    preferredTime: Optional[str] = None,
    sortField: Optional[str] = None,
    sortOrder: Optional[str] = None
) -> Dict[str, Any]:
    """Get paginated and filtered requests with fromDate/toDate support."""
    
    query = build_query(vehicleNo, ownerName, fromDate, toDate, preferredTime)

    sort_list = [("_id", DESCENDING)]

    if sortField:
        mongo_field_map = {
            "vehicleNo": "vehicle_number",
            "ownerName": "name",
            "preferredDate": "requested_date",
            "preferredTime": "requested_time",
            "status": "status",
        }
        field = mongo_field_map.get(sortField, "_id")  # fallback to _id
        order = ASCENDING if sortOrder == "asc" else DESCENDING
        sort_list = [(field, order)]


    # 🔍 Debug: Check what we're actually querying
    print(f"📌 Mongo Query: {query}")

    cursor = collection.find(query).sort(sort_list).skip(skip).limit(limit)
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