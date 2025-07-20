import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { FinanceCalculatorService } from '../../services/finance.calculator.service';
import { Vehicle } from '../../models/vehicle.model';
import { FinanceQuote } from '../../models/finance.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'vehicle-detail' },
})
export class VehicleDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private financeService = inject(FinanceCalculatorService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly vehicle = signal<Vehicle | null>(null);
  readonly term = signal(60);
  readonly deposit = signal(0);
  readonly quote = signal<FinanceQuote | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleService.getVehicleById(id).subscribe({
        next: (v: Vehicle | null) => {
          this.vehicle.set(v);
          this.loading.set(false);
          if (!v) this.error.set('Vehicle not found.');
          else {
            this.deposit.set(Math.round(v.price * 0.1));
            this.calculateFinance();
          }
        },
        error: () => {
          this.error.set('Error fetching vehicle.');
          this.loading.set(false);
        },
      });
    } else {
      this.error.set('No vehicle ID provided.');
      this.loading.set(false);
    }
  }

  calculateFinance() {
    const v = this.vehicle();
    if (v) {
      this.financeService
        .calculateQuote(v, this.term(), this.deposit())
        .subscribe((q: FinanceQuote) => this.quote.set(q));
    }
  }

  backToList() {
    this.router.navigate(['/']);
  }
}
