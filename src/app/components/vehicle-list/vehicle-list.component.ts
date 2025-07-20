import {
  Component,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'vehicle-list' },
})
export class VehicleListComponent implements OnInit {
  readonly vehicles = signal<Vehicle[]>([]);
  readonly filterText = signal('');
  readonly sortField = signal<keyof Vehicle>('price');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  readonly filteredVehicles = computed(() => {
    const filter = this.filterText().toLowerCase();
    let result = this.vehicles().filter(
      (v) =>
        v.make.toLowerCase().includes(filter) ||
        v.model.toLowerCase().includes(filter)
    );
    result = result.sort((a, b) => {
      const valA = a[this.sortField()];
      const valB = b[this.sortField()];
      return this.sortDirection() === 'asc'
        ? valA > valB
          ? 1
          : -1
        : valA < valB
        ? 1
        : -1;
    });
    return result;
  });

  constructor(private vehicleService: VehicleService, private router: Router) {}

  ngOnInit() {
    this.vehicleService.getVehicles().subscribe((data) => {
      this.vehicles.set(data);
    });
  }

  onSortChange(field: keyof Vehicle) {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  goToDetails(id: string) {
    this.router.navigate(['/vehicle', id]);
  }
}
