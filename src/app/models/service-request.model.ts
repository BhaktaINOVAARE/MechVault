export interface ServiceRequest {
  id: string;
  vehicleNo: string;
  vehicleType?: string;
  vehicleModel?: string;
  ownerName: string;
  preferredDate: Date | string;
  preferredTime: string;
  contactNumber?: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  notes?: string;
  // created_at?: number | string;
}
export type ServiceRequestUpdate = Omit<ServiceRequest, 'id'>;   //added this one

// export interface ServiceRequest {
//   id: string;
//   vehicleNo: string;
//   vehicleType: string;
//   vehicleModel: string;
//   ownerName: string;
//   preferredDate: Date | string;
//   preferredTime: string;
//   contactNumber: string;
//   status: 'Pending' | 'Completed' | 'Rejected';
//   notes?: string;
//   created_at?: number | string;
// }