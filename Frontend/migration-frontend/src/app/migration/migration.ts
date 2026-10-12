import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
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

  @ViewChild('fileInput')
  fileInput?: ElementRef<HTMLInputElement>;

  selectedSource = signal<'A' | 'B'>('A');
  selectedMode = signal<'single' | 'bulk'>('single');

  selectedFileName = signal<string | null>(null);
  customerCount = signal(0);
  isImporting = signal(false);

  private sourceAData: LegacyCustomerARequest[] = [];
  private sourceBData: LegacyCustomerBRequest[] = [];

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
    this.clearFile();
  }

  selectMode(mode: 'single' | 'bulk') {
    this.selectedMode.set(mode);
    this.clearFile();
  }

  clearFile() {
    this.selectedFileName.set(null);
    this.customerCount.set(0);
    this.sourceAData = [];
    this.sourceBData = [];

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  migrate() {
    if (this.isImporting()) {
      return;
    }

    if (this.selectedMode() === 'single') {
      if (this.selectedSource() === 'A') {
        this.migrateSourceA();
      } else {
        this.migrateSourceB();
      }

      return;
    }

    this.migrateFile();
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

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.clearFile();

    if (!file.name.toLowerCase().endsWith('.json')) {
      this.toastr.error('Please select a JSON file.');
      return;
    }

    try {
      const content = await file.text();
      const data: unknown = JSON.parse(content);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(
          'The file must contain a non-empty JSON array.'
        );
      }

      if (this.selectedSource() === 'A') {
        if (!data.every(item => this.isSourceARecord(item))) {
          throw new Error(
            'The JSON structure does not match Source A.'
          );
        }

        this.sourceAData = data;
      } else {
        if (!data.every(item => this.isSourceBRecord(item))) {
          throw new Error(
            'The JSON structure does not match Source B.'
          );
        }

        this.sourceBData = data;
      }

      this.selectedFileName.set(file.name);
      this.customerCount.set(data.length);

      this.toastr.success(
        `${data.length} customers ready to import.`
      );
    } catch (error) {
      this.clearFile();

      this.toastr.error(
        error instanceof Error
          ? error.message
          : 'Could not read the JSON file.'
      );
    }
  }

  private isSourceARecord(
    value: unknown
  ): value is LegacyCustomerARequest {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const item = value as Record<string, unknown>;

    return (
      typeof item['customerId'] === 'number' &&
      Number.isFinite(item['customerId']) &&
      typeof item['fullName'] === 'string' &&
      item['fullName'].trim().length > 0 &&
      typeof item['emailAddress'] === 'string' &&
      item['emailAddress'].trim().length > 0
    );
  }

  private isSourceBRecord(
    value: unknown
  ): value is LegacyCustomerBRequest {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const item = value as Record<string, unknown>;
    const contact = item['contact'];

    if (typeof contact !== 'object' || contact === null) {
      return false;
    }

    const contactData = contact as Record<string, unknown>;

    return (
      typeof item['clientCode'] === 'string' &&
      item['clientCode'].trim().length > 0 &&
      typeof item['firstName'] === 'string' &&
      item['firstName'].trim().length > 0 &&
      typeof item['surname'] === 'string' &&
      item['surname'].trim().length > 0 &&
      typeof contactData['email'] === 'string' &&
      contactData['email'].trim().length > 0
    );
  }

  private migrateFile() {
    if (this.customerCount() === 0) {
      this.toastr.warning(
        'Please select a valid JSON file first.'
      );
      return;
    }

    this.isImporting.set(true);

    const request$ = this.selectedSource() === 'A'
      ? this.customerService.migrateAllFromSourceA(this.sourceAData)
      : this.customerService.migrateAllFromSourceB(this.sourceBData);

    request$.subscribe({
      next: customers => {
        this.toastr.success(
          `${customers.length} customers imported successfully.`
        );

        this.clearFile();
        this.isImporting.set(false);
      },
      error: () => {
        this.toastr.error(
          'Import failed. Please check the file and try again.'
        );

        this.isImporting.set(false);
      },
    });
  }
}