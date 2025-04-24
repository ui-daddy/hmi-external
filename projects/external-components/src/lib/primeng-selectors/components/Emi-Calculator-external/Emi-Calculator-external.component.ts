import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-block-game',
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
      </div>
      <div style="margin-top: 12px;">
        <button (click)="resetGame()" style="padding: 6px 18px;">Restart</button>
      </div>
      <div style="margin-top: 10px; color: #0c0;">Score: {{ score }}</div>
      <div style="color: #e00;" *ngIf="gameOver">Game Over!</div>
      <div style="margin-top:8px;color:#888;font-size:13px;">
        Controls: ← → ↓ to move, ↑ to rotate
      </div>
    </div>
  `,
  styles: [],
})
export class BlockGameComponent implements OnInit {
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

  ngOnInit() {
    this.resetGame();
  }

  resetGame() {
    this.board = Array.from({ length: this.ROWS }, () =>
      Array(this.COLS).fill(null)
    );
    this.score = 0;
    this.gameOver = false;
    this.spawnShape();
    if (this.gameInterval) clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => this.moveDown(), this.intervalTime);
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
    if (this.gameOver) return;
    if (!this.isCollision(this.currentRow + 1, this.currentCol, this.currentShape.blocks)) {
      this.currentRow++;
    } else {
      this.placeShape();
    }
  }

  moveLeft() {
    if (!this.isCollision(this.currentRow, this.currentCol - 1, this.currentShape.blocks)) {
      this.currentCol--;
    }
  }

  moveRight() {
    if (!this.isCollision(this.currentRow, this.currentCol + 1, this.currentShape.blocks)) {
      this.currentCol++;
    }
  }

  rotate() {
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
    if (this.gameOver) return;
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