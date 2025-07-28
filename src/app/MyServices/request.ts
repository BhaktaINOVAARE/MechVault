import { Injectable } from '@angular/core';
import { ServiceRequest } from '../../../models/service-request';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Request {
  private requests = new BehaviorSubject<ServiceRequest[]>([]);
  requests$ = this.requests.asObservable();

  constructor() {}

  addRequest(request: ServiceRequest) {
    const current = this.requests.value;
    this.requests.next([...current, request]);
  }

  updateRequest(updatedRequest: ServiceRequest) {
    const current = this.requests.value;
    const index = current.findIndex(r => r.id === updatedRequest.id);
    if (index !== -1) {
      current[index] = updatedRequest;
      this.requests.next([...current]);
    }
  }

  deleteRequest(id: string) {
    const current = this.requests.value.filter(r => r.id !== id);
    this.requests.next(current);
  }
}