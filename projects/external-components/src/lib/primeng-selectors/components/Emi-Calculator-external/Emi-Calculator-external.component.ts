import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-emi-calculator',
  template: `
    <div style="padding: 20px; max-width: 400px; margin: auto; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
      <h2 style="text-align: center; color: #333;">EMI Calculator</h2>
      <label for="loanAmount" style="color: #555;">Loan Amount:</label>
      <input id="loanAmount" type="number" [(ngModel)]="loanAmount" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;" />

      <label for="interestRate" style="color: #555;">Interest Rate (%):</label>
      <input id="interestRate" type="number" [(ngModel)]="interestRate" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;" />

      <label for="loanTenure" style="color: #555;">Loan Tenure (Years):</label>
      <select id="loanTenure" [(ngModel)]="loanTenureYears" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
        <option *ngFor="let year of years" [value]="year">{{ year }} Year(s)</option>
      </select>

      <button (click)="calculateEMI()" style="width: 100%; padding: 10px; background-color: red; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.3s;">
        Calculate EMI
      </button>

      <div *ngIf="emi" style="margin-top: 20px; background-color: #e7f3fe; padding: 15px; border-radius: 4px; border: 1px solid #b3d4fc;">
        <h4 style="color: #31708f;">Monthly EMI: ₹{{ emi | number:'1.0-0' }}</h4>
        <h4 style="color: #31708f;">Total Interest Paid: ₹{{ totalInterest | number:'1.0-0' }}</h4>
      </div>
    </div>
  `,
  styles: [],
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
    const numerator =
      this.loanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, totalMonths);
    const denominator = Math.pow(1 + monthlyInterestRate, totalMonths) - 1;
    this.emi = numerator / denominator;
    this.totalInterest = this.emi * totalMonths - this.loanAmount;
  }
}