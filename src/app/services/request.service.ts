// // import { Injectable } from '@angular/core';
// // import { BehaviorSubject } from 'rxjs';
// // import { ServiceRequest } from '../models/service-request.model';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class RequestService {
// //   private requestsSubject = new BehaviorSubject<ServiceRequest[]>(this.getStoredRequests());
// //   private readonly STORAGE_KEY = 'mechvault_requests';
// //   requests$ = this.requestsSubject.asObservable();

// //   constructor() {}

// //   private getStoredRequests(): ServiceRequest[] {
// //     const stored = localStorage.getItem(this.STORAGE_KEY);
// //     return stored ? JSON.parse(stored) : [];
// //   }

// //   private saveRequests(requests: ServiceRequest[]): void {
// //     localStorage.setItem(this.STORAGE_KEY, JSON.stringify(requests));
// //     this.requestsSubject.next(requests);
// //   }

// //   addRequest(request: ServiceRequest): void {
// //     const requests = [...this.requestsSubject.value, request];
// //     this.saveRequests(requests);
// //   }

// //   updateRequest(updatedRequest: ServiceRequest): void {
// //     const requests = this.requestsSubject.value.map(req =>
// //       req.id === updatedRequest.id ? updatedRequest : req
// //     );
// //     this.saveRequests(requests);
// //   }

// //   deleteRequest(id: string): void {
// //     const requests = this.requestsSubject.value.filter(req => req.id !== id);
// //     this.saveRequests(requests);
// //   }

