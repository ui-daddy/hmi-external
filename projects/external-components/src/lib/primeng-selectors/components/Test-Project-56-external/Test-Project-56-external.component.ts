import { Component, AfterViewInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-test-project-56',
  template: `
    <div style="width: 100%; height: 400px;">
      <canvas id="temperatureChart"></canvas>
    </div>
  `,
  styles: [`
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px;
    }
  `]
})
export class TestProject56Component extends CommonExternalComponent implements AfterViewInit {
  
  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const ctx = (document.getElementById('temperatureChart') as HTMLCanvasElement).getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    
    const temperatureData = [30, 32, 31, 29, 28, 35, 34, 33, 30, 31]; // Example data for last 10 days
    const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'];

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature in Pune (°C)',
          data: temperatureData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
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