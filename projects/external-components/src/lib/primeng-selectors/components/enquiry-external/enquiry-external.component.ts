import { Component } from '@angular/core';

@Component({
  selector: 'app-enquiry-form',
  template: `
    <div class="enquiry-form">
      <h2>Computer Store Enquiry Form</h2>
      <form (ngSubmit)="onSubmit()" #enquiryForm="ngForm">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" required [(ngModel)]="enquiry.name" name="name" />
        </div>

        <div class="form-group">
          <label for="mobile">Mobile Number:</label>
          <input type="tel" id="mobile" required [(ngModel)]="enquiry.mobile" name="mobile" />
        </div>

        <div class="form-group">
          <label for="computerType">Type of Computer:</label>
          <select id="computerType" required [(ngModel)]="enquiry.computerType" name="computerType">
            <option value="" disabled selected>Select...</option>
            <option value="laptop">Laptop</option>
            <option value="desktop">Desktop</option>
            <option value="gaming">Gaming PC</option>
            <option value="workstation">Workstation</option>
          </select>
        </div>

        <div class="form-group">
          <label for="budget">Budget:</label>
          <input type="number" id="budget" required [(ngModel)]="enquiry.budget" name="budget" />
        </div>

        <div class="form-group">
          <label for="purchaseTiming">How soon are you planning to purchase?</label>
          <select id="purchaseTiming" required [(ngModel)]="enquiry.purchaseTiming" name="purchaseTiming">
            <option value="" disabled selected>Select...</option>
            <option value="immediate">Immediately</option>
            <option value="within-a-month">Within a month</option>
            <option value="more-than-a-month">More than a month</option>
          </select>
        </div>

        <button type="submit" [disabled]="!enquiryForm.form.valid">Submit</button>
      </form>
    </div>
  `,
  styles: [`
    .enquiry-form {
      max-width: 400px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input, select {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }
    button {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #ccc;
    }
  `]
})
export class EnquiryFormComponent {
  enquiry = {
    name: '',
    mobile: '',
    computerType: '',
    budget: null,
    purchaseTiming: ''
  };

  onSubmit() {
    console.log('Enquiry submitted:', this.enquiry);
    // Handle form submission logic here
  }
}