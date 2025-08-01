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
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

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
    MatNativeDateModule,
    NgChartsModule,
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
    fromDate: null as Date | null,
    toDate: null as Date | null,
    preferredTime: '',
  };
  lastUsedFilters: any = {};

  //this is for charts
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [], // Will be populated dynamically
    datasets: [
      {
        label: 'Total Requests',
        data: [],
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Pending Requests',
        data: [],
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Completed Requests',
        data: [],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: {
        title: { display: true, text: 'Number of Requests' },
        beginAtZero: true,
      },
    },
  };

  // ngOnInit(): void {
  //   this.fetchRequests();
  // }
  ngOnInit(): void {
    this.lastUsedFilters = {}; //default empty
    this.dataSource.paginator = this.paginator;
    this.fetchRequests(0, this.paginator?.pageSize || 5);
    this.fetchDashboardStats();
    this.fetchAllRequestsForChart();
  }

  ngAfterViewInit(): void {
    // Set initial page load after view initialized
    this.fetchRequests(0, this.paginator?.pageSize || 5);

    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(() => {
      this.fetchRequests(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.lastUsedFilters
      );
    });

    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0; // reset to first page
      this.fetchRequests(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.lastUsedFilters
      );
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

  fetchRequests(pageIndex: number, pageSize: number, searchParams?: any): void {
    this.isLoading = true; // setting loading state to true

    // Prepare query parameters
    const params: any = {
      skip: pageIndex * pageSize,
      limit: pageSize,
    };

    // Add search parameters if they exist
    if (searchParams) {
      if (searchParams.vehicleNo) params.vehicleNo = searchParams.vehicleNo;
      if (searchParams.ownerName) params.ownerName = searchParams.ownerName;
      if (searchParams.fromDate && searchParams.toDate) {
        params.fromDate = searchParams.fromDate;
        params.toDate = searchParams.toDate;
      } else if (searchParams.fromDate) {
        params.fromDate = searchParams.fromDate;
      } else if (searchParams.toDate) {
        params.toDate = searchParams.toDate;
      }
      if (searchParams.preferredTime)
        params.preferredTime = searchParams.preferredTime;
    }

    if (this.sort?.active) {
      params.sortField = this.sort.active;
      params.sortOrder = this.sort.direction || 'asc';
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
          this.updateChartData(this.currentPageData);
          this.paginator.length = response.total;
          this.isLoading = false; // setting loading state to false

          // Update stats based on current page if no dedicated stats endpoint
          if (!this.totalRequests) {
            this.calculateStats(this.currentPageData);
          }
        },
        error: (err) => {
          this.snackBar.open('Failed to load requests', 'Close', {
            duration: 3000,
          });
          console.error(err);
          this.isLoading = false; // setting loading state to false
        },
      })
    );
  }

  //newly added method for advanced filtering search
  applyAdvancedSearch(): void {
    if (!this.validateDateRange()) {
      this.snackBar.open('Error: End date must be after start date', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    // Reset to first page when applying new search
    this.paginator.pageIndex = 0;

    // Create API params with properly formatted date
    this.lastUsedFilters = {
      vehicleNo: this.searchParams.vehicleNo,
      ownerName: this.searchParams.ownerName,
      fromDate: this.formatDateForAPI(this.searchParams.fromDate),
      toDate: this.formatDateForAPI(this.searchParams.toDate),
      preferredTime: this.searchParams.preferredTime,
    };

    this.fetchRequests(0, this.paginator.pageSize, this.lastUsedFilters);
  }

  private formatDateForAPI(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // stays in IST
  }

  validateDateRange(): boolean {
    if (this.searchParams.fromDate && this.searchParams.toDate) {
      return this.searchParams.fromDate <= this.searchParams.toDate;
    }
    return true;
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
        },
      })
    );
  }

  fetchAllRequestsForChart(): void {
    this.requestService.getAllRequests({ skip: 0, limit: 1000 }).subscribe({
      next: (response) => {
        const allRequests: ServiceRequest[] = response.requests.map(
          (request: any) => ({
            id: request.id || '',
            vehicleNo: request.vehicle_number || '',
            ownerName: request.name || '',
            vehicleModel: request.model || '',
            preferredDate: request.requested_date,
            preferredTime: request.requested_time || '',
            status: request.status,
            notes: request.notes || '',
            created_at: request.created_at || '',
            contactNumber: request.contact_number || '',
            vehicleType: request.vehicle_type || '',
          })
        );
        this.updateChartData(allRequests); // ✅ Now matches type
      },
      error: (err) => console.error('Failed to load chart data', err),
    });
  }

  updateChartData(requests: ServiceRequest[]) {
  const groupedByDate: Record<
    string,
    { total: number; pending: number; completed: number }
  > = {};

  requests.forEach((req) => {
    const date = new Date(req.preferredDate).toLocaleDateString('en-US');
    if (!groupedByDate[date]) {
      groupedByDate[date] = { total: 0, pending: 0, completed: 0 };
    }
    groupedByDate[date].total++;
    if (req.status === 'Pending') groupedByDate[date].pending++;
    if (req.status === 'Completed') groupedByDate[date].completed++;
  });

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // ✅ Create new data object so Angular detects changes
  this.lineChartData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Total Requests',
        data: sortedDates.map((date) => groupedByDate[date].total),
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Pending Requests',
        data: sortedDates.map((date) => groupedByDate[date].pending),
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Completed Requests',
        data: sortedDates.map((date) => groupedByDate[date].completed),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };
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
      fromDate: null,
      toDate: null,
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
