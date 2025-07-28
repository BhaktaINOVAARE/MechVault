import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestDetailsComponent } from '../request-details/request-details';
import { ServiceRequest } from '../models/service-request.model';
import { RequestService } from '../services/request.service';
import { Subscription } from 'rxjs';

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
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'vehicleNo',
    'ownerName',
    'preferredDate',
    'preferredTime',
    'status',
    'actions'
  ];
  dataSource = new MatTableDataSource<ServiceRequest>();
  private subscription: Subscription = new Subscription();

  // Dashboard stats
  totalRequests = 0;
  pendingRequests = 0;
  completedRequests = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private requestService: RequestService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.sortingDataAccessor = (item: ServiceRequest, property: string): string | number => {
      switch (property) {
        case 'preferredDate':
          return new Date(item.preferredDate).getTime();
        case 'vehicleNo':
          return item.vehicleNo;
        case 'ownerName':
          return item.ownerName;
        case 'preferredTime':
          return item.preferredTime;
        case 'status':
          return item.status;
        // case 'created_at':
        //   return item.created_at ?? '';
        default:
          return '';
      }
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchRequests(): void {
    this.subscription.add(
      this.requestService.getAllRequests().subscribe({
        next: (backendRequests) => {
          const transformedRequests = backendRequests.map((request: any) => ({
            id: request.id,
            vehicleNo: request.vehicle_number,
            ownerName: request.name,
            vehicleModel: request.model,
            preferredDate: request.requested_date,
            preferredTime: request.requested_time,
            status: request.status,
            notes: request.notes,
            created_at: request.created_at,
          }));

          this.dataSource.data = transformedRequests;
          this.calculateStats(transformedRequests);
        },
        error: (err) => {
          this.snackBar.open('Failed to load requests', 'Close', {
            duration: 3000,
          });
          console.error(err);
        },
      })
    );
  }

  calculateStats(requests: ServiceRequest[]): void {
    this.totalRequests = requests.length;
    this.pendingRequests = requests.filter(req => req.status === 'Pending').length;
    this.completedRequests = requests.filter(req => req.status === 'Completed').length;
  }

  formatDateForDisplay(dateString: string | Date): string {
    if (!dateString) return '-';

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? String(dateString)
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
    } catch {
      return String(dateString);
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewRequestDetails(request: ServiceRequest): void {
    console.log('Viewing request details:', request);
    this.dialog.open(RequestDetailsComponent, {
      width: '500px',
      data: { request },
    });
  }

  approveRequest(id: string): void {
    this.subscription.add(
      this.requestService.approveRequest(id).subscribe({
        next: () => {
          this.snackBar.open('Request approved', 'Close', { duration: 2000 });
          this.fetchRequests();
        },
        error: (error: Error) => {
          this.snackBar.open('Failed to approve request', 'Close', {
            duration: 3000,
          });
          console.error(error);
        },
      })
    );
  }

  rejectRequest(id: string): void {
    this.subscription.add(
      this.requestService.rejectRequest(id).subscribe({
        next: () => {
          this.snackBar.open('Request rejected', 'Close', { duration: 2000 });
          this.fetchRequests();
        },
        error: (error: Error) => {
          this.snackBar.open('Failed to reject request', 'Close', {
            duration: 3000,
          });
          console.error(error);
        },
      })
    );
  }
}