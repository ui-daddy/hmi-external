import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-emi-calculator',
  template: `
    <div style="padding: 20px; max-width: 400px; margin: auto;">
      <h2 style="text-align: center;">EMI Calculator</h2>
      <label for="loanAmount">Loan Amount:</label>
      <input id="loanAmount" type="number" [(ngModel)]="loanAmount" style="width: 100%; padding: 8px; margin-bottom: 10px;" />

      <label for="interestRate">Interest Rate (%):</label>
      <input id="interestRate" type="number" [(ngModel)]="interestRate" style="width: 100%; padding: 8px; margin-bottom: 10px;" />

      <label for="loanTenure">Loan Tenure (Years):</label>
      <select id="loanTenure" [(ngModel)]="loanTenureYears" style="width: 100%; padding: 8px; margin-bottom: 10px;">
        <option *ngFor="let year of years" [value]="year">{{ year }} Year(s)</option>
      </select>

      <button (click)="calculateEMI()" style="width: 100%; padding: 10px; background-color: #28a745; color: white; border: none; cursor: pointer;">Calculate EMI</button>

      <div *ngIf="emi" style="margin-top: 20px;">
        <h4>Monthly EMI: ₹{{ emi | number:'1.0-0' }}</h4>
        <h4>Total Interest Paid: ₹{{ totalInterest | number:'1.0-0' }}</h4>
      </div>
    </div>
  `,
  styles: []
})
export class EmiCalculatorComponent extends CommonExternalComponent {
  loanAmount: number = 0;
  interestRate: number = 0;
  loanTenureYears: number = 0;
  emi: number | null = null;
  totalInterest: number | null = null;

  years: number[] = Array.from({ length: 31 }, (_, i) => i); // Years from 0 to 30

  calculateEMI() {
    const totalMonths = this.loanTenureYears * 12;
    const monthlyInterestRate = this.interestRate / 12 / 100;
    const numerator = this.loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths);
    const denominator = Math.pow(1 + monthlyInterestRate, totalMonths) - 1;
    this.emi = numerator / denominator;
    this.totalInterest = this.emi * totalMonths - this.loanAmount;
  }
}