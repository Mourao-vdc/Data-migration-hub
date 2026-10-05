import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, LegacyCustomerARequest, LegacyCustomerBRequest } from './customer';

export type CustomerRequest = Omit<Customer, 'id'>;

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/customers';
  private migrationApiUrl = 'http://localhost:8080/api/migrations/customers';

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  createCustomer(customer: CustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: string, customer: CustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  migrateFromSourceA(customer: LegacyCustomerARequest): Observable<Customer> {
    return this.http.post<Customer>(
      `${this.migrationApiUrl}/source-a`,
      customer
    );
  }

  migrateFromSourceB(customer: LegacyCustomerBRequest): Observable<Customer> {
    return this.http.post<Customer>(
      `${this.migrationApiUrl}/source-b`,
      customer
    );
  }
}