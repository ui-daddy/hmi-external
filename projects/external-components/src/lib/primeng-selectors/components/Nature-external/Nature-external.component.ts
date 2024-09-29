import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock-dashboard',
  template: `
    <div class="dashboard">
      <h1>World Clocks</h1>
      <div class="clocks">
        <div *ngFor="let city of cities" class="clock">
          <h2>{{ city.name }}</h2>
          <div class="clock-face">
            <div class="hand hour-hand" [ngStyle]="{'transform': 'rotate(' + (city.time.getHours() * 30 + city.time.getMinutes() / 2) + 'deg)'}"></div>
            <div class="hand minute-hand" [ngStyle]="{'transform': 'rotate(' + (city.time.getMinutes() * 6) + 'deg)'}"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      text-align: center;
      font-family: Arial, sans-serif;
    }
    .clocks {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    .clock {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 20px;
      width: 200px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      background-color: #f9f9f9;
    }
    h2 {
      margin: 0;
    }
    .clock-face {
      position: relative;
      width: 100px;
      height: 100px;
      border: 5px solid #333;
      border-radius: 50%;
      margin: 0 auto;
      background-color: white;
    }
    .hand {
      position: absolute;
      background: #333;
      transform-origin: bottom;
      bottom: 50%;
      left: 50%;
      transform: translateX(-50%);
    }
    .hour-hand {
      width: 6px;
      height: 30px;
      z-index: 10;
    }
    .minute-hand {
      width: 4px;
      height: 40px;
      z-index: 5;
    }
  `]
})
export class ClockDashboardComponent implements OnInit {
  cities = [
    { name: 'New York', timezone: 'America/New_York', time: new Date() },
    { name: 'London', timezone: 'Europe/London', time: new Date() },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', time: new Date() },
    { name: 'Sydney', timezone: 'Australia/Sydney', time: new Date() },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', time: new Date() },
  ];

  ngOnInit() {
    this.updateTimes();
    setInterval(() => this.updateTimes(), 1000);
  }

  updateTimes() {
    const now = new Date();
    this.cities.forEach(city => {
      const options = { timeZone: city.timezone };
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const localTime = new Date(utcDate.toLocaleString('en-US', options));
      city.time = localTime;
    });
  }
}