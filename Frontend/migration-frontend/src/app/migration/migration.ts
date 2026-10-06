import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {CustomerService} from '../customers/customer-service';
import { LegacyCustomerARequest, LegacyCustomerBRequest } from '../customers/customer';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-migration',
  imports: [ReactiveFormsModule],
  templateUrl: './migration.html',
  styleUrl: './migration.css',
})
export class Migration {

  private customerService = inject(CustomerService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  selectedSource = signal<'A' | 'B'>('A');

  sourceAForm = this.fb.nonNullable.group({
    customerId: [0, Validators.required],
    fullName: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
  });

  sourceBForm = this.fb.nonNullable.group({
    clientCode: ['', Validators.required],
    firstName: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  selectSource(source: 'A' | 'B') {
    this.selectedSource.set(source);
  }

  migrate() {
    if (this.selectedSource() === 'A') {
      this.migrateSourceA();
    } else {
      this.migrateSourceB();
    }
  }

  private migrateSourceA() {
    if (this.sourceAForm.invalid) {
      this.sourceAForm.markAllAsTouched();
      return;
    }

    const value = this.sourceAForm.getRawValue();

    const request: LegacyCustomerARequest = {
      customerId: value.customerId,
      fullName: value.fullName,
      emailAddress: value.emailAddress,
    };

    this.customerService.migrateFromSourceA(request).subscribe({
      next: () => {
        this.toastr.success(
          'Customer from Source A migrated successfully.'
        );
        this.sourceAForm.reset({
          customerId: 0,
          fullName: '',
          emailAddress: '',
        });
      },
      error: () => {
        this.toastr.error(
          'Failed to migrate customer from Source A.'
        );
      },
    });
  }

  private migrateSourceB() {
    if (this.sourceBForm.invalid) {
      this.sourceBForm.markAllAsTouched();
      return;
    }

    const value = this.sourceBForm.getRawValue();

    const request: LegacyCustomerBRequest = {
      clientCode: value.clientCode,
      firstName: value.firstName,
      surname: value.surname,
      contact: {
        email: value.email,
      },
    };

    this.customerService.migrateFromSourceB(request).subscribe({
      next: () => {
        this.toastr.success(
          'Customer from Source B migrated successfully.'
        );
        this.sourceBForm.reset({
          clientCode: '',
          firstName: '',
          surname: '',
          email: '',
        });
      },
      error: () => {
        this.toastr.error(
          'Failed to migrate customer from Source B.'
        );
      },
    });
  }
}