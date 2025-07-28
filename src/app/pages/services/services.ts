// // import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// // import { RequestService } from '../../services/request.service';
// // import { ServiceRequest } from '../../models/service-request.model';
// // import { RequestForm } from '../../request-form/request-form';
// // import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// // import { MatSort, MatSortModule } from '@angular/material/sort';
// // import { MatInputModule } from '@angular/material/input';
// // import { MatFormFieldModule } from '@angular/material/form-field';
// // import { MatButtonModule } from '@angular/material/button';
// // import { MatIconModule } from '@angular/material/icon';
// // import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// // import { RequestDetailsComponent } from '../../request-details/request-details';

// // @Component({
// //   selector: 'app-services',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     MatDialogModule,
// //     MatTableModule,
// //     MatSortModule,
// //     MatInputModule,
// //     MatFormFieldModule,
// //     MatButtonModule,
// //     MatIconModule,
// //     MatPaginatorModule
// //   ],
// //   templateUrl: './services.html',
// //   styleUrl: './services.css'
// // })
// // export class ServicesComponent implements OnInit {
// //   displayedColumns: string[] = [
// //     'vehicleNo',
// //     'ownerName',
// //     'preferredDate',
// //     'preferredTime',
// //     'status',
// //     'actions'
// //   ];
// //   dataSource = new MatTableDataSource<ServiceRequest>([]);
// //   @ViewChild(MatSort) sort!: MatSort;
// //   @ViewChild(MatPaginator) paginator!: MatPaginator;

// //   constructor(
// //     private dialog: MatDialog,
// //     private requestService: RequestService
// //   ) {}

// //   private subscription: any;

// //   ngOnInit() {
// //     this.subscription = this.requestService.requests$.subscribe((requests: ServiceRequest[]) => {
// //       this.dataSource.data = requests;
// //     });

// //     this.requestService.initializeSampleData();
// //   }

// //   ngOnDestroy() {
// //     if (this.subscription) {
// //       this.subscription.unsubscribe();
// //     }
// //   }

// //   ngAfterViewInit() {
// //     this.dataSource.sort = this.sort;
// //     this.dataSource.paginator = this.paginator;
// //   }

// //   // New view method
// //   viewRequestDetails(request: ServiceRequest) {
// //     this.dialog.open(RequestDetailsComponent, {
// //       width: '500px',
// //       data: { request }
// //     });
// //   }

// //   openAddRequestDialog() {
// //     const dialogRef = this.dialog.open(RequestForm, {
// //       width: '80%',
// //       maxHeight: '90vh',
// //       panelClass: 'scrollable-dialog'
// //     });

// //     dialogRef.afterClosed().subscribe(result => {
// //       if (result) {
// //         this.requestService.requests$.subscribe(() => {});
// //       }
// //     });
// //   }

// //   openEditRequestDialog(request: ServiceRequest) {
// //     const dialogRef = this.dialog.open(RequestForm, {
// //       width: '80%',
// //       maxHeight: '90vh',
// //       panelClass: 'scrollable-dialog',
// //       data: { request }
// //     });

// //     dialogRef.afterClosed().subscribe(result => {
// //       if (result) {
// //         this.requestService.requests$.subscribe(() => {});
// //       }
// //     });
// //   }

// //   applyFilter(event: Event) {
// //     const filterValue = (event.target as HTMLInputElement).value;
// //     this.dataSource.filter = filterValue.trim().toLowerCase();
// //   }
// // }

// import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatSort } from '@angular/material/sort';
// import { MatPaginator } from '@angular/material/paginator';
// import { RequestService } from '../../services/request.service';
// import { ServiceRequest } from '../../models/service-request.model';
// import { RequestForm } from '../../request-form/request-form';
// import { RequestDetailsComponent } from '../../request-details/request-details';

// @Component({
//   selector: 'app-services',
//   templateUrl: './services.html',
//   styleUrls: ['./services.css'],
//   standalone: true,
//   imports: [/* Angular Material modules */],
// })
// export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
//   displayedColumns: string[] = [
//     'vehicleNo',
//     'ownerName',
//     'preferredDate',
//     'preferredTime',
//     'status',
//     'actions'
//   ];
//   dataSource = new MatTableDataSource<ServiceRequest>([]);
//   private subscription: any;

//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild(MatPaginator) paginator!: MatPaginator;

//   constructor(private requestService: RequestService, private dialog: MatDialog) {}

//   ngOnInit() {
//     this.subscription = this.requestService.requests$.subscribe(requests => {
//       this.dataSource.data = requests;
//     });
//   }

//   ngAfterViewInit() {
//     this.dataSource.sort = this.sort;
//     this.dataSource.paginator = this.paginator;
//   }

//   ngOnDestroy() {
//     if (this.subscription) this.subscription.unsubscribe();
//   }

//   applyFilter(event: Event) {
//     const value = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = value.trim().toLowerCase();
//   }

//   openAddRequestDialog() {
//     const dialogRef = this.dialog.open(RequestForm, {
//       width: '80%',
//       data: null
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) this.requestService.loadRequests();
//     });
//   }

//   openEditRequestDialog(request: ServiceRequest) {
//     const dialogRef = this.dialog.open(RequestForm, {
//       width: '80%',
//       data: request
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) this.requestService.loadRequests();
//     });
//   }

//   viewRequestDetails(request: ServiceRequest) {
//     this.dialog.open(RequestDetailsComponent, {
//       width: '500px',
//       data: { request }
//     });
//   }
// }

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

  ngOnInit(): void {
    this.fetchRequests();
  }

  ngAfterViewInit(): void {
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;

  this.dataSource.sortingDataAccessor = (item: ServiceRequest, property: string): string | number => {
    // Explicitly handle each sortable property
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
      case 'created_at':
        return item.created_at ?? ''; // Handle optional field
      default:
        return '';
    }
  };
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchRequests(): void {
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
          contactNumber: request.contact_number,
          vehicleType: request.vehicle_type,
        }));

        console.log('Transformed requests:', transformedRequests);
        this.dataSource.data = transformedRequests;
      },
      error: (err) => {
        this.snackBar.open('Failed to load requests', 'Close', {
          duration: 3000,
        });
        console.error(err);
      },
    });
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
        this.fetchRequests();
      }
    });
  }

  openEditRequestDialog(request: ServiceRequest): void {
    const dialogRef = this.dialog.open(RequestFormComponent, {
      width: '80%',
      maxHeight: '90vh',
      panelClass: 'scrollable-dialog',
      data: { request },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchRequests();
      }
    });
  }

  viewRequestDetails(request: ServiceRequest): void {
    this.dialog.open(RequestDetailsComponent, {
      width: '500px',
      data: { request },
    });
  }

  approveRequest(id: string): void {
    const sub = this.requestService.approveRequest(id).subscribe({
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
    });
    this.subscription.add(sub);
  }

  rejectRequest(id: string): void {
    const sub = this.requestService.rejectRequest(id).subscribe({
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
    });
    this.subscription.add(sub);
  }
}
