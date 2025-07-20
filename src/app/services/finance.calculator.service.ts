import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';
import { FinanceQuote } from '../models/finance.model';

@Injectable({ providedIn: 'root' })
export class FinanceCalculatorService {
  calculateQuote(
    vehicle: Vehicle,
    term: number,
    deposit: number
  ): Observable<FinanceQuote> {
    const onTheRoadPrice = vehicle.price;
    const totalDeposit = deposit;
    const totalAmountOfCredit = onTheRoadPrice - totalDeposit;
    const numberOfMonthlyPayments = term;
    // Simple interest-free calculation for demo purposes
    const monthlyPayment = totalAmountOfCredit / numberOfMonthlyPayments;

    const quote: FinanceQuote = {
      onTheRoadPrice,
      totalDeposit,
      totalAmountOfCredit,
      numberOfMonthlyPayments,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    };

    return of(quote);
  }
}
