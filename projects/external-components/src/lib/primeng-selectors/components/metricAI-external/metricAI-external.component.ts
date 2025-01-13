import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-metric-ai',
  template: `
    <div style="text-align:center; margin: 20px;">
      <h2 style="font-family: Arial, sans-serif;">Temperature in New York - Last 5 Days</h2>
      <canvas id="temperatureChart" style="max-width: 600px; margin: auto;"></canvas>
    </div>
  `,
  styles: [`
    h2 {
      color: #333;
    }
    canvas {
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  `]
})
export class MetricAIComponent extends CommonExternalComponent {
  private temperatureData = [30, 32, 29, 31, 33]; // Sample data for the last 5 days

  ngOnInit() {
    this.renderChart();
  }

  private renderChart() {
    const ctx = (document.getElementById('temperatureChart') as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
          datasets: [{
            label: 'Temperature (�F)',
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
    }
  }
}