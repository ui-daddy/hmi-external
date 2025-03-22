import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-test-project-56',
  template: `
    <div style="padding: 20px;">
      <h2 style="text-align: center;">EMI Calculator</h2>
      <div style="margin-bottom: 10px;">
        <label for="loanAmount">Loan Amount:</label>
        <input type="number" id="loanAmount" [(ngModel)]="loanAmount" style="margin-left: 10px;" />
      </div>
      <div style="margin-bottom: 10px;">
        <label for="interestRate">Interest Rate (%):</label>
        <input type="number" id="interestRate" [(ngModel)]="interestRate" style="margin-left: 10px;" />
      </div>
      <div style="margin-bottom: 10px;">
        <label for="period">Period (in years):</label>
        <input type="number" id="period" [(ngModel)]="period" style="margin-left: 10px;" />
      </div>
      <button (click)="calculateEMI()" style="margin-top: 10px;">Calculate EMI</button>
      <h3 *ngIf="emi !== null" style="text-align: center; margin-top: 20px;">Monthly EMI: {{ emi | currency }}</h3>
    </div>
  `,
  styles: [`
    h2 {
      color: #333;
    }
    label {
      font-weight: bold;
    }
  `]
})
export class TestProject56 extends CommonExternalComponent {
  loanAmount: number = 0;
  interestRate: number = 0;
  period: number = 0;
  emi: number | null = null;

  calculateEMI(): void {
    const monthlyRate = this.interestRate / 12 / 100;
    const numberOfMonths = this.period * 12;
    this.emi = (this.loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfMonths));
  }
}