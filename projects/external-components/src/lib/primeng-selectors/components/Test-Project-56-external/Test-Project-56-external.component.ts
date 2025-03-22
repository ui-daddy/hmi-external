import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-test-project-56',
  template: `
    <div>
      <h2>Home Loan Principal and Interest Payment</h2>
      <label for="amount">Loan Amount:</label>
      <input id="amount" type="number" [(ngModel)]="loanAmount" />
      
      <label for="interest">Interest Rate (%):</label>
      <input id="interest" type="number" [(ngModel)]="interestRate" />
      
      <label for="period">Period (years):</label>
      <input id="period" type="number" [(ngModel)]="loanPeriod" />
      
      <button (click)="calculate()">Calculate</button>
      
      <canvas id="loanChart"></canvas>
    </div>
  `,
  styles: [`
    div {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    h2 {
      color: #333;
    }
    label {
      display: block;
      margin: 10px 0 5px;
    }
    input {
      margin-bottom: 15px;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
    }
    button {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  `]
})
export class TestProject56Component extends CommonExternalComponent {
  loanAmount: number = 0;
  interestRate: number = 0;
  loanPeriod: number = 0;

  calculate() {
    const principal = this.loanAmount;
    const interest = this.interestRate / 100 / 12;
    const payments = this.loanPeriod * 12;

    const monthlyPayment = (principal * interest) / (1 - Math.pow(1 + interest, -payments));
    const totalPayment = monthlyPayment * payments;
    const totalInterest = totalPayment - principal;

    this.renderChart(principal, totalInterest);
  }

  renderChart(principal: number, totalInterest: number) {
    const ctx = (document.getElementById('loanChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [{
          label: 'Payments',
          data: [principal, totalInterest],
          backgroundColor: ['#36a2eb', '#ff6384']
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}