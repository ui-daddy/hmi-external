import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-test-project-57',
  template: `
    <div style="padding: 20px; border: 1px solid #ccc;">
      <h2 style="color: #333;">भोजन ट्रॅकिंग अॅप</h2>
      
      <label for="dateInput" style="display: block; margin-bottom: 10px;">तारीख:</label>
      <input id="dateInput" type="date" [(ngModel)]="selectedDate" style="padding: 8px; width: 100%;"/>
      
      <label for="foodInput" style="display: block; margin-top: 10px;">आजचे भोजन:</label>
      <input id="foodInput" type="text" [(ngModel)]="foodItem" style="padding: 8px; width: 100%;"/>
      
      <button (click)="addFood()" style="margin-top: 10px; padding: 10px 15px;">जोडा</button>
      
      <h3 style="margin-top: 20px;">खाल्लेले भोजन {{ selectedDate | date: 'fullDate' }} रोजी:</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li *ngFor="let food of foodList" style="padding: 5px 0;">{{ food }}</li>
      </ul>
    </div>
  `,
  styles: [`
    h2 { font-size: 24px; }
    input { font-size: 16px; }
    button { background-color: #007bff; color: white; border: none; cursor: pointer; }
    button:hover { background-color: #0056b3; }
  `]
})
export class TestProject57Component extends CommonExternalComponent {
  foodItem: string = '';
  foodList: string[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0]; // आजची तारीख पूर्वनिर्धारित

  addFood() {
    if (this.foodItem) {
      this.foodList.push(this.foodItem);
      this.foodItem = '';
    }
  }
}