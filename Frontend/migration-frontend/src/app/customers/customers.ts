import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from './customer-service';
import { Customer } from './customer';

@Component({
  selector: 'app-customers',
  imports: [ReactiveFormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers {
  private customerService = inject(CustomerService);
  private fb = inject(FormBuilder);

  customers = signal<Customer[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data) => this.customers.set(data),
      error: () => this.errorMessage.set('Failed to load customers.'),
    });
  }

  openCreate() {
    this.editingId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  openEdit(customer: Customer) {
    this.editingId.set(customer.id);
    this.form.setValue({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    });
    this.showForm.set(true);
  }

  cancel() {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const id = this.editingId();

    const request$ = id
      ? this.customerService.updateCustomer(id, value)
      : this.customerService.createCustomer(value);

    request$.subscribe({
      next: () => {
        this.cancel();
        this.loadCustomers();
      },
      error: () => this.errorMessage.set('Failed to save customer.'),
    });
  }

  delete(customer: Customer) {
    if (!confirm(`Delete ${customer.firstName} ${customer.lastName}?`)) return;

    this.customerService.deleteCustomer(customer.id).subscribe({
      next: () => this.loadCustomers(),
      error: () => this.errorMessage.set('Failed to delete customer.'),
    });
  }
}