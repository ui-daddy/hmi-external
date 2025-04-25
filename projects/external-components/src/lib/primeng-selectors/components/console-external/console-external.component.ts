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
    <div class="game-container" [style.width.px]="boardPxWidth" [style.height.px]="boardPxHeight">
      <div class="score">Score: {{ score }}</div>
      <div class="board">
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
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      width: 100vw;
      height: 100vh;
      background: #222;
      overflow: hidden;
      touch-action: manipulation;
      user-select: none;
    }
    .game-container {
      margin: auto;
      position: relative;
      box-sizing: border-box;
      padding: 2vw 0 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .score {
      color: #fff;
      font-size: 4vw;
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
      border-radius: 2vw;
      overflow: hidden;
      box-shadow: 0 2vw 6vw rgba(0,0,0,0.45);
    }
    .row {
      display: flex;
      flex-direction: row;
    }
    .cell {
      width: var(--cell-size, 6vw);
      height: var(--cell-size, 6vw);
      background: #333;
      border: 0.2vw solid #222;
      box-sizing: border-box;
      transition: background 0.1s;
    }
    .controls {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 70vw;
      max-width: 350px;
      margin: 3vw auto 0 auto;
      gap: 2vw;
    }
    .control-btn {
      flex: 1 1 20vw;
      font-size: 6vw;
      background: #444;
      color: #fff;
      border: none;
      border-radius: 2vw;
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
      background: rgba(30,30,40,0.87);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      flex-direction: column;
    }
    .btn-primary {
      font-size: 5vw;
      background: #43A047;
      color: #fff;
      border: none;
      border-radius: 2vw;
      padding: 2vw 6vw;
      font-weight: bold;
      letter-spacing: 1px;
      box-shadow: 0 1vw 3vw rgba(0,0,0,0.18);
      cursor: pointer;
      outline: none;
    }
    @media (max-width: 400px) {
      .game-container { width: 100vw !important; }
      .board { border-radius: 1vw; }
      .controls { width: 95vw; }
      .cell { border-width: 0.12vw; }
    }
  `]
})
export class ConsoleComponent extends CommonExternalComponent {
  readonly rows: number = 18;
  readonly cols: number = 10;
  readonly minCellSize: number = 22; // px for iPhone mini
  readonly maxCellSize: number = 36; // px for larger screens

  board: Block[][] = [];
  running: boolean = false;
  intervalId: any = null;
  dropSpeed: number = 430; // ms
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
    const vw: number = Math.min(window.innerWidth, 430);
    const vh: number = Math.min(window.innerHeight, 800);

    // Reduced subtraction from 120px to 40px for proper fit
    const cellW: number = Math.max(this.minCellSize, Math.min(this.maxCellSize, Math.floor(vw / this.cols)));
    const cellH: number = Math.max(this.minCellSize, Math.min(this.maxCellSize, Math.floor((vh - 40) / this.rows)));
    const cellSize: number = Math.min(cellW, cellH);

    document.documentElement.style.setProperty('--cell-size', `${cellSize}px`);
    this.boardPxWidth = cellSize * this.cols;
    this.boardPxHeight = cellSize * this.rows;
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
          clearTimeout(this.intervalId);
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