// //   initializeSampleData(): void {
// //     const sampleRequests: ServiceRequest[] = [
// //       {
// //         id: '1',
// //         vehicleNo: 'MH12AB1234',
// //         vehicleType: 'Car',
// //         vehicleModel: 'Toyota Camry',
// //         ownerName: 'John Doe',
// //         preferredDate: new Date('2024-07-20'),
// //         preferredTime: '10:00 AM',
// //         contactNumber: '9876543210',
// //         status: 'Pending',
// //         notes: 'Regular maintenance'
// //       },
// //       {
// //         id: '2',
// //         vehicleNo: 'DL01CD5678',
// //         vehicleType: 'SUV',
// //         vehicleModel: 'Hyundai Creta',
// //         ownerName: 'Jane Smith',
// //         preferredDate: new Date('2024-07-21'),
// //         preferredTime: '02:30 PM',
// //         contactNumber: '8765432109',
// //         status: 'In Progress',
// //         notes: 'AC repair needed'
// //       },
// //       {
// //         id: '3',
// //         vehicleNo: 'KA03EF9012',
// //         vehicleType: 'Truck',
// //         vehicleModel: 'Ford F-150',
// //         ownerName: 'Alice Johnson',
// //         preferredDate: new Date('2024-07-22'),
// //         preferredTime: '11:15 AM',
// //         contactNumber: '7654321098',
// //         status: 'Completed',
// //         notes: 'Oil change and tire rotation'
// //       },
// //       {
// //         id: '4',
// //         vehicleNo: 'TN04GH3456',
// //         vehicleType: 'Motorcycle',
// //         vehicleModel: 'Kawasaki Ninja',
// //         ownerName: 'Bob Brown',
// //         preferredDate: new Date('2024-07-23'),
// //         preferredTime: '03:45 PM',
// //         contactNumber: '6543210987',
// //         status: 'Rejected',
// //         notes: 'Customer cancelled the appointment'
// //       },
// //       {
// //         id: '5',
// //         vehicleNo: 'UP05IJ7890',
// //         vehicleType: 'Car',
// //         vehicleModel: 'Honda Accord',
// //         ownerName: 'Charlie Davis',
// //         preferredDate: new Date('2024-07-24'),
// //         preferredTime: '09:00 AM',
// //         contactNumber: '5432109876',
// //         status: 'Pending',
// //         notes: 'Check engine light on'
// //       },
// //       {
// //         id: '6',
// //         vehicleNo: 'MH06KL1234',
// //         vehicleType: 'Van',
// //         vehicleModel: 'Mercedes Sprinter',
// //         ownerName: 'Eve White',
// //         preferredDate: new Date('2024-07-25'),
// //         preferredTime: '01:00 PM',
// //         contactNumber: '4321098765',
// //         status: 'In Progress',
// //         notes: 'Brake inspection'
// //       },
// //       {
// //         id: '7',
// //         vehicleNo: 'DL07MN5678',
// //         vehicleType: 'Bus',
// //         vehicleModel: 'Volvo 9700',
// //         ownerName: 'Frank Green',
// //         preferredDate: new Date('2024-07-26'),
// //         preferredTime: '04:30 PM',
// //         contactNumber: '3210987654',
// //         status: 'Completed',
// //         notes: 'Routine check-up'
// //       },
// //       {
// //         id: '8',
// //         vehicleNo: 'KA08OP9012',
// //         vehicleType: 'Car',
// //         vehicleModel: 'BMW 3 Series',
// //         ownerName: 'Grace Black',
// //         preferredDate: new Date('2024-07-27'),
// //         preferredTime: '12:00 PM',
// //         contactNumber: '2109876543',
// //         status: 'Pending',
// //         notes: 'Tire replacement'
// //       },
// //       {
// //         id: '9',
// //         vehicleNo: 'TN09QR3456',
// //         vehicleType: 'Motorcycle',
// //         vehicleModel: 'Ducati Panigale',
// //         ownerName: 'Hank Blue',
// //         preferredDate: new Date('2024-07-28'),
// //         preferredTime: '08:30 AM',
// //         contactNumber: '1098765432',
// //         status: 'Rejected',
// //         notes: 'Customer rescheduled'
// //       },
// //       {
// //         id: '10',
// //         vehicleNo: 'UP10ST7890',
// //         vehicleType: 'Truck',
// //         vehicleModel: 'Chevrolet Silverado',
// //         ownerName: 'Ivy Yellow',
// //         preferredDate: new Date('2024-07-29'),
// //         preferredTime: '05:00 PM',
// //         contactNumber: '0987654321',
// //         status: 'In Progress',
// //         notes: 'Transmission service'
// //       },
// //       {
// //         id: '11',
// //         vehicleNo: 'MH11UV1234',
// //         vehicleType: 'Car',
// //         vehicleModel: 'Audi A4',
// //         ownerName: 'Jack Red',
// //         preferredDate: new Date('2024-07-30'),
// //         preferredTime: '10:30 AM',
// //         contactNumber: '9876543210',
// //         status: 'Pending',
// //         notes: 'Battery replacement'
// //       },
// //       {
// //         id: '12',
// //         vehicleNo: 'DL12WX5678',
// //         vehicleType: 'SUV',
// //         vehicleModel: 'Nissan X-Trail',
// //         ownerName: 'Kathy Pink',
// //         preferredDate: new Date('2024-07-31'),
// //         preferredTime: '03:15 PM',
// //         contactNumber: '8765432109',
// //         status: 'Completed',
// //         notes: 'Suspension check'
// //       },
// //       {
// //         id: '13',
// //         vehicleNo: 'KA13YZ9012',
// //         vehicleType: 'Van',
// //         vehicleModel: 'Volkswagen Transporter',
// //         ownerName: 'Leo Orange',
// //         preferredDate: new Date('2024-08-01'),
// //         preferredTime: '11:45 AM',
// //         contactNumber: '7654321098',
// //         status: 'In Progress',
// //         notes: 'Fuel system cleaning'
// //       },
// //       {
// //         id: '14',
// //         vehicleNo: 'TN14AB3456',
// //         vehicleType: 'Bus',
// //         vehicleModel: 'Mercedes-Benz Citaro',
// //         ownerName: 'Mia Purple',
// //         preferredDate: new Date('2024-08-02'),
// //         preferredTime: '02:00 PM',
// //         contactNumber: '6543210987',
// //         status: 'Rejected',
// //         notes: 'Customer changed plans'
// //       },
// //       {
// //         id: '15',
// //         vehicleNo: 'UP15CD7890',
// //         vehicleType: 'Motorcycle',
// //         vehicleModel: 'Yamaha YZF-R1',
// //         ownerName: 'Nina Grey',
// //         preferredDate: new Date('2024-08-03'),
// //         preferredTime: '09:00 AM',
// //         contactNumber: '5432109876',
// //         status: 'In Progress',
// //         notes: 'Oil change'
// //       },
// //       {
// //         id: '16',
// //         vehicleNo: 'MH16EF1234',
// //         vehicleType: 'Car',
// //         vehicleModel: 'Ford Focus',
// //         ownerName: 'Oscar Brown',
// //         preferredDate: new Date('2024-08-04'),
// //         preferredTime: '01:30 PM',
// //         contactNumber: '4321098765',
// //         status: 'Pending',
// //         notes: 'Brake pad replacement'
// //       },
// //       {
// //         id: '17',
// //         vehicleNo: 'DL17GH5678',
// //         vehicleType: 'SUV',
// //         vehicleModel: 'Kia Sportage',
// //         ownerName: 'Paul White',
// //         preferredDate: new Date('2024-08-05'),
// //         preferredTime: '04:15 PM',
// //         contactNumber: '3210987654',
// //         status: 'Completed',
// //         notes: 'Tire alignment'
// //       },
// //       {
// //         id: '18',
// //         vehicleNo: 'KA18IJ9012',
// //         vehicleType: 'Truck',
// //         vehicleModel: 'Ram 1500',
// //         ownerName: 'Quinn Green',
// //         preferredDate: new Date('2024-08-06'),
// //         preferredTime: '12:45 PM',
// //         contactNumber: '2109876543',
// //         status: 'In Progress',
// //         notes: 'Engine diagnostics'
// //       },
// //       {
// //         id: '19',
// //         vehicleNo: 'TN19KL3456',
// //         vehicleType: 'Van',
// //         vehicleModel: 'Toyota HiAce',
// //         ownerName: 'Rita Black',
// //         preferredDate: new Date('2024-08-07'),
// //         preferredTime: '03:30 PM',
// //         contactNumber: '1098765432',
// //         status: 'Pending',
// //         notes: 'Transmission fluid change'
// //       },
// //       {
// //         id: '20',
// //         vehicleNo: 'UP20MN7890',
// //         vehicleType: 'Bus',
// //         vehicleModel: 'Scania Citywide',
// //         ownerName: 'Sam Blue',
// //         preferredDate: new Date('2024-08-08'),
// //         preferredTime: '10:00 AM',
// //         contactNumber: '0987654321',
// //         status: 'Rejected',
// //         notes: ''
// //       }

// //     ];
// //     this.saveRequests(sampleRequests);
// //   }
// // }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject } from 'rxjs';
// import { ServiceRequest } from '../models/service-request.model';

// @Injectable({ providedIn: 'root' })
// export class RequestService {
//   private baseUrl = 'http://localhost:8000/requests'; // Adjust if needed
//   private _requests = new BehaviorSubject<ServiceRequest[]>([]);
//   public requests$ = this._requests.asObservable();

//   constructor(private http: HttpClient) {
//     this.loadRequests();
//   }

//   loadRequests() {
//     this.http.get<ServiceRequest[]>(this.baseUrl).subscribe((requests) => {
//       this._requests.next(requests);
//     });
//   }

//   addRequest(request: ServiceRequest) {
//     return this.http.post<ServiceRequest>(this.baseUrl, request).subscribe(() => this.loadRequests());
//   }

//   updateRequest(id: string, updated: Partial<ServiceRequest>) {
//     return this.http.put(`${this.baseUrl}/${id}`, updated).subscribe(() => this.loadRequests());
//   }

//   getRequestById(id: string) {
//     return this.http.get<ServiceRequest>(`${this.baseUrl}/${id}`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceRequest } from '../models/service-request.model';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getAllRequests(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(`${this.baseUrl}/requests`);
  }

  

  approveRequest(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/requests/${id}/approve`,
      {}
    );
  }

  rejectRequest(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/requests/${id}/reject`,
      {}
    );
  }

  updateRequest(id: string, request: Partial<ServiceRequest>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/requests/${id}`, request);
  }

  addRequest(request: Partial<ServiceRequest>): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.baseUrl}/requests`, request);
  }
}
