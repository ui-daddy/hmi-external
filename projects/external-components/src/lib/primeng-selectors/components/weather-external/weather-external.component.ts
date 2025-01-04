import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

      <button (click)="getWeather()">Get Weather</button>

      <div *ngIf="weatherReport" class="weather-report">
        <h2>Weather in {{ selectedCity }}</h2>
        <p>Temperature: {{ weatherReport.main.temp }}°C</p>
        <p>Condition: {{ weatherReport.weather[0].description }}</p>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
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
    .error-message {
      color: red;
      margin-top: 20px;
    }
  `]
})
export class WeatherComponent extends CommonExternalComponent implements OnInit {
  cities: string[] = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
  selectedCity: string | null = null;
  weatherReport: any = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {
    super();
  }

  ngOnInit() {
    this.selectedCity = this.cities[0]; // Default to first city
    this.getWeather(); // Fetch weather on initialization
  }

  getWeather() {
    if (this.selectedCity) {
      const apiKey = 'de945b3d29fbbaa3379c0a62bb204639'; // Your actual API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.selectedCity}&appid=${apiKey}&units=metric`;

      this.http.get(apiUrl).subscribe((data: any) => {
        this.weatherReport = data;
        this.errorMessage = null; // Clear any previous error message
      }, error => {
        console.error('Error fetching weather data:', error);
        this.weatherReport = null; // Reset report on error
        this.errorMessage = 'Could not fetch weather data. Please try again.';
      });
    }
  }
}