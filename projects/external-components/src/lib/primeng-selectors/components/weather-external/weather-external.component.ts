import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-weather',
  template: `
    <div class="weather-container">
      <h1>Weather Report</h1>
      <label for="citySelect">Select a city:</label>
      <select id="citySelect" [(ngModel)]="selectedCity" (change)="getWeather()">
        <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
      </select>

      <div *ngIf="weatherReport" class="weather-report">
        <h2>Weather in {{ selectedCity }}</h2>
        <p>{{ weatherReport }}</p>
      </div>
    </div>
  `,
  styles: [`
    .weather-container {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    .weather-report {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
    }
  `]
})
export class WeatherComponent extends CommonExternalComponent {
  cities: string[] = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
  selectedCity: string | null = null;
  weatherReport: string | null = null;

  getWeather() {
    // Simulate fetching weather data based on selected city
    if (this.selectedCity) {
      this.weatherReport = `The weather in ${this.selectedCity} is sunny with a temperature of 30°C.`;
    } else {
      this.weatherReport = null;
    }
  }
}