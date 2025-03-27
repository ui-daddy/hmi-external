import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-tic-tac-toe',
  template: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <h1 style="font-size: 2em;">Tic Tac Toe</h1>
      <div style="display: grid; grid-template-columns: repeat(3, 100px); gap: 5px;">
        <button *ngFor="let cell of cells; let i = index" 
                (click)="makeMove(i)" 
                [disabled]="isGameOver || cell !== null"
                style="width: 100px; height: 100px; font-size: 2em;">
          {{ cell }}
        </button>
      </div>
      <p style="margin-top: 20px; font-size: 1.5em;">Current Player: {{ currentPlayer }}</p>
      <p *ngIf="winner" style="font-size: 1.5em; color: green;">Winner: {{ winner }}</p>
      <button (click)="resetGame()" style="margin-top: 20px;">Reset Game</button>
    </div>
  `,
  styles: [`
    button {
      cursor: pointer;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #e0e0e0;
    }
  `]
})
export class TicTacToeComponent extends CommonExternalComponent {
  cells: Array<string | null> = Array(9).fill(null);
  currentPlayer: string = 'X';
  winner: string | null = null;
  isGameOver: boolean = false;

  makeMove(index: number): void {
    if (!this.cells[index] && !this.isGameOver) {
      this.cells[index] = this.currentPlayer;
      if (this.checkWinner(this.currentPlayer)) {
        this.winner = this.currentPlayer;
        this.isGameOver = true;
        return;
      }
      this.currentPlayer = 'O'; // Computer's turn
      this.computerMove();
    }
  }

  computerMove(): void {
    const availableCells: number[] = this.cells.map((cell, index) => (cell === null ? index : -1)).filter(index => index !== -1);
    if (availableCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      this.cells[availableCells[randomIndex]] = 'O';
      if (this.checkWinner('O')) {
        this.winner = 'O';
        this.isGameOver = true;
      } else {
        this.currentPlayer = 'X'; // Back to player's turn
      }
    }
  }

  checkWinner(player: string): boolean {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return winningCombinations.some(combination => 
      combination.every(index => this.cells[index] === player)
    );
  }

  resetGame(): void {
    this.cells.fill(null);
    this.currentPlayer = 'X';
    this.winner = null;
    this.isGameOver = false;
  }
}