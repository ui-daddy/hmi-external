import { Component } from '@angular/core';

@Component({
  selector: 'app-asset-form',
  template: `
    <div class="container">
      <h2>Asset Details Form</h2>
      <form (ngSubmit)="onSubmit()" #assetForm="ngForm">
        <div class="form-group">
          <label for="assetName">Asset Name:</label>
          <input type="text" id="assetName" required [(ngModel)]="asset.name" name="name" class="form-control"/>
        </div>
        
        <div class="form-group">
          <label for="assetType">Asset Type:</label>
          <select id="assetType" required [(ngModel)]="asset.type" name="type" class="form-control">
            <option value="" disabled>Select Asset Type</option>
            <option *ngFor="let type of assetTypes" [value]="type">{{ type }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="purchaseDate">Purchase Date:</label>
          <input type="date" id="purchaseDate" required [(ngModel)]="asset.purchaseDate" name="purchaseDate" class="form-control"/>
        </div>

        <div class="form-group">
          <label for="cost">Cost:</label>
          <input type="number" id="cost" required [(ngModel)]="asset.cost" name="cost" class="form-control"/>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="!assetForm.form.valid">Submit</button>
      </form>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .btn {
      padding: 10px 15px;
    }
  `]
})
export class AssetFormComponent {
  asset = {
    name: '',
    type: '',
    purchaseDate: '',
    cost: null
  };

  assetTypes = ['Hardware', 'Software', 'License', 'Service'];

  onSubmit() {
    console.log('Asset Details:', this.asset);
    // Handle form submission logic here
  }
}