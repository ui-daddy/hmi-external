// ConsoleComponent: Mobile-first Building Block Stacking Game for Angular 18+
// Features:
// - Single blocks fall from top, stack up; fill a row to clear it
// - Touch-friendly controls, minimal UI, responsive board
// - Score increases per cleared row, game over when stack reaches top

import { Component, HostListener } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

type Block = { filled: boolean; color: string };
type Position = { x: number; y: number };

const COLORS: string[] = ['#4FC3F7', '#81C784', '#FFD54F', '#E57373', '#BA68C8'];

@Component({
  selector: 'app-console',
  template: `
    <div class="outer-container">
      <div class="game-container" [style.width.px]="boardPxWidth" [style.height.px]="boardPxHeight + 70">
        <div class="score">Score: {{ score }}</div>
        <div class="board" [style.width.px]="boardPxWidth" [style.height.px]="boardPxHeight">
          <div *ngFor="let row of board; let y = index" class="row">
            <div *ngFor="let block of row; let x = index"
                 class="cell"
                 [ngStyle]="{'background': getBlockColor(x, y)}">
            </div>
          </div>
          <ng-container *ngIf="!running">
            <div class="overlay">
              <button (click)="startGame()" class="btn-primary">{{ gameOver ? 'Restart' : 'Start' }}</button>
              <div *ngIf="gameOver" class="over-txt">Game Over</div>
            </div>
          </ng-container>
        </div>
        <div class="controls">
          <button aria-label="Left" class="control-btn" (touchstart)="move(-1)" (mousedown)="move(-1)">&#8592;</button>
          <button aria-label="Drop" class="control-btn" (touchstart)="drop()" (mousedown)="drop()">&#8595;</button>
          <button aria-label="Right" class="control-btn" (touchstart)="move(1)" (mousedown)="move(1)">&#8594;</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      background: #222;
      overflow: hidden;
      touch-action: manipulation;
      user-select: none;
    }
    .outer-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
    }
    .game-container {
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: transparent;
      padding: 0;
      margin: 0;
      min-width: 0;
      min-height: 0;
    }
    .score {
      color: #fff;
      font-size: clamp(16px, 4vw, 32px);
      margin-bottom: 2vw;
      text-align: center;
      font-weight: bold;
      letter-spacing: 1px;
    }
    .board {
      position: relative;
      display: flex;
      flex-direction: column;
      background: #111;
      border-radius: 1vw;
      overflow: hidden;
      box-shadow: 0 1vw 3vw rgba(0,0,0,0.45);
      margin-bottom: 2vw;
      padding: 0;
      touch-action: manipulation;
    }
    .row {
      display: flex;
      flex-direction: row;
    }
    .cell {
      width: var(--cell-size, 28px);
      height: var(--cell-size, 28px);
      background: #333;
      border: 1px solid #222;
      box-sizing: border-box;
      transition: background 0.1s;
    }
    .controls {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      gap: 3vw;
      margin-top: 0.5vw;
    }
    .control-btn {
      flex: 1 1 0;
      font-size: clamp(24px, 6vw, 44px);
      background: #444;
      color: #fff;
      border: none;
      border-radius: 1vw;
      margin: 0 1vw;
      padding: 2vw 0;
      box-shadow: 0 0.5vw 2vw rgba(0,0,0,0.18);
      transition: background 0.15s;
      outline: none;
      touch-action: manipulation;
    }
    .control-btn:active {
      background: #2196F3;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(30,30,40,0.89);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      flex-direction: column;
    }
    .btn-primary {
      font-size: clamp(20px, 5vw, 36px);
      background: #43A047;
      color: #fff;
      border: none;
      border-radius: 1vw;
      padding: 2vw 8vw;
      font-weight: bold;
      letter-spacing: 1px;
      box-shadow: 0 1vw 3vw rgba(0,0,0,0.18);
      cursor: pointer;
      outline: none;
      margin-bottom: 2vw;
    }
    .over-txt {
      color: #FFD54F;
      font-size: clamp(22px, 6vw, 40px);
      font-weight: bold;
      margin-top: 2vw;
      text-shadow: 0 1vw 2vw #000;
    }
    @media (max-width: 600px) {
      .game-container {
        width: 100vw !important;
      }
      .controls {
        max-width: 98vw;
        gap: 2vw;
      }
      .cell {
        border-width: 1px;
      }
    }
    @media (max-width: 400px) {
      .board { border-radius: 0.5vw; }
      .btn-primary { padding: 2vw 4vw; }
    }
  `]
})
export class ConsoleComponent extends CommonExternalComponent {
  readonly rows: number = 16;
  readonly cols: number = 8;
  readonly minCellSize: number = 22;
  readonly maxCellSize: number = 38;

