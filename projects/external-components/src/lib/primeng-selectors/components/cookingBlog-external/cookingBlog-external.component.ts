import { Component } from '@angular/core';

@Component({
  selector: 'app-paneer-butter-masala',
  template: `
    <div class="recipe-container">
      <h1>Paneer Butter Masala</h1>
      <img src="https://example.com/paneer-butter-masala.jpg" alt="Paneer Butter Masala" class="recipe-image"/>
      <h2>Ingredients:</h2>
      <ul>
        <li>250g Paneer (cottage cheese)</li>
        <li>2 tablespoons butter</li>
        <li>1 tablespoon oil</li>
        <li>1 large onion, finely chopped</li>
        <li>2 tomatoes, pureed</li>
        <li>1 teaspoon ginger-garlic paste</li>
        <li>1/2 cup cream</li>
        <li>1 teaspoon garam masala</li>
        <li>1 teaspoon red chili powder</li>
        <li>Salt to taste</li>
        <li>Fresh coriander leaves for garnish</li>
      </ul>

      <h2>Instructions:</h2>
      <ol>
        <li>Heat butter and oil in a pan over medium heat.</li>
        <li>Add chopped onions and sauté until golden brown.</li>
        <li>Stir in ginger-garlic paste and cook for a minute.</li>
        <li>Add tomato puree, red chili powder, and salt. Cook until oil separates.</li>
        <li>Add paneer cubes and mix gently.</li>
        <li>Pour in the cream and sprinkle garam masala. Stir well.</li>
        <li>Simmer for 5 minutes on low heat.</li>
        <li>Garnish with fresh coriander leaves and serve hot with naan or rice.</li>
      </ol>
    </div>
  `,
  styles: [`
    .recipe-container {
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    h1 {
      text-align: center;
      color: #d9534f;
    }
    .recipe-image {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }
    ul, ol {
      margin-left: 20px;
    }
    li {
      margin-bottom: 10px;
    }
  `]
})
export class PaneerButterMasalaComponent {}