import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-road-rash-game',
  template: `
    <div class="game-container">
      <div class="road">
        <div class="dashed-line" [ngStyle]="{ top: linePosition + 'px' }"></div>
        <div class="dashed-line" [ngStyle]="{ top: linePosition + 40 + 'px' }"></div>
        <div class="dashed-line" [ngStyle]="{ top: linePosition + 80 + 'px' }"></div>
        <div class="dashed-line" [ngStyle]="{ top: linePosition + 120 + 'px' }"></div>
      </div>
      <div class="bike" [ngStyle]="{ left: bikePosition + 'px' }"></div>
      <div *ngFor="let obstacle of obstacles" class="obstacle" [ngStyle]="{ top: obstacle.position + 'px', left: obstacle.left + 'px' }"></div>
      <div class="score">Score: {{ score }}</div>
    </div>
  `,
  styles: [`
    .game-container {
      position: relative;
      width: 400px;
      height: 600px;
      background-color: #e0e0e0;
      overflow: hidden;
      border: 2px solid #333;
    }
    .road {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #555;
    }
    .dashed-line {
      position: absolute;
      width: 4px;
      height: 20px;
      background-color: white;
      margin-left: 50%; /* Centered */
      transform: translateX(-50%);
      border-radius: 2px;
      animation: dash 1s linear infinite;
    }
    @keyframes dash {
      0% { opacity: 1; }
      50% { opacity: 0; }
      100% { opacity: 1; }
    }
    .bike {
      position: absolute;
      bottom: 20px;
      width: 40px;
      height: 60px;
      background-color: blue;
      transition: left 0.1s;
    }
    .obstacle {
      position: absolute;
      width: 40px;
      height: 60px;
      background-color: red;
      animation: fall linear infinite;
    }
    @keyframes fall {
      0% { top: -60px; }
      100% { top: 600px; }
    }
    .score {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 20px;
    }
  `]
})
export class RoadRashGameComponent {
  bikePosition = 180; // Initial position of the bike
  obstacles = [];
  score = 0;
  obstacleSpeed = 5;
  linePosition = 0;

  constructor() {
    this.spawnObstacle();
    setInterval(() => this.updateObstacles(), 100);
    setInterval(() => this.updateDashedLine(), 100); // Update dashed line position
  }

  spawnObstacle() {
    const leftPosition = Math.random() * (360); // Random left position
    this.obstacles.push({ position: -60, left: leftPosition });
  }

  updateObstacles() {
    for (let obstacle of this.obstacles) {
      obstacle.position += this.obstacleSpeed;
      if (obstacle.position > 600) {
        this.score++;
        this.obstacles.shift(); // Remove off-screen obstacles
        this.spawnObstacle(); // Spawn new obstacle
      }
    }
  }

  updateDashedLine() {
    this.linePosition += 5; // Move the dashed lines down
    if (this.linePosition > 600) {
      this.linePosition = 0; // Reset position for continuous effect
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' && this.bikePosition > 0) {
      this.bikePosition -= 20; // Move left
    } else if (event.key === 'ArrowRight' && this.bikePosition < 360) {
      this.bikePosition += 20; // Move right
    }
  }
}