  board: Block[][] = [];
  running: boolean = false;
  intervalId: ReturnType<typeof setTimeout> | null = null;
  dropSpeed: number = 440;
  score: number = 0;

  // Only one falling block at a time
  pieceX: number = 0;
  pieceY: number = 0;
  pieceColor: string = '';
  gameOver: boolean = false;

  boardPxWidth: number = 0;
  boardPxHeight: number = 0;

  constructor() {
    super();
    this.setBoardSize();
    this.resetBoard();
  }

  ngOnInit(): void {
    this.setBoardSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setBoardSize();
  }

  setBoardSize(): void {
    const vw: number = window.innerWidth;
    const vh: number = window.innerHeight;
    const controlSpace: number = Math.max(84, vh * 0.13);
    const availableH: number = vh - controlSpace;
    const availableW: number = vw * 0.99;
    const cellW: number = Math.floor(availableW / this.cols);
    const cellH: number = Math.floor(availableH / this.rows);
    const cellSize: number = Math.max(this.minCellSize, Math.min(this.maxCellSize, Math.min(cellW, cellH)));
    this.boardPxWidth = cellSize * this.cols;
    this.boardPxHeight = cellSize * this.rows;
    document.documentElement.style.setProperty('--cell-size', `${cellSize}px`);
  }

  resetBoard(): void {
    this.board = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({ filled: false, color: '' }))
    );
    this.score = 0;
    this.running = false;
    this.gameOver = false;
    if (this.intervalId) clearTimeout(this.intervalId);
    this.clearPiece();
  }

  startGame(): void {
    this.resetBoard();
    this.running = true;
    this.spawnPiece();
    this.gameLoop();
  }

  gameLoop(): void {
    if (!this.running) return;
    this.intervalId = setTimeout(() => {
      if (!this.movePiece(0, 1)) {
        this.lockPiece();
        this.clearLines();
        if (!this.spawnPiece()) {
          this.running = false;
          this.gameOver = true;
          if (this.intervalId) clearTimeout(this.intervalId);
          return;
        }
      }
      this.gameLoop();
    }, this.dropSpeed);
  }

  spawnPiece(): boolean {
    this.pieceX = Math.floor(this.cols / 2);
    this.pieceY = 0;
    this.pieceColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    // If spawn collides, game over
    if (this.board[this.pieceY][this.pieceX].filled) {
      return false;
    }
    return true;
  }

  move(dir: number): void {
    if (!this.running) return;
    this.movePiece(dir, 0);
  }

  drop(): void {
    if (!this.running) return;
    while (this.movePiece(0, 1)) {}
  }

  movePiece(dx: number, dy: number): boolean {
    const newX: number = this.pieceX + dx;
    const newY: number = this.pieceY + dy;
    if (
      newX >= 0 && newX < this.cols &&
      newY >= 0 && newY < this.rows &&
      !this.board[newY][newX].filled
    ) {
      this.pieceX = newX;
      this.pieceY = newY;
      return true;
    }
    return false;
  }

  lockPiece(): void {
    if (this.pieceY >= 0 && this.pieceY < this.rows && this.pieceX >= 0 && this.pieceX < this.cols) {
      this.board[this.pieceY][this.pieceX] = { filled: true, color: this.pieceColor };
    }
  }

  clearLines(): void {
    let linesCleared: number = 0;
    for (let y = this.rows - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell.filled)) {
        this.board.splice(y, 1);
        this.board.unshift(Array.from({ length: this.cols }, () => ({ filled: false, color: '' })));
        linesCleared++;
        y++; // recheck current row after unshift
      }
    }
    if (linesCleared > 0) {
      this.score += linesCleared * 100;
    }
  }

  clearPiece(): void {
    this.pieceX = Math.floor(this.cols / 2);
    this.pieceY = 0;
    this.pieceColor = '';
  }

  getBlockColor(x: number, y: number): string {
    if (this.running && x === this.pieceX && y === this.pieceY) {
      return this.pieceColor;
    }
    return this.board[y][x].filled ? this.board[y][x].color : '#333';
  }
}