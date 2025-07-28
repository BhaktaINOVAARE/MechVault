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

  updateRequest(
    id: string,
    request: Partial<ServiceRequest>
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/requests/${id}`,
      request
    );
  }

  addRequest(request: Partial<ServiceRequest>): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.baseUrl}/requests`, request);
  }

  deleteRequest(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/requests/${id}`
    );
  }
}
