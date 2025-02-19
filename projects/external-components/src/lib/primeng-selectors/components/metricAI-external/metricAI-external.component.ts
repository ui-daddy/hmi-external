import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-metric-ai',
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
      margin-top: 20px;
    }
  `]
})
export class MetricAIComponent extends CommonExternalComponent {
  private chart: any;

  constructor() {
    super();
    this.createChart();
  }

  createChart() {
    const ctx = (document.getElementById('temperatureChart') as HTMLCanvasElement).getContext('2d');
    const data = {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [{
        label: 'Temperature (°C)',
        data: this.getHourlyTemperatureData(),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      }]
    };

    this.chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Temperature (°C)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Hour of the Day'
            }
          }
        }
      }
    });
  }

  getHourlyTemperatureData() {
    // Example static data for hourly temperature in Antarctica
    return [-20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3];
  }
}