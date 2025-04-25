import { Component, HostListener, OnInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-emi-calculator',
  template: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <h2 style="margin-bottom: 8px;">Building Block Game</h2>
      <div 
        [style.width.px]="COLS*blockSize"
        [style.height.px]="ROWS*blockSize"
        style="background: #222; border: 3px solid #444; position: relative; overflow: hidden;"
      >
        <!-- Draw placed blocks -->
        <div *ngFor="let cell of getFilledCells(); let i = index"
          [style.left.px]="cell.col * blockSize"
          [style.top.px]="cell.row * blockSize"
          [style.background]="cell.color"
          [style.width.px]="blockSize"
          [style.height.px]="blockSize"
          style="position: absolute; box-sizing: border-box; border: 1px solid #111;">
        </div>

        <!-- Draw current falling shape -->
        <div *ngFor="let pos of getCurrentShapePositions()"
          [style.left.px]="pos.col * blockSize"
          [style.top.px]="pos.row * blockSize"
          [style.background]="currentShape.color"
          [style.width.px]="blockSize"
          [style.height.px]="blockSize"
          style="position: absolute; box-sizing: border-box; border: 1px solid #fff;">
        </div>

        <!-- Overlay for pause -->
        <div *ngIf="paused" 
          style="
            position:absolute;top:0;left:0;width:100%;height:100%;
            background:rgba(0,0,0,0.65);z-index:10;
            display:flex;align-items:center;justify-content:center;
            color:#fff;font-size:2rem;font-weight:bold;
          ">
          Paused
        </div>
      </div>
      <div style="margin-top: 12px; display: flex; gap: 8px;">
        <button (click)="resetGame()" style="padding: 6px 18px;">Restart</button>
        <button *ngIf="!paused && !gameOver" (click)="pauseGame()" style="padding: 6px 18px;">Pause</button>
        <button *ngIf="paused && !gameOver" (click)="resumeGame()" style="padding: 6px 18px;">Resume</button>
      </div>
      <div style="margin-top: 10px; color: #0c0;">Score: {{ score }}</div>
      <div style="color: #e00;" *ngIf="gameOver">Game Over!</div>
      <div style="margin-top:8px;color:#888;font-size:13px;">
        Controls: ← → ↓ to move, ↑ to rotate
      </div>
      <!-- Mobile Controls -->
      <div style="margin-top:14px; display: flex; flex-direction: column; align-items: center; width: 100%;">
        <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 8px;">
          <button (touchstart)="moveLeft()" style="width:48px;height:48px;font-size:1.5rem;">&#8592;</button>
          <button (touchstart)="rotate()" style="width:48px;height:48px;font-size:1.5rem;">&#8635;</button>
          <button (touchstart)="moveRight()" style="width:48px;height:48px;font-size:1.5rem;">&#8594;</button>
        </div>
        <div style="display: flex; justify-content: center;">
          <button (touchstart)="moveDown()" style="width:48px;height:48px;font-size:1.5rem;">&#8595;</button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class EmiCalculatorComponent extends CommonExternalComponent implements OnInit {
  readonly ROWS = 20;
  readonly COLS = 10;
  readonly blockSize = 28;

  board: (string | null)[][] = [];
  shapes = [
    // I
    { blocks: [[0, -1], [0, 0], [0, 1], [0, 2]], color: '#00f0f0' },
    // J
    { blocks: [[-1, -1], [0, -1], [0, 0], [0, 1]], color: '#0000f0' },
    // L
    { blocks: [[1, -1], [0, -1], [0, 0], [0, 1]], color: '#f0a000' },
    // O
    { blocks: [[0, 0], [0, 1], [1, 0], [1, 1]], color: '#f0f000' },
    // S
    { blocks: [[0, 0], [0, 1], [1, -1], [1, 0]], color: '#00f000' },
    // T
    { blocks: [[-1, 0], [0, -1], [0, 0], [0, 1]], color: '#a000f0' },
    // Z
    { blocks: [[0, -1], [0, 0], [1, 0], [1, 1]], color: '#f00000' },
  ];

  currentShape: any;
  currentRow: number = 0;
  currentCol: number = 0;
  gameInterval: any;
  intervalTime: number = 400;
  score: number = 0;
  gameOver: boolean = false;
  paused: boolean = false;

  ngOnInit() {
    this.resetGame();
  }

  resetGame() {
    this.board = Array.from({ length: this.ROWS }, () =>
      Array(this.COLS).fill(null)
    );
    this.score = 0;
    this.gameOver = false;
    this.paused = false;
    this.spawnShape();
    if (this.gameInterval) clearInterval(this.gameInterval);
    this.startInterval();
  }

  startInterval() {
    this.gameInterval = setInterval(() => {
      if (!this.paused && !this.gameOver) {
        this.moveDown();
      }
    }, this.intervalTime);
  }

  pauseGame() {
    this.paused = true;
  }

  resumeGame() {
    this.paused = false;
  }

  spawnShape() {
    const idx = Math.floor(Math.random() * this.shapes.length);
    this.currentShape = JSON.parse(JSON.stringify(this.shapes[idx]));
    this.currentRow = 1;
    this.currentCol = Math.floor(this.COLS / 2);
    if (this.isCollision(this.currentRow, this.currentCol, this.currentShape.blocks)) {
      this.gameOver = true;
      clearInterval(this.gameInterval);
    }
  }

  getCurrentShapePositions() {
    return this.currentShape.blocks.map((b: number[]) => ({
      row: this.currentRow + b[0],
      col: this.currentCol + b[1],
    }));
  }

  getFilledCells() {
    let cells: { row: number; col: number; color: string }[] = [];
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (this.board[r][c]) {
          cells.push({ row: r, col: c, color: this.board[r][c]! });
        }
      }
    }
    return cells;
  }

  isCollision(row: number, col: number, blocks: number[][]) {
    for (const b of blocks) {
      const r = row + b[0];
      const c = col + b[1];
      if (
        r < 0 ||
        r >= this.ROWS ||
        c < 0 ||
        c >= this.COLS ||
        (this.board[r] && this.board[r][c])
      ) {
        return true;
      }
    }
    return false;
  }

  placeShape() {
    for (const b of this.currentShape.blocks) {
      const r = this.currentRow + b[0];
      const c = this.currentCol + b[1];
      if (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS) {
        this.board[r][c] = this.currentShape.color;
      }
    }
    this.clearFullRows();
    this.spawnShape();
  }

  clearFullRows() {
    let rowsCleared = 0;
    for (let r = this.ROWS - 1; r >= 0; r--) {
      if (this.board[r].every(cell => !!cell)) {
        this.board.splice(r, 1);
        this.board.unshift(Array(this.COLS).fill(null));
        rowsCleared++;
        r++; // Check same row again after unshift
      }
    }
    if (rowsCleared > 0) {
      this.score += rowsCleared * 100;
    }
  }

  moveDown() {
    if (this.gameOver || this.paused) return;
    if (!this.isCollision(this.currentRow + 1, this.currentCol, this.currentShape.blocks)) {
      this.currentRow++;
    } else {
      this.placeShape();
    }
  }

  moveLeft() {
    if (this.gameOver || this.paused) return;
    if (!this.isCollision(this.currentRow, this.currentCol - 1, this.currentShape.blocks)) {
      this.currentCol--;
    }
  }

  moveRight() {
    if (this.gameOver || this.paused) return;
    if (!this.isCollision(this.currentRow, this.currentCol + 1, this.currentShape.blocks)) {
      this.currentCol++;
    }
  }

  rotate() {
    if (this.gameOver || this.paused) return;
    if (this.currentShape.blocks.length === 4 && this.currentShape !== this.shapes[3]) {
      // Don't rotate O shape
      const rotated = this.currentShape.blocks.map(([r, c]: number[]) => [-c, r]);
      if (!this.isCollision(this.currentRow, this.currentCol, rotated)) {
        this.currentShape.blocks = rotated;
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (this.gameOver || this.paused) return;
    switch (event.key) {
      case 'ArrowLeft':
        this.moveLeft();
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.moveRight();
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.moveDown();
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.rotate();
        event.preventDefault();
        break;
    }
  }
}