import { Routes } from '@angular/router';
import { Customers } from './customers/customers';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', component: Customers },
];