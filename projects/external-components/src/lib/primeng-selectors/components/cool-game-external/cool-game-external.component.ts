import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'cool-game',
  template: `
    <div class="game-container">
      <h2>Tic Tac Toe</h2>
      <div class="board">
        <div 
          *ngFor="let cell of board; let i = index" 
          class="cell"
          [class.winner]="winnerCells.includes(i)"
          (click)="makeMove(i)">
          {{ cell }}
        </div>
      </div>
      <div class="info">
        <span *ngIf="!winner && !isDraw">Current Player: {{ currentPlayer }}</span>
        <span *ngIf="winner">Winner: {{ winner }}</span>
        <span *ngIf="isDraw && !winner">It's a draw!</span>
      </div>
      <button class="reset-btn" (click)="resetGame()">Reset Game</button>
    </div>
  `,
  styles: [`
    .game-container {
      max-width: 320px;
      margin: 40px auto;
      padding: 24px;
      border-radius: 12px;
      background: #f7fafc;
      box-shadow: 0 2px 16px rgba(60, 60, 60, 0.1);
      text-align: center;
      font-family: 'Segoe UI', sans-serif;
    }
    h2 {
      margin-bottom: 18px;
      color: #333;
    }
    .board {
      display: grid;
      grid-template-columns: repeat(3, 64px);
      grid-gap: 8px;
      margin-bottom: 20px;
      justify-content: center;
    }
    .cell {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      background: #fff;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      user-select: none;
    }
    .cell:hover:not(.winner):not([disabled]) {
      background: #edf2fb;
    }
    .cell.winner {
      background: #90cdf4;
      color: #2a4365;
      font-weight: bold;
      animation: blink 0.6s linear infinite alternate;
    }
    @keyframes blink {
      0% { filter: brightness(1); }
      100% { filter: brightness(1.25); }
    }
    .info {
      min-height: 32px;
      margin-bottom: 14px;
      font-size: 1.1rem;
      color: #444;
    }
    .reset-btn {
      background: #4299e1;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 22px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .reset-btn:hover {
      background: #2b6cb0;
    }
  `]
})
export class CoolGameComponent extends CommonExternalComponent {
  board: string[] = Array(9).fill('');
  currentPlayer: string = 'X';
  winner: string | null = null;
  isDraw: boolean = false;
  winnerCells: number[] = [];

  makeMove(index: number): void {
    if (this.board[index] || this.winner) return;
    this.board[index] = this.currentPlayer;
    if (this.checkWinner()) {
      this.winner = this.currentPlayer;
    } else if (this.board.every(cell => cell)) {
      this.isDraw = true;
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  checkWinner(): boolean {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // columns
      [0,4,8], [2,4,6]           // diagonals
    ];
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.winnerCells = pattern;
        return true;
      }
    }
    this.winnerCells = [];
    return false;
  }

  resetGame(): void {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.winner = null;
    this.isDraw = false;
    this.winnerCells = [];
  }
}