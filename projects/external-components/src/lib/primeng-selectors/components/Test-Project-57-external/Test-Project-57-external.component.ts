import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-test-project-57',
  template: `
    <div style="padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <h2 style="text-align: center;">Recipe Storage</h2>
      <form (submit)="addRecipe()" style="display: flex; flex-direction: column; gap: 10px;">
        <input type="text" [(ngModel)]="recipeName" placeholder="Recipe Name" required 
               style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;" />
        <textarea [(ngModel)]="recipeInstructions" placeholder="Instructions" required 
                  style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
        <button type="submit" style="padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 5px;">Add Recipe</button>
      </form>
      <ul style="list-style-type: none; padding: 0;">
        <li *ngFor="let recipe of recipes" style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          <strong>{{ recipe.name }}</strong>
          <p>{{ recipe.instructions }}</p>
        </li>
      </ul>
    </div>
  `,
  styles: []
})
export class TestProject57Component extends CommonExternalComponent {
  recipeName: string = '';
  recipeInstructions: string = '';
  recipes: Array<{ name: string, instructions: string }> = [];

  addRecipe() {
    if (this.recipeName && this.recipeInstructions) {
      this.recipes.push({ name: this.recipeName, instructions: this.recipeInstructions });
      this.recipeName = '';
      this.recipeInstructions = '';
    }
  }
}