import {
  Component,
  Inject,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { RequestService } from '../services/request.service';
import { ServiceRequest } from '../models/service-request.model';
import { MatOptionModule } from '@angular/material/core';
import { MatError } from '@angular/material/form-field';
import formConfig from '../../assets/form-config.json';

interface FormField {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validations?: {
    type: string;
    value: string;
    message: string;
  }[];
  options?: Array<string | { label: string; value: any }>;
  inputType?: string;
  fields?: FormField[];
  conditional?: string;
  minLength?: number;
}

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatOptionModule,
    MatError,
  ],
  templateUrl: './request-form.html',
  styleUrls: ['./request-form.css'],
})
export class RequestFormComponent implements OnInit {
  // formConfig = formConfig;
  formConfig: FormField[] = formConfig;
  requestForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private dialogRef: MatDialogRef<RequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request: ServiceRequest }
  ) {}

  ngOnInit() {
    this.requestForm = this.createForm();
    if (this.data?.request) {
      this.isEditMode = true;
      this.requestForm.patchValue(this.data.request);
    }
  }

  createForm(): FormGroup {
    const group = this.fb.group({});
    this.processFields(this.formConfig, group);
    return group;
  }

  private processFields(fields: any[], formGroup: FormGroup) {
    fields.forEach((field) => {
      if (field.type === 'section') {
        this.processFields(field.fields, formGroup);
      } else {
        const validators = [];
        if (field.required) validators.push(Validators.required);
        if (field.validations) {
          field.validations.forEach((validation: any) => {
            if (validation.type === 'pattern') {
              validators.push(Validators.pattern(validation.value));
            }
          });
        }
        formGroup.addControl(field.name, this.fb.control('', validators));
      }
    });
  }

  onSubmit() {
    if (this.requestForm.valid) {
      const formData = this.requestForm.value;
      console.log('Form Data:', formData);
      const request: ServiceRequest = {
        id: this.isEditMode ? this.data.request.id : this.generateId(),
        ...formData,
        status: this.isEditMode ? this.data.request.status : 'Pending',
      };

      if (this.isEditMode) {
        this.requestService
          .updateRequest(request.id, request)
          .subscribe(() => this.dialogRef.close(true));
      } else {
        this.requestService
          .addRequest(request)
          .subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  // Helper methods remain the same
  private formatDate(date: string | Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private formatTime(time: string): string {
    if (!time) return '00:00';
    return time.includes(':') ? time : `${time}:00`;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(field: any): string {
    if (field.validations) {
      const validation = field.validations.find(
        (v: any) => v.type === 'pattern'
      );
      return validation?.message || 'Invalid format';
    }
    return 'Invalid input';
  }

  shouldShowField(field: any): boolean {
    if (!field.conditional) return true;
    try {
      const [fieldName, operator, value] = field.conditional.split(' ');
      const fieldValue = this.requestForm.get(fieldName)?.value;

      switch (operator) {
        case '===':
          return fieldValue === JSON.parse(value);
        case '!==':
          return fieldValue !== JSON.parse(value);
        default:
          return true;
      }
    } catch {
      return true;
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { RequestService } from '../services/request.service';
// import { ServiceRequest } from '../models/service-request.model';
// import formConfig from '../../assets/form-config.json';

// @Component({
//   selector: 'app-request-form',
//   templateUrl: './request-form.html',
//   styleUrls: ['./request-form.css']
// })
// export class RequestFormComponent implements OnInit {
//   requestForm!: FormGroup;
//   formConfig = formConfig as any[];
//   isEditMode = false;                         // ← missing
//   requestId: string | null = null;            // ← helps if you later add edit

//   constructor(
//     private fb: FormBuilder,
//     private requestService: RequestService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.buildForm();
//   }

//   private buildForm(): void {
//     const controls: any = {};
//     this.formConfig.forEach(field => {
//       const validators = field.required ? [Validators.required] : [];
//       if (field.validations) {
//         field.validations.forEach((v: any) => {
//           if (v.type === 'pattern') validators.push(Validators.pattern(v.value));
//         });
//       }
//       controls[field.name] = ['', validators];
//     });
//     this.requestForm = this.fb.group(controls);
//   }

//   shouldShowField(field: any): boolean {
//     // simple implementation – extend as needed
//     return true;
//   }

//   getErrorMessage(fieldName: string): string {
//     const control = this.requestForm.get(fieldName);
//     if (control?.hasError('required')) return 'This field is required';
//     if (control?.hasError('pattern'))  return 'Invalid format';
//     return '';
//   }

//   onSubmit(): void {
//     if (this.requestForm.invalid) return;
//     this.requestService.createRequest(this.requestForm.value).subscribe(() => {
//       this.router.navigate(['/services']);
//     });
//   }

//   onCancel(): void {
//     this.router.navigate(['/services']);
//   }
// }
