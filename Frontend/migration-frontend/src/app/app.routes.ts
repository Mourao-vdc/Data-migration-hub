import { Routes } from '@angular/router';
import { Customers } from './customers/customers';
import { Migration } from './migration/migration';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'customers',
    pathMatch: 'full'
  },
  {
    path: 'customers',
    component: Customers
  },
  {
    path: 'migration',
    component: Migration
  }
];