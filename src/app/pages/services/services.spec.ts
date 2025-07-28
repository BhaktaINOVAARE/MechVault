import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RequestService } from '../../services/request.service';
import { of } from 'rxjs';

import { ServicesComponent } from './services';

describe('ServicesComponent', () => {
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;
  let requestServiceSpy: jasmine.SpyObj<RequestService>;

  beforeEach(async () => {
    requestServiceSpy = jasmine.createSpyObj('RequestService', ['requests$']);
    requestServiceSpy.requests$ = of([]);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        ServicesComponent
      ],
      providers: [
        { provide: RequestService, useValue: requestServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty data', () => {
    expect(component.dataSource.data.length).toBe(0);
  });
});
