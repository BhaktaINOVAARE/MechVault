import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';


//newly added for sorting functionality
function compare(a: any, b: any, isAsc: boolean): number {
  const valA = a instanceof Date ? a.getTime() : a;
  const valB = b instanceof Date ? b.getTime() : b;
  return (valA < valB ? -1 : valA > valB ? 1 : 0) * (isAsc ? 1 : -1);
}

interface DashboardStats {
  total: number;
  pending: number;
  completed: number;
}

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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepicker,
    MatDatepickerToggle,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'vehicleNo',
    'ownerName',
    'preferredDate',
    'preferredTime',
    'status',
    'actions',
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

  //newly added variable ====================================
  currentPageData: ServiceRequest[] = [];
  isLoading = false;
  searchParams = {
    vehicleNo: '',
    ownerName: '',
    preferredDate: null as Date | null,
    preferredTime: '',
  };


  // ngOnInit(): void {
  //   this.fetchRequests();
  // }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.fetchRequests(0, this.paginator?.pageSize || 5);
    this.fetchDashboardStats();
  }

  // ngAfterViewInit(): void {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;

  //   this.dataSource.sortingDataAccessor = (item: ServiceRequest, property: string): string | number => {
  //     switch (property) {
  //       case 'preferredDate':
  //         return new Date(item.preferredDate).getTime();
  //       case 'vehicleNo':
  //         return item.vehicleNo;
  //       case 'ownerName':
  //         return item.ownerName;
  //       case 'preferredTime':
  //         return item.preferredTime;
  //       case 'status':
  //         return item.status;
  //       // case 'created_at':
  //       //   return item.created_at ?? '';
  //       default:
  //         return '';
  //     }
  //   };
  // }
  ngAfterViewInit(): void {
    // Set initial page load after view initialized
    this.fetchRequests(0, this.paginator?.pageSize || 5);

    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(() => {
      this.fetchRequests(this.paginator.pageIndex, this.paginator.pageSize, this.searchParams);
    });

    this.sort.sortChange.subscribe(() => {
      this.sortCurrentPageData();
    });
  }

  //newly added function for sorting
  sortCurrentPageData(): void {
    const data = this.currentPageData.slice();
    if (!this.sort.active || this.sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'vehicleNo':
          return compare(a.vehicleNo, b.vehicleNo, isAsc);
        case 'ownerName':
          return compare(a.ownerName, b.ownerName, isAsc);
        case 'preferredDate':
          return compare(
            new Date(a.preferredDate).getTime(),
            new Date(b.preferredDate).getTime(),
            isAsc
          );
        case 'preferredTime':
          return compare(a.preferredTime, b.preferredTime, isAsc);
        case 'status':
          return compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // fetchRequests(): void {
  //   this.subscription.add(
  //     this.requestService.getAllRequests().subscribe({
  //       next: (backendRequests) => {
  //         const transformedRequests = backendRequests.map((request: any) => ({
  //           id: request.id,
  //           vehicleNo: request.vehicle_number,
  //           ownerName: request.name,
  //           vehicleModel: request.model,
  //           preferredDate: request.requested_date,
  //           preferredTime: request.requested_time,
  //           status: request.status,
  //           notes: request.notes,
  //           created_at: request.created_at,
  //         }));

  //         this.dataSource.data = transformedRequests;
  //         this.calculateStats(transformedRequests);
  //       },
  //       error: (err) => {
  //         this.snackBar.open('Failed to load requests', 'Close', {
  //           duration: 3000,
  //         });
  //         console.error(err);
  //       },
  //     })
  //   );
  // }
  fetchRequests(pageIndex: number, pageSize: number,searchParams?:any): void {

    this.isLoading = true; // setting loading state to true

    // Prepare query parameters
    const params: any = {
      skip: pageIndex * pageSize,
      limit: pageSize,
    };

    // Add search parameters if they exist
    if (searchParams) {
      if (this.searchParams.vehicleNo)
        params.vehicleNo = this.searchParams.vehicleNo;
      if (this.searchParams.ownerName)
        params.ownerName = this.searchParams.ownerName;
      if (this.searchParams.preferredDate)
        params.preferredDate = this.searchParams.preferredDate;
      if (this.searchParams.preferredTime)
        params.preferredTime = this.searchParams.preferredTime;
    }
    
    this.subscription.add(
      this.requestService.getAllRequests(params).subscribe({
        next: (response) => {
          this.currentPageData = response.requests.map((request: any) => ({
            id: request.id,
            vehicleNo: request.vehicle_number,
            ownerName: request.name,
            vehicleModel: request.model,
            preferredDate: request.requested_date,
            preferredTime: request.requested_time,
            status: request.status,
            notes: request.notes,
            created_at: request.created_at,
            contactNumber: request.contact_number,
            vehicleType: request.vehicle_type,
          }));

          this.dataSource.data = [...this.currentPageData];
          this.paginator.length = response.total;
          this.isLoading = false; // setting loading state to false

          // Update stats based on current page if no dedicated stats endpoint
          if (!this.totalRequests) {
            this.calculateStats(this.currentPageData);
          }
        },
        error: (err) => {
          this.showError('Failed to load requests');
          console.error(err);
          this.isLoading = false; // setting loading state to false
        },
      })
    );
  }

  //newly added method for advanced filtering search
  applyAdvancedSearch(): void {
    // Reset to first page when applying new search
    this.paginator.pageIndex = 0;
    this.fetchRequests(0, this.paginator.pageSize, this.searchParams);
  }

  fetchDashboardStats(): void {
    this.subscription.add(
      this.requestService.getDashboardStats().subscribe({
        next: (stats: DashboardStats) => {
          this.totalRequests = stats.total;
          this.pendingRequests = stats.pending;
          this.completedRequests = stats.completed;
        },
        error: (err: Error) => {
          // Fallback to client-side calculation if API fails
          this.calculateStats(this.dataSource.data);
          console.error(err);
        }
      })
    );
  }

  calculateStats(requests: ServiceRequest[]): void {
    this.totalRequests = requests.length;
    this.pendingRequests = requests.filter(
      (req) => req.status === 'Pending'
    ).length;
    this.completedRequests = requests.filter(
      (req) => req.status === 'Completed'
    ).length;
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

    this.searchParams = {
      vehicleNo: '',
      ownerName: '',
      preferredDate: null,
      preferredTime: '',
    };
    
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
          this.refreshData();
        },
        error: (error) => {
          this.showError('Failed to approve request');
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
          this.refreshData();
        },
        error: (error) => {
          this.showError('Failed to reject request');
          console.error(error);
        },
      })
    );
  }

  private refreshData(): void {
    this.fetchRequests(
      this.paginator?.pageIndex || 0,
      this.paginator?.pageSize || 5
    );
    this.fetchDashboardStats();
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
