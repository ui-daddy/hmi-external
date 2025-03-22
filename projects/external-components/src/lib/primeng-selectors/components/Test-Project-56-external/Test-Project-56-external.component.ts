import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-test-project-56',
  template: `
    <div>
      <h2>EMI Calculator</h2>
      <label for="loanAmount">Loan Amount:</label>
      <input type="number" id="loanAmount" [(ngModel)]="loanAmount" />

      <label for="interestRate">Rate of Interest (%):</label>
      <input type="number" id="interestRate" [(ngModel)]="interestRate" />

      <label for="loanTenure">Loan Tenure (in years):</label>
      <input type="number" id="loanTenure" [(ngModel)]="loanTenure" />

      <button (click)="calculateEMI()">Calculate EMI</button>

      <div *ngIf="emi">
        <h3>Your Monthly EMI is: {{ emi | currency }}</h3>
      </div>
    </div>
  `,
  styles: [`
    div {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    label {
      display: block;
      margin-top: 10px;
    }
    input {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
    }
    button {
      margin-top: 15px;
      padding: 10px 15px;
    }
  `]
})
export class TestProject56Component extends CommonExternalComponent {
  loanAmount: number = 0;
  interestRate: number = 0;
  loanTenure: number = 0;
  emi: number | null = null;

  calculateEMI() {
    const principal = this.loanAmount;
    const calculatedInterest = this.interestRate / (12 * 100);
    const calculatedTenure = this.loanTenure * 12;

    this.emi = (principal * calculatedInterest * Math.pow(1 + calculatedInterest, calculatedTenure)) /
               (Math.pow(1 + calculatedInterest, calculatedTenure) - 1);
  }
}