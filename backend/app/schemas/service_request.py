# from pydantic import BaseModel, Field
# from typing import Optional
# from datetime import datetime

# class ServiceRequestSchema(BaseModel):
#     name: str
#     vehicle_number: str
#     model: str
#     requested_date: str
#     requested_time: str
#     notes: Optional[str] = ""
#     status: Optional[str] = Field(default="Pending", pattern=r"^(Pending|Completed|Rejected)$")
#     created_at: Optional[datetime] = None


from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ServiceRequestSchema(BaseModel):
    name: str = Field(..., alias="ownerName")  # Maps ownerName (frontend) to name (backend)
    vehicle_number: str = Field(..., alias="vehicleNo")  # Maps vehicleNo to vehicle_number
    vehicle_type: str = Field(..., alias="vehicleType")  # Maps vehicleType to vehicle_type
    contact_number: str = Field(..., alias="contactNumber")  # Maps contactNumber to contact_number
    model: str = Field(..., alias="vehicleModel")  # Maps vehicleModel to model
    requested_date: str = Field(..., alias="preferredDate")  # Maps preferredDate to requested_date
    requested_time: str = Field(..., alias="preferredTime")  # Maps preferredTime to requested_time
    notes: Optional[str] = ""
    status: Optional[str] = Field(
        default="Pending", 
        pattern=r"^(Pending|Completed|Rejected)$",
        alias="status"  # This stays the same
    )
    # created_at: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True  # Allows creation using both field names and aliases