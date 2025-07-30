import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceRequest } from '../models/service-request.model';

interface DashboardStats {
  total: number;
  pending: number;
  completed: number;
}

interface PaginatedRequestsResponse {
  requests: any[]; // or use a more specific type like ServiceRequest[]
  total: number;
}


@Injectable({ providedIn: 'root' })
export class RequestService {
  private readonly baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  // getAllRequests(): Observable<ServiceRequest[]> {
  //   return this.http.get<ServiceRequest[]>(`${this.baseUrl}/get/requests`);
  // }

  // getAllRequests(page: number = 0, pageSize: number = 5): Observable<{requests: ServiceRequest[], total: number}> {
  //   return this.http.get<{requests: ServiceRequest[], total: number}>(
  //     `${this.baseUrl}/get/requests?skip=${page * pageSize}&limit=${pageSize}`
  //   );
  // }

  getAllRequests(params?: any): Observable<PaginatedRequestsResponse> {
  let url = `${this.baseUrl}/get/requests`;
  
  // Add query parameters if they exist
  if (params) {
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    }
    url += `?${queryParams.toString()}`;
  }

  return this.http.get<PaginatedRequestsResponse>(url);
}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/get/requests/stats`);
  }

  approveRequest(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/update/requests/${id}/approve`,
      {}
    );
  }

  rejectRequest(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/update/requests/${id}/reject`,
      {}
    );
  }

  updateRequest(id: string,request: Partial<ServiceRequest>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/update/requests/${id}`,
      request
    );
  }

  addRequest(request: Partial<ServiceRequest>): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(
      `${this.baseUrl}/post/requests`,
      request
    );
  }

  deleteRequest(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/delete/requests/${id}`
    );
  }
}
