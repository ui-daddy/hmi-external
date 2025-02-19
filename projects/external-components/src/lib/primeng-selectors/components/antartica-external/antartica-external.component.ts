import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-antartica',
  template: `
    <div style="width: 100%; max-width: 600px; margin: auto;">
      <h2 style="text-align: center;">Monthly Temperature Variation in Antarctica (2023)</h2>
      <canvas id="lineChart" style="display: block; width: 100%; height: 400px;"></canvas>
    </div>
  `,
  styles: [`
    h2 {
      color: #2c3e50;
    }
  `]
})
export class AntarcticaComponent extends CommonExternalComponent {
  constructor() {
    super();
    this.createLineChart();
  }

  createLineChart() {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Temperature (°C)',
        data: [-10, -9, -8, -6, -4, -3, -5, -7, -8, -9, -10, -11],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      }]
    };

    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Temperature (°C)'
          }
        }
      }
    };

    new Chart(ctx, {
      type: 'line',
      data: data,
      options: options
    });
  }
}