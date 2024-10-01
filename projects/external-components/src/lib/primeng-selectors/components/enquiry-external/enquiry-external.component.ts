import { Component } from '@angular/core';

@Component({
  selector: 'app-enquiry-form',
  template: `
    <div class="enquiry-form-container">
      <h2>Real Estate Enquiry Form</h2>
      <form (ngSubmit)="onSubmit()" #enquiryForm="ngForm">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" required [(ngModel)]="enquiry.name" name="name" />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" required [(ngModel)]="enquiry.email" name="email" />
        </div>

        <div class="form-group">
          <label for="phone">Phone:</label>
          <input type="tel" id="phone" required [(ngModel)]="enquiry.phone" name="phone" />
        </div>

        <div class="form-group">
          <label for="message">Message:</label>
          <textarea id="message" required [(ngModel)]="enquiry.message" name="message"></textarea>
        </div>

        <button type="submit" [disabled]="!enquiryForm.form.valid">Submit Enquiry</button>
      </form>
    </div>
  `,
  styles: [`
    .enquiry-form-container {
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
    input, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
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
    email: '',
    phone: '',
    message: ''
  };

  onSubmit() {
    console.log('Enquiry submitted:', this.enquiry);
    // Handle form submission logic here
  }
}