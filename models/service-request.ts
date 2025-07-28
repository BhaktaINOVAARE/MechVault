export interface ServiceRequest {
  id: string;
  vehicleNo: string;
  vehicleType: string;
  vehicleModel: string;
  preferredDate: string;
  preferredTime: string;
  ownerName: string;
  contactNumber: string;
  notes: string;
  status: 'Pending' | 'Completed' | 'Rejected';
}