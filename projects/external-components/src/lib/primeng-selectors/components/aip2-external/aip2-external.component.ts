import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-aip2',
  template: `
    <div style="text-align: center; margin: 20px;">
      <h2 style="font-family: Arial, sans-serif;">Temperature in New York for the Last 10 Days</h2>
      <canvas id="temperatureChart" style="width: 100%; max-width: 600px;"></canvas>
    </div>
  `,
  styles: [`
    h2 {
      color: #333;
    }
  `]
})
export class Aip2Component extends CommonExternalComponent {
  private temperatureData = [30, 32, 31, 29, 28, 27, 26, 25, 24, 23]; // Example data
  private labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'];

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = (document.getElementById('temperatureChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
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