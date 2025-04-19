import { Component, HostListener } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'building-block',
  template: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <h3>Snake Game</h3>
      <div 
        [style.width.px]="size*cell"
        [style.height.px]="size*cell"
        style="border:2px solid #333;position:relative;background:#eee;"
      >
        <div *ngFor="let s of snake" 
          [style.left.px]="s.x*cell"
          [style.top.px]="s.y*cell"
          style="width:20px;height:20px;position:absolute;background:#4caf50;border-radius:4px;">
        </div>
        <div 
          [style.left.px]="food.x*cell"
          [style.top.px]="food.y*cell"
          style="width:20px;height:20px;position:absolute;background:#e53935;border-radius:50%;">
        </div>
        <div *ngIf="gameOver" 
          style="position:absolute;top:40%;left:10%;right:10%;background:#fff9;padding:10px;text-align:center;font-size:18px;border-radius:8px;">
          Game Over!<br>
          <button (click)="reset()">Restart</button>
        </div>
      </div>
      <p>Score: {{snake.length-1}}</p>
      <small>Use arrow keys</small>
    </div>
  `,
  styles: []
})
export class BuildingBlockComponent extends CommonExternalComponent {
  size = 15;
  cell = 20;
  snake: Point[] = [{ x: 7, y: 7 }];
  dir: Point = { x: 0, y: 0 };
  food: Point = this.randomFood();
  gameOver = false;
  interval: any;

  constructor() {
    super();
    this.start();
  }

  start() {
    this.dir = { x: 0, y: 0 };
    this.snake = [{ x: 7, y: 7 }];
    this.food = this.randomFood();
    this.gameOver = false;
    clearInterval(this.interval);
    this.interval = setInterval(() => this.move(), 120);
  }

  reset() {
    this.start();
  }

  @HostListener('window:keydown', ['$event'])
  key(e: KeyboardEvent) {
    const d = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } }[e.key];
    if (d && !(this.dir.x === -d.x && this.dir.y === -d.y)) this.dir = d;
  }

  move() {
    if (this.gameOver || (this.dir.x === 0 && this.dir.y === 0)) return;
    const head: Point = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };
    if (this.hit(head)) {
      this.gameOver = true;
      clearInterval(this.interval);
      return;
    }
    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) this.food = this.randomFood();
    else this.snake.pop();
  }

  hit(h: Point) {
    return h.x < 0 || h.y < 0 || h.x >= this.size || h.y >= this.size ||
      this.snake.some(s => s.x === h.x && s.y === h.y);
  }

  randomFood(): Point {
    let f: Point;
    do {
      f = { x: Math.floor(Math.random() * this.size), y: Math.floor(Math.random() * this.size) };
    } while (this.snake.some(s => s.x === f.x && s.y === f.y));
    return f;
  }
}