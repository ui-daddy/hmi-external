import { Component } from '@angular/core';

@Component({
  selector: 'app-lead-capture',
  template: `
    <div class="lead-capture-container">
      <h1>Capture Your Lead</h1>
      <form (ngSubmit)="onSubmit()" #leadForm="ngForm">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" required [(ngModel)]="lead.name" name="name" />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" required [(ngModel)]="lead.email" name="email" />
        </div>
        <div class="form-group">
          <label for="message">Message:</label>
          <textarea id="message" required [(ngModel)]="lead.message" name="message"></textarea>
        </div>
        <button type="submit" [disabled]="!leadForm.form.valid">Submit</button>
      </form>
      <div *ngIf="submitted" class="success-message">
        Thank you for your submission!
      </div>
    </div>
  `,
  styles: [`
    .lead-capture-container {
      max-width: 400px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      text-align: center;
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
      width: 100%;
      padding: 10px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #ccc;
    }
    .success-message {
      margin-top: 20px;
      color: green;
      text-align: center;
    }
  `]
})
export class LeadCaptureComponent {
  lead = {
    name: '',
    email: '',
    message: ''
  };
  submitted = false;

  onSubmit() {
    this.submitted = true;
    console.log('Lead submitted:', this.lead);
    // You can add further logic to handle the lead submission here
  }
}