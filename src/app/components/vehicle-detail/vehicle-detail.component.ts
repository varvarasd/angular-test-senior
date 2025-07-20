import { Component, OnInit } from '@angular/core';
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
})
export class VehicleDetailComponent implements OnInit {
  vehicle: Vehicle | null = null;
  loading = true;
  error = '';
  term = 60;
  deposit = 0;
  quote: FinanceQuote | null = null;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private financeService: FinanceCalculatorService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleService.getVehicleById(id).subscribe({
        next: (v) => {
          this.vehicle = v;
          this.loading = false;
          if (!v) this.error = 'Vehicle not found.';
          else {
            this.deposit = Math.round(v.price * 0.1); // Default 10% deposit
            this.calculateFinance();
          }
        },
        error: () => {
          this.error = 'Error fetching vehicle.';
          this.loading = false;
        },
      });
    } else {
      this.error = 'No vehicle ID provided.';
      this.loading = false;
    }
  }

  calculateFinance() {
    if (this.vehicle) {
      this.financeService
        .calculateQuote(this.vehicle, this.term, this.deposit)
        .subscribe((q) => (this.quote = q));
    }
  }

  backToList() {
    this.router.navigate(['/']);
  }
}
