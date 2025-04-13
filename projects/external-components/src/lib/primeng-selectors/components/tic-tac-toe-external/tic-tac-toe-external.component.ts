import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-tic-tac-toe',
  template: `
    <div style="display: grid; grid-template-columns: repeat(3, 100px); gap: 5px;">
      <div *ngFor="let cell of cells; let i = index"
           (click)="makeMove(i)"
           [style.backgroundColor]="cell === 'X' ? 'lightcoral' : cell === 'O' ? 'lightblue' : 'lightgray'"
           style="width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer;">
        {{ cell }}
      </div>
    </div>
    <div *ngIf="winner" style="margin-top: 20px; font-size: 24px;">
      {{ winner }} wins!
    </div>
    <div *ngIf="isDraw()" style="margin-top: 20px; font-size: 24px;">
      It's a draw!
    </div>
    <button (click)="resetGame()" style="margin-top: 20px;">Reset Game</button>
  `,
  styles: []
})
export class TicTacToeComponent extends CommonExternalComponent {
  cells: string[] = Array(9).fill('');
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;

  makeMove(index: number): void {
    if (!this.cells[index] && !this.winner) {
      this.cells[index] = this.currentPlayer;
      if (this.checkWinner()) {
        this.winner = this.currentPlayer;
      } else if (this.isDraw()) {
        // Do nothing, draw message will be shown
      } else {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        if (this.currentPlayer === 'O') {
          this.computerMove();
        }
      }
    }
  }

  computerMove(): void {
    const availableMoves = this.cells.map((cell, index) => (cell === '' ? index : null)).filter(index => index !== null);
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const move = availableMoves[randomIndex];
    if (move !== null) {
      this.cells[move] = this.currentPlayer;
      if (this.checkWinner()) {
        this.winner = this.currentPlayer;
      } else if (this.isDraw()) {
        // Do nothing, draw message will be shown
      } else {
        this.currentPlayer = 'X'; // Switch back to player X
      }
    }
  }

  checkWinner(): boolean {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]            // diagonals
    ];

    return winningCombinations.some(combination => {
      const [a, b, c] = combination;
      return this.cells[a] && this.cells[a] === this.cells[b] && this.cells[a] === this.cells[c];
    });
  }

  isDraw(): boolean {
    return this.cells.every(cell => cell !== '') && !this.winner;
  }

  resetGame(): void {
    this.cells.fill('');
    this.currentPlayer = 'X';
    this.winner = null;
  }
}