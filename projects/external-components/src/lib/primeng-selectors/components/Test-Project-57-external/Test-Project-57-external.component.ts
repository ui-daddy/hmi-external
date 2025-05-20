// TestProject57Component: भोजन ट्रॅकिंग अॅप - आकर्षक UI सह, भोजन व कॅलरीज साठवा.
// Features:
// - Modern card-style layout with shadow and rounded corners.
// - Responsive design for mobile.
// - Highlighted input fields and action button.
// - Add food items with calories per date; display in a styled list.

import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

interface FoodEntry {
  name: string;
  calories: number;
}

@Component({
  selector: 'app-test-project-57',
  template: `
    <div style="
      max-width: 400px; 
      margin: 40px auto; 
      background: #fff; 
      border-radius: 16px; 
      box-shadow: 0 4px 24px rgba(0,0,0,0.09); 
      padding: 28px 20px 22px 20px;
    ">
      <h2 style="
        color: #2166af;
        font-size: 26px;
        text-align: center;
        letter-spacing: 1px;
        margin-bottom: 18px;
        font-weight: 700;
      ">भोजन ट्रॅकिंग अॅप</h2>
      
      <div style="margin-bottom: 14px;">
        <label for="dateInput" style="display: block; font-weight: 500; margin-bottom: 5px;">तारीख:</label>
        <input 
          id="dateInput"
          type="date"
          [(ngModel)]="selectedDate"
          style="
            padding: 10px; 
            width: 100%; 
            border-radius: 8px; 
            border: 1.5px solid #cfd8dc; 
            background: #f9fbfc; 
            font-size: 16px;
            transition: border-color 0.2s;
          "
          (focus)="inputFocus=true"
          (blur)="inputFocus=false"
          [style.borderColor]="inputFocus ? '#2166af' : '#cfd8dc'"
        />
      </div>
      
      <div style="margin-bottom: 12px;">
        <label for="foodInput" style="display: block; font-weight: 500; margin-bottom: 5px;">आजचे भोजन:</label>
        <input 
          id="foodInput"
          type="text"
          [(ngModel)]="foodItem"
          placeholder="उदा. पोळी भाजी"
          style="
            padding: 10px; 
            width: 100%; 
            border-radius: 8px; 
            border: 1.5px solid #cfd8dc; 
            background: #f9fbfc; 
            font-size: 16px;
            transition: border-color 0.2s;
          "
          (focus)="foodInputFocus=true"
          (blur)="foodInputFocus=false"
          [style.borderColor]="foodInputFocus ? '#2166af' : '#cfd8dc'"
        />
      </div>

      <div style="margin-bottom: 16px;">
        <label for="calorieInput" style="display: block; font-weight: 500; margin-bottom: 5px;">कॅलरीज:</label>
        <input 
          id="calorieInput"
          type="number"
          min="0"
          [(ngModel)]="calories"
          placeholder="उदा. 250"
          style="
            padding: 10px; 
            width: 100%; 
            border-radius: 8px; 
            border: 1.5px solid #cfd8dc; 
            background: #f9fbfc; 
            font-size: 16px;
            transition: border-color 0.2s;
          "
          (focus)="calorieInputFocus=true"
          (blur)="calorieInputFocus=false"
          [style.borderColor]="calorieInputFocus ? '#2166af' : '#cfd8dc'"
        />
      </div>

      <button 
        (click)="addFood()" 
        style="
          width: 100%;
          padding: 12px 0;
          border-radius: 8px;
          background: linear-gradient(90deg, #2166af 60%, #43a047 100%);
          color: #fff;
          font-size: 17px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 2px 8px rgba(33,102,175,0.07);
        "
        [disabled]="!foodItem || calories === null || calories < 0"
        [style.opacity]="(!foodItem || calories === null || calories < 0) ? 0.7 : 1"
      >जोडा</button>
      
      <div *ngIf="foodList.length > 0" style="margin-top: 30px;">
        <h3 style="
          margin-bottom: 15px; 
          color: #2166af; 
          font-size: 19px;
          font-weight: 600;
          text-align: left;
        ">
          खाल्लेले भोजन {{ selectedDate | date: 'fullDate' }} रोजी:
        </h3>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li 
            *ngFor="let food of foodList" 
            style="
              background: #e3f2fd;
              margin-bottom: 10px;
              padding: 13px 15px;
              border-radius: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 16px;
              font-weight: 500;
              box-shadow: 0 1px 4px rgba(33,102,175,0.04);
            "
          >
            <span>{{ food.name }}</span>
            <span style="color: #43a047;">{{ food.calories }} कॅलरीज</span>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    @media (max-width: 500px) {
      div[style*="max-width: 400px"] {
        max-width: 98vw !important;
        padding: 16px 4vw 12px 4vw !important;
      }
      h2 { font-size: 21px !important; }
      h3 { font-size: 16px !important; }
    }
  `]
})
export class TestProject57Component extends CommonExternalComponent {
  foodItem: string = '';
  calories: number | null = null;
  foodList: FoodEntry[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];

  // Input focus states for dynamic border color
  inputFocus: boolean = false;
  foodInputFocus: boolean = false;
  calorieInputFocus: boolean = false;

  addFood(): void {
    if (this.foodItem && this.calories !== null && this.calories >= 0) {
      this.foodList.push({ name: this.foodItem, calories: this.calories });
      this.foodItem = '';
      this.calories = null;
    }
  }
}