import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  filterText = '';
  sortField: keyof Vehicle = 'price';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private vehicleService: VehicleService, private router: Router) {}

  ngOnInit() {
    this.vehicleService.getVehicles().subscribe((data) => {
      this.vehicles = data;
      this.applyFilters();
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSortChange(field: keyof Vehicle) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  applyFilters() {
    let result = this.vehicles.filter(
      (v) =>
        v.make.toLowerCase().includes(this.filterText.toLowerCase()) ||
        v.model.toLowerCase().includes(this.filterText.toLowerCase())
    );
    result = result.sort((a, b) => {
      const valA = a[this.sortField];
      const valB = b[this.sortField];
      return this.sortDirection === 'asc'
        ? valA > valB
          ? 1
          : -1
        : valA < valB
        ? 1
        : -1;
    });
    this.filteredVehicles = result;
  }

  goToDetails(id: string) {
    this.router.navigate(['/vehicle', id]);
  }
}
