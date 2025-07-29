import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceRequest } from '../models/service-request.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
    // Import necessary Angular Material modules here
    // e.g., MatDialogModule, MatButtonModule, etc.
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule
  ],
  template: `
    <h2 mat-dialog-title>Service Details</h2>
    <mat-dialog-content class="request-details">
      <div *ngFor="let field of displayedFields" class="detail-row">
        <strong>{{ field.label }}:</strong>
        {{ getFieldValue(field.key) }}
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .detail-row {
      margin: 12px 2px;
      padding: 15px;
      background: #4e9bff54;
      border-radius: 25px;
    }
    .request-details {
      max-height: 500px;
      overflow-y: auto;
      padding: 30px;
    }
    
  `]
})
export class RequestDetailsComponent {
  // List of ALL fields you want to display
  displayedFields: Array<{key: keyof ServiceRequest, label: string}> = [
    { key: 'vehicleNo', label: 'Vehicle Number' },
    { key: 'vehicleType', label: 'Vehicle Type' },
    { key: 'vehicleModel', label: 'Vehicle Model' },
    { key: 'ownerName', label: 'Owner Name' },
    { key: 'contactNumber', label: 'Contact Number' },
    { key: 'preferredDate', label: 'Preferred Date' },
    { key: 'preferredTime', label: 'Preferred Time' },
    { key: 'status', label: 'Status' },
    { key: 'notes', label: 'Notes' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { request: ServiceRequest }) {}

  // Type-safe property accessor
  getFieldValue(key: keyof ServiceRequest): string {
    const value = this.data.request[key];
    
    if (value === undefined || value === null) return 'Not specified';
    
    // Special formatting for dates
    if (key === 'preferredDate' && typeof value === 'string') {
      return new Date(value).toLocaleDateString();
    }
    
    return String(value);
  }
}