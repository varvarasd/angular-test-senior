import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly vehiclesUrl = '/data/vehicles.json';
  private http = inject(HttpClient);

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.vehiclesUrl).pipe(
      delay(500), // Simulate async API
      catchError(() => of([]))
    );
  }

  getVehicleById(id: string): Observable<Vehicle | null> {
    return this.getVehicles().pipe(
      map((vehicles) => vehicles.find((v) => v.id === id) || null),
      catchError(() => of(null))
    );
  }
}
