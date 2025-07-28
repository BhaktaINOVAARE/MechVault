import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { RequestDetailsComponent } from '../request-details/request-details';
import { ServiceRequest } from '../models/service-request.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'vehicleNo',
    'ownerName',
    'preferredDate',
    'preferredTime',
    'status',
    'actions'
  ];
  dataSource = new MatTableDataSource<ServiceRequest>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Dashboard stats
  totalRequests = 0;
  pendingRequests = 0;
  completedRequests = 0;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // In a real app, you would get this data from a service
    this.loadSampleData();
    this.calculateStats();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadSampleData() {
    const sampleData: ServiceRequest[] = [
      // Sample data matching your dashboard.png
      { 
        id: '1',
        vehicleNo: 'MH12AB1234', 
        ownerName: 'Arjun Verma', 
        preferredDate: new Date('2024-07-26'), 
        preferredTime: '10:00 AM', 
        status: 'Pending',
        notes: 'Regular maintenance'
      },
      // Add all other sample records from your image
      // ...
    ];
    this.dataSource.data = sampleData;
  }

  calculateStats() {
    this.totalRequests = this.dataSource.data.length;
    this.pendingRequests = this.dataSource.data.filter(req => req.status === 'Pending').length;
    this.completedRequests = this.dataSource.data.filter(req => req.status === 'Completed').length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewRequestDetails(request: ServiceRequest) {
    this.dialog.open(RequestDetailsComponent, {
      width: '500px',
      data: { request }
    });
  }

  approveRequest(request: ServiceRequest) {
    request.status = 'Completed';
    this.calculateStats();
  }

  rejectRequest(request: ServiceRequest) {
    request.status = 'Rejected';
    this.calculateStats();
  }
}