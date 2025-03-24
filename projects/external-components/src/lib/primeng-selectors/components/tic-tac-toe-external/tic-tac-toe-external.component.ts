import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-tic-tac-toe',
  template: `
    <div style="text-align: center; margin-top: 20px;">
      <h1>Tic Tac Toe</h1>
      <div style="display: grid; grid-template-columns: repeat(3, 100px); gap: 5px; margin: auto;">
        <button *ngFor="let cell of cells; let i = index" 
                (click)="makeMove(i)" 
                [disabled]="cell !== ''" 
                style="width: 100px; height: 100px; font-size: 24px;">
          {{ cell }}
        </button>
      </div>
      <h2>Score: Player {{ playerScore }} - Computer {{ computerScore }}</h2>
      <button (click)="resetGame()" style="margin-top: 20px;">Reset Game</button>
    </div>
  `,
  styles: []
})
export class TicTacToeComponent extends CommonExternalComponent {
  cells: string[] = ['', '', '', '', '', '', '', '', ''];
  playerScore: number = 0;
  computerScore: number = 0;
  currentPlayer: string = 'X';

  makeMove(index: number) {
    if (this.cells[index] === '') {
      this.cells[index] = this.currentPlayer;
      if (this.checkWin(this.currentPlayer)) {
        this.playerScore++;
        alert('Player X wins!');
        this.resetGame();
      } else if (!this.cells.includes('')) {
        alert('It\'s a draw!');
        this.resetGame();
      } else {
        this.currentPlayer = 'O';
        this.computerMove();
      }
    }
  }

  computerMove() {
    const availableMoves = this.cells.map((cell, index) => cell === '' ? index : null).filter(v => v !== null);
    const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    if (randomIndex !== undefined) {
      this.cells[randomIndex] = this.currentPlayer;
      if (this.checkWin(this.currentPlayer)) {
        this.computerScore++;
        alert('Computer O wins!');
        this.resetGame();
      } else if (!this.cells.includes('')) {
        alert('It\'s a draw!');
        this.resetGame();
      } else {
        this.currentPlayer = 'X';
      }
    }
  }

  checkWin(player: string): boolean {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => pattern.every(index => this.cells[index] === player));
  }

  resetGame() {
    this.cells = ['', '', '', '', '', '', '', '', ''];
    this.currentPlayer = 'X';
  }
}