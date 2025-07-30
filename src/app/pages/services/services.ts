import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ServiceRequest } from '../../models/service-request.model';
import { RequestService } from '../../services/request.service';
import { RequestFormComponent } from '../../request-form/request-form';
import { RequestDetailsComponent } from '../../request-details/request-details';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatDatepicker,MatDatepickerModule,MatDatepickerToggle,} from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

//newly added for sorting functionality
function compare(a: any, b: any, isAsc: boolean): number {
  const valA = a instanceof Date ? a.getTime() : a;
  const valB = b instanceof Date ? b.getTime() : b;
  return (valA < valB ? -1 : valA > valB ? 1 : 0) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepicker,
    MatDatepickerToggle,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './services.html',
  styleUrls: ['./services.css'],
})
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'vehicleNo',
    'ownerName',
    'preferredDate',
    'preferredTime',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<ServiceRequest>([]);
  private subscription: Subscription = new Subscription();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private requestService: RequestService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  //newly added properties ====================================
  totalRequests = 0;
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
    this.fetchRequests(0, this.paginator?.pageSize || 5);
  }

  // ngAfterViewInit(): void {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;

  //   this.dataSource.sortingDataAccessor = (
  //     item: ServiceRequest,
  //     property: string
  //   ): string | number => {
  //     // Explicitly handle each sortable property
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
  //       default:
  //         return '';
  //     }
  //   };
  // }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(() => {
      this.fetchRequests(this.paginator.pageIndex, this.paginator.pageSize,this.searchParams);
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

  //adding a new function here

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // fetchRequests(): void {
  //   this.requestService.getAllRequests().subscribe({
  //     next: (backendRequests) => {
  //       const transformedRequests = backendRequests.map((request: any) => ({
  //         id: request.id,
  //         vehicleNo: request.vehicle_number,
  //         ownerName: request.name,
  //         vehicleModel: request.model,
  //         preferredDate: request.requested_date,
  //         preferredTime: request.requested_time,
  //         status: request.status,
  //         notes: request.notes,
  //         created_at: request.created_at,
  //         contactNumber: request.contact_number,
  //         vehicleType: request.vehicle_type,
  //       }));

  //       console.log('Transformed requests:', transformedRequests);
  //       this.dataSource.data = transformedRequests;
  //     },
  //     error: (err) => {
  //       this.snackBar.open('Failed to load requests', 'Close', {
  //         duration: 3000,
  //       });
  //       console.error(err);
  //     },
  //   });
  // }
  fetchRequests(pageIndex: number, pageSize: number, searchParams?: any): void {
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

        console.log('Fetched requests:', this.currentPageData);
        console.log('Total requests:', response);
        this.dataSource.data = [...this.currentPageData];
        this.paginator.length = response.total;
        this.isLoading = false; // setting loading state to false
      },
      error: (err) => {
        this.snackBar.open('Failed to load requests', 'Close', {
          duration: 3000,
        });
        console.error(err);
        this.isLoading = false; // setting loading state to false even on error
      },
    });
  }

  //newly added method for advanced filtering search
  applyAdvancedSearch(): void {
    // Reset to first page when applying new search
    this.paginator.pageIndex = 0;
    this.fetchRequests(0, this.paginator.pageSize, this.searchParams);
  }

  //newly added method

  // Update quick filter to reset advanced search
  applyQuickFilter(event: Event): void {
    // Clear advanced search fields
    this.searchParams = {
      vehicleNo: '',
      ownerName: '',
      preferredDate: null,
      preferredTime: '',
    };

    // Apply quick filter
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Safe date formatter for display
  formatDateForDisplay(dateString: string | Date): string {
    if (!dateString) return '-';

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? String(dateString) // Return raw string if invalid
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

  openAddRequestDialog(): void {
    const dialogRef = this.dialog.open(RequestFormComponent, {
      width: '80%',
      maxHeight: '90vh',
      panelClass: 'scrollable-dialog',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //where ever fetchRequest() was called here in this code
        //  i passed the arguments this.paginator?.pageIndex || 0, this.paginator?.pageSize || 5
        this.fetchRequests(
          this.paginator?.pageIndex || 0,
          this.paginator?.pageSize || 5
        );
      }
    });
  }

  openEditRequestDialog(request: ServiceRequest): void {
    if (request.status === 'Completed' || request.status === 'Rejected') {
      this.snackBar.open(
        'You cannot edit the request after it has been processed by Admin.',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    const dialogRef = this.dialog.open(RequestFormComponent, {
      width: '80%',
      maxHeight: '90vh',
      panelClass: 'scrollable-dialog',
      data: { request },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchRequests(
          this.paginator?.pageIndex || 0,
          this.paginator?.pageSize || 5
        );
      }
    });
  }

  viewRequestDetails(request: ServiceRequest): void {
    this.dialog.open(RequestDetailsComponent, {
      width: '500px',
      data: { request },
    });
  }

  //the below code is not needed here i services.ts it will be used in dashboard.ts for
  //approving the requests
  approveRequest(id: string): void {
    const sub = this.requestService.approveRequest(id).subscribe({
      next: () => {
        this.snackBar.open('Request approved', 'Close', { duration: 2000 });
        this.fetchRequests(
          this.paginator?.pageIndex || 0,
          this.paginator?.pageSize || 5
        );
      },
      error: (error: Error) => {
        this.snackBar.open('Failed to approve request', 'Close', {
          duration: 3000,
        });
        console.error(error);
      },
    });
    this.subscription.add(sub);
  }

  rejectRequest(id: string): void {
    const sub = this.requestService.rejectRequest(id).subscribe({
      next: () => {
        this.snackBar.open('Request rejected', 'Close', { duration: 2000 });
        this.fetchRequests(
          this.paginator?.pageIndex || 0,
          this.paginator?.pageSize || 5
        );
      },
      error: (error: Error) => {
        this.snackBar.open('Failed to reject request', 'Close', {
          duration: 3000,
        });
        console.error(error);
      },
    });
    this.subscription.add(sub);
  }

  deleteRequest(id: string, request: ServiceRequest): void {
    if (request.status === 'Completed') {
      this.snackBar.open(
        'You cannot edit the request after it has been accepted by Admin.',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this request?',
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        const sub = this.requestService.deleteRequest(id).subscribe({
          next: () => {
            this.snackBar.open('Request deleted successfully', 'Close', {
              duration: 2000,
            });
            this.fetchRequests(
              this.paginator?.pageIndex || 0,
              this.paginator?.pageSize || 5
            );
          },
          error: (error) => {
            this.snackBar.open('Failed to delete request', 'Close', {
              duration: 3000,
            });
            console.error(error);
          },
        });
        this.subscription.add(sub);
      }
    });
  }
}
