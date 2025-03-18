import { Component, AfterViewInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-test-project-56',
  template: `
    <div style="width: 100%; height: 400px;">
      <canvas id="temperatureChart" style="width: 100%; height: 100%;"></canvas>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 16px;
    }
  `]
})
export class TestProject56Component extends CommonExternalComponent implements AfterViewInit {
  private temperatureData = [30, 32, 31, 29, 28, 33, 34, 35, 36, 31]; // Example data for the last 10 days

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = (document.getElementById('temperatureChart') as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'],
          datasets: [{
            label: 'Temperature in Pune (°C)',
            data: this.temperatureData,
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
    } else {
      console.error('Failed to get context for the chart.');
    }
  }
}