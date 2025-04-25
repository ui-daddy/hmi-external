// ConsoleComponent: Responsive Tetris-like Game Component for Angular 18+
// Features: 
// - Fully responsive board always visible on all screen sizes
// - Inline HTML & CSS, strict typing, extends CommonExternalComponent
// - Keyboard and touch controls, score tracking, mobile-friendly UI

import { Component, HostListener } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

type Block = { filled: boolean; color: string };
type Position = { x: number; y: number };

const COLORS: string[] = ['#4FC3F7', '#81C784', '#FFD54F', '#E57373', '#BA68C8'];
const SHAPES: Position[][] = [
  // I
  [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
  // O
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
  // T
  [{ x: 0, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
  // L
  [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  // J
  [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  // S
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }],
  // Z
  [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
];

@Component({
  selector: 'app-console',
  template: `
    <div class="outer-container">
      <div class="game-container" [style.width.px]="boardPxWidth" [style.height.px]="boardPxHeight">
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
              <button (click)="startGame()" class="btn-primary">Start</button>
            </div>
          </ng-container>
        </div>
        <div class="controls">
          <button aria-label="Left" class="control-btn" (touchstart)="move(-1)" (mousedown)="move(-1)">&#8592;</button>
          <button aria-label="Rotate" class="control-btn" (touchstart)="rotate()" (mousedown)="rotate()">&#8635;</button>
          <button aria-label="Right" class="control-btn" (touchstart)="move(1)" (mousedown)="move(1)">&#8594;</button>
          <button aria-label="Down" class="control-btn" (touchstart)="softDrop()" (mousedown)="softDrop()">&#8595;</button>
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
      /* Remove vertical padding to maximize fit */
    }
    .score {
      color: #fff;
      font-size: clamp(16px, 3.5vw, 32px);
      margin-bottom: 1vw;
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
    }
    .row {
      display: flex;
      flex-direction: row;
    }
    .cell {
      width: var(--cell-size, 24px);
      height: var(--cell-size, 24px);
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
      max-width: 340px;
      margin: 0 auto;
      gap: 2vw;
    }
    .control-btn {
      flex: 1 1 0;
      font-size: clamp(20px, 5vw, 36px);
      background: #444;
      color: #fff;
      border: none;
      border-radius: 1vw;
      margin: 0 0.5vw;
      padding: 1vw 0;
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
      background: rgba(30,30,40,0.87);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      flex-direction: column;
    }
    .btn-primary {
      font-size: clamp(18px, 4vw, 34px);
      background: #43A047;
      color: #fff;
      border: none;
      border-radius: 1vw;
      padding: 1vw 4vw;
      font-weight: bold;
      letter-spacing: 1px;
      box-shadow: 0 1vw 3vw rgba(0,0,0,0.18);
      cursor: pointer;
      outline: none;
    }
    @media (max-width: 600px) {
      .game-container {
        width: 100vw !important;
      }
      .controls {
        max-width: 95vw;
      }
      .cell {
        border-width: 1px;
      }
    }
    @media (max-width: 400px) {
      .board { border-radius: 0.5vw; }
    }
  `]
})
export class ConsoleComponent extends CommonExternalComponent {
  readonly rows: number = 18;
  readonly cols: number = 10;
  readonly minCellSize: number = 18; // px, smaller minimum for small screens
  readonly maxCellSize: number = 38; // px, slightly larger for big screens

  board: Block[][] = [];
  running: boolean = false;
  intervalId: ReturnType<typeof setTimeout> | null = null;
  dropSpeed: number = 430;
  score: number = 0;

  pieceShape: Position[] = [];
  pieceColor: string = '';
  piecePos: Position = { x: 4, y: 0 };

  nextShape: Position[] = [];
  nextColor: string = '';

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
    // Responsive logic: Fit board to viewport, reserve space for controls/score
    const vw: number = window.innerWidth;
    const vh: number = window.innerHeight;

    // Estimate available height: 
    // - Controls: ~60px, Score: ~36px, Margins: ~16px
    // - Use 90% of height for game area, but never overflow
    const controlSpace: number = Math.max(64, vh * 0.11);
    const availableH: number = vh - controlSpace;
    const availableW: number = vw * 0.98;

    // Calculate cell size to fit both width and height
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
    this.clearPiece();
    this.nextShape = this.randomShape();
    this.nextColor = this.randomColor();
    if (this.intervalId) clearTimeout(this.intervalId);
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
          if (this.intervalId) clearTimeout(this.intervalId);
          return;
        }
      }
      this.gameLoop();
    }, this.dropSpeed);
  }

  spawnPiece(): boolean {
    this.pieceShape = this.nextShape;
    this.pieceColor = this.nextColor;
    this.piecePos = { x: 4, y: 0 };
    this.nextShape = this.randomShape();
    this.nextColor = this.randomColor();
    if (this.collides(this.pieceShape, this.piecePos)) {
      return false;
    }
    return true;
  }

  randomShape(): Position[] {
    const idx: number = Math.floor(Math.random() * SHAPES.length);
    return SHAPES[idx].map(p => ({ ...p }));
  }

  randomColor(): string {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  move(dir: number): void {
    if (!this.running) return;
    this.movePiece(dir, 0);
  }

  softDrop(): void {
    if (!this.running) return;
    this.movePiece(0, 1);
  }

  rotate(): void {
    if (!this.running) return;
    const rotated: Position[] = this.pieceShape.map(({ x, y }) => ({ x: -y, y: x }));
    if (!this.collides(rotated, this.piecePos)) {
      this.pieceShape = rotated;
    }
  }

  movePiece(dx: number, dy: number): boolean {
    const newPos: Position = { x: this.piecePos.x + dx, y: this.piecePos.y + dy };
    if (!this.collides(this.pieceShape, newPos)) {
      this.piecePos = newPos;
      return true;
    }
    return false;
  }

  collides(shape: Position[], pos: Position): boolean {
    for (const part of shape) {
      const x: number = pos.x + part.x;
      const y: number = pos.y + part.y;
      if (
        x < 0 || x >= this.cols ||
        y < 0 || y >= this.rows ||
        (y >= 0 && this.board[y][x].filled)
      ) {
        return true;
      }
    }
    return false;
  }

  lockPiece(): void {
    for (const part of this.pieceShape) {
      const x: number = this.piecePos.x + part.x;
      const y: number = this.piecePos.y + part.y;
      if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
        this.board[y][x] = { filled: true, color: this.pieceColor };
      }
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
      this.score += [0, 100, 300, 700, 1500][linesCleared] ?? 0;
    }
  }

  clearPiece(): void {
    this.pieceShape = [];
    this.pieceColor = '';
    this.piecePos = { x: 4, y: 0 };
  }

  getBlockColor(x: number, y: number): string {
    // Draw falling piece
    if (this.running) {
      for (const part of this.pieceShape) {
        if (x === this.piecePos.x + part.x && y === this.piecePos.y + part.y) {
          return this.pieceColor;
        }
      }
    }
    return this.board[y][x].filled ? this.board[y][x].color : '#333';
  }
}