import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/vehicle-list/vehicle-list.component').then(
        (m) => m.VehicleListComponent
      ),
  },
  {
    path: 'vehicle/:id',
    loadComponent: () =>
      import('./components/vehicle-detail/vehicle-detail.component').then(
        (m) => m.VehicleDetailComponent
      ),
  },
];
