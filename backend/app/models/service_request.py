from datetime import datetime
from bson import ObjectId
from app.database import collection
from app.schemas.service_request import ServiceRequestSchema

def serialize(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    if not doc:
        return {}
    doc = dict(doc)                 # copy
    doc["id"] = str(doc.pop("_id"))
    return doc

def get_all_requests() -> list[dict]:
    cursor = collection.find()
    return [serialize(doc) for doc in cursor]

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
    print(f"Model dump for update: {doc}")
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