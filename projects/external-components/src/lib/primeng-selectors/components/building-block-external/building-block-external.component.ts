// building-block.component.ts
// Features: Snake game, keyboard controls, responsive fullscreen for mobile, score display, restart option.

import { Component, HostListener, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { DOCUMENT } from '@angular/common';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'building-block',
  template: `
    <div 
      [ngStyle]="containerStyle"
      style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100vw;height:100vh;box-sizing:border-box;background:#fafafa;">
      <h3 style="margin:12px 0 8px;">Snake Game</h3>
      <div 
        [style.width.px]="boardPx"
        [style.height.px]="boardPx"
        style="border:2px solid #333;position:relative;background:#eee;touch-action:none;"
      >
        <div *ngFor="let s of snake" 
          [style.left.px]="s.x*cell"
          [style.top.px]="s.y*cell"
          [style.width.px]="cell"
          [style.height.px]="cell"
          style="position:absolute;background:#4caf50;border-radius:4px;">
        </div>
        <div 
          [style.left.px]="food.x*cell"
          [style.top.px]="food.y*cell"
          [style.width.px]="cell"
          [style.height.px]="cell"
          style="position:absolute;background:#e53935;border-radius:50%;">
        </div>
        <div *ngIf="gameOver" 
          style="position:absolute;top:40%;left:10%;right:10%;background:#fff9;padding:10px;text-align:center;font-size:18px;border-radius:8px;">
          Game Over!<br>
          <button (click)="reset()" style="margin-top:6px;">Restart</button>
        </div>
      </div>
      <p style="margin:12px 0 2px;">Score: {{snake.length-1}}</p>
      <small>Use arrow keys or swipe</small>
    </div>
  `,
  styles: []
})
export class BuildingBlockComponent extends CommonExternalComponent implements OnInit, OnDestroy {
  size = 15;
  cell = 20;
  snake: Point[] = [{ x: 7, y: 7 }];
  dir: Point = { x: 0, y: 0 };
  food: Point = this.randomFood();
  gameOver = false;
  interval: any;
  boardPx = this.size * this.cell;
  containerStyle: { [key: string]: string } = {};

  private touchStartX: number = 0;
  private touchStartY: number = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    super();
    this.setResponsive();
  }

  ngOnInit(): void {
    this.start();
    this.setResponsive();
    this.renderer.listen('window', 'resize', () => this.setResponsive());
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
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

  // Touch events for swipe controls on mobile
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (event.changedTouches.length === 1) {
      const dx = event.changedTouches[0].clientX - this.touchStartX;
      const dy = event.changedTouches[0].clientY - this.touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20 && this.dir.x !== -1) this.dir = { x: 1, y: 0 };
        else if (dx < -20 && this.dir.x !== 1) this.dir = { x: -1, y: 0 };
      } else {
        if (dy > 20 && this.dir.y !== -1) this.dir = { x: 0, y: 1 };
        else if (dy < -20 && this.dir.y !== 1) this.dir = { x: 0, y: -1 };
      }
    }
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

  hit(h: Point): boolean {
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

  // Responsive logic for full-screen on mobile
  setResponsive(): void {
    const isMobile = window.innerWidth <= 600 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      const minDim = Math.min(window.innerWidth, window.innerHeight) - 24; // padding
      this.cell = Math.floor(minDim / this.size);
      this.boardPx = this.cell * this.size;
      this.containerStyle = {
        width: '100vw',
        height: '100vh',
        'padding': '0',
        'background': '#fafafa'
      };
    } else {
      this.cell = 20;
      this.boardPx = this.cell * this.size;
      this.containerStyle = {
        width: '100vw',
        height: '100vh',
        'background': '#fafafa'
      };
    }
  }
}