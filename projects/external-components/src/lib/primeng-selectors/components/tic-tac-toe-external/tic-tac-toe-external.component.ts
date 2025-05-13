// tic-tac-toe.component.ts
// Features: 
// - Tic-Tac-Toe game with player vs computer (random moves)
// - Inline HTML and CSS, Angular 18 compatible
// - Gradient background for all squares based on cell value
// - Strict type checking

import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-tic-tac-toe',
  template: `
    <div style="display: grid; grid-template-columns: repeat(3, 100px); gap: 5px;">
      <div *ngFor="let cell of cells; let i = index"
           (click)="makeMove(i)"
           [ngStyle]="getCellStyle(cell)"
           style="width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; border-radius: 10px; transition: background 0.2s;">
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
  // Board cells, can be 'X', 'O', or ''
  cells: string[] = Array(9).fill('');
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;

  makeMove(index: number): void {
    if (!this.cells[index] && !this.winner) {
      this.cells[index] = this.currentPlayer;
      if (this.checkWinner()) {
        this.winner = this.currentPlayer;
      } else if (this.isDraw()) {
        // Draw state handled by template
      } else {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        if (this.currentPlayer === 'O') {
          this.computerMove();
        }
      }
    }
  }

  computerMove(): void {
    const availableMoves: number[] = this.cells
      .map((cell: string, idx: number) => cell === '' ? idx : -1)
      .filter((idx: number) => idx !== -1);
    const randomIndex: number = Math.floor(Math.random() * availableMoves.length);
    const move: number = availableMoves[randomIndex];
    if (move !== undefined) {
      this.cells[move] = this.currentPlayer;
      if (this.checkWinner()) {
        this.winner = this.currentPlayer;
      } else if (this.isDraw()) {
        // Draw state handled by template
      } else {
        this.currentPlayer = 'X';
      }
    }
  }

  checkWinner(): boolean {
    const winningCombinations: number[][] = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return winningCombinations.some((combination: number[]) => {
      const [a, b, c] = combination;
      return this.cells[a] && this.cells[a] === this.cells[b] && this.cells[a] === this.cells[c];
    });
  }

  isDraw(): boolean {
    return this.cells.every((cell: string) => cell !== '') && !this.winner;
  }

  resetGame(): void {
    this.cells = Array(9).fill('');
    this.currentPlayer = 'X';
    this.winner = null;
  }

  // Returns gradient style depending on the cell value
  getCellStyle(cell: string): { [key: string]: string } {
    if (cell === 'X') {
      return {
        background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)'
      };
    } else if (cell === 'O') {
      return {
        background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'
      };
    }
  }
}