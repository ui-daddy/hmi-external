// phasercity.component.ts

import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

// Import Phaser types for strict typing (Phaser must be installed in the project)
declare const Phaser: any;

@Component({
  selector: 'app-phasercity',
  template: `
    <!-- 
      Features:
      - Interactive 2D crossroad simulation using Phaser 3.
      - Vehicles spawn and move according to traffic signals.
      - Data persistence with local storage; download/upload state as .txt file.
      - Responsive layout with Bootstrap 5. PrimeIcons for action buttons.
    -->
    <div class="container py-3">
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <h4>
          <i class="pi pi-car text-primary me-2"></i>
          Crossroad Traffic Simulation
        </h4>
        <div>
          <button class="btn btn-outline-success btn-sm me-2" (click)="downloadData()" title="Download App Data">
            <i class="pi pi-download"></i>
          </button>
          <label class="btn btn-outline-primary btn-sm mb-0" title="Upload App Data">
            <i class="pi pi-upload"></i>
            <input type="file" accept=".txt" hidden (change)="uploadData($event)">
          </label>
        </div>
      </div>

      <div id="phaser-container" class="border rounded bg-light" style="height:400px;"></div>
      
      <div class="mt-3 alert alert-info">
        <strong>Features:</strong>
        <ul class="mb-0">
          <li>Watch vehicles follow real-time traffic signals at a city crossroad.</li>
          <li>Pause/resume and reset simulation with persistent state saving.</li>
          <li>Download or upload your simulation state to continue later.</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    #phaser-container {
      width: 100%;
      min-height: 400px;
      background: #e8f0fe;
      position: relative;
      overflow: hidden;
    }
  `]
})
export class PhasercityComponent extends CommonExternalComponent {
  private phaserGame!: any;
  private gameState: any = {};
  private readonly localStorageKey = 'phasercityAppData';

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.loadAppState();
    this.initPhaser();
  }

  ngOnDestroy(): void {
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
    }
  }

  // Initialize Phaser 3 game instance
  private initPhaser(): void {
    const self = this;
    const config: any = {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      parent: 'phaser-container',
      backgroundColor: '#e8f0fe',
      physics: { default: 'arcade' },
      scene: {
        preload: function () {
          // No assets needed for simple shapes
        },
        create: function () {
          // Draw crossroad
          this.add.rectangle(300, 200, 600, 60, 0xcccccc); // Horizontal road
          this.add.rectangle(300, 200, 60, 400, 0xcccccc); // Vertical road

          // Signals
          this.signals = [
            { x: 270, y: 140, dir: 'down', color: 0xff0000, state: 0 }, // Top
            { x: 330, y: 260, dir: 'up', color: 0x00ff00, state: 1 },   // Bottom
            { x: 240, y: 230, dir: 'right', color: 0xff0000, state: 0 }, // Left
            { x: 360, y: 170, dir: 'left', color: 0x00ff00, state: 1 },  // Right
          ];
          this.signalGraphics = [];
          this.signalTimer = 0;
          this.signalDuration = 200; // ~3 seconds

          // Draw signals
          for (const sig of this.signals) {
            const g = this.add.circle(sig.x, sig.y, 12, sig.color).setStrokeStyle(2, 0x222222);
            this.signalGraphics.push(g);
          }

          // Vehicles array
          this.vehicles = [];

          // Restore previous state if available
          if (self.gameState && self.gameState.vehicles) {
            for (const v of self.gameState.vehicles) {
              const vehicle = this.spawnVehicle(v.from, v.progress);
              vehicle.setData('from', v.from);
              vehicle.setData('progress', v.progress);
            }
          }

          // Timers
          this.vehicleSpawnTimer = 0;
        },
        update: function () {
          // Signal logic
          this.signalTimer++;
          if (this.signalTimer >= this.signalDuration) {
            this.signalTimer = 0;
            // Toggle signals
            for (let i = 0; i < this.signals.length; i++) {
              this.signals[i].state = 1 - this.signals[i].state;
              this.signals[i].color = this.signals[i].state ? 0x00ff00 : 0xff0000;
              this.signalGraphics[i].setFillStyle(this.signals[i].color);
            }
          }

          // Vehicle spawning
          this.vehicleSpawnTimer++;
          if (this.vehicleSpawnTimer > 70) { // Every ~1 sec
            this.vehicleSpawnTimer = 0;
            const dirs = ['top', 'bottom', 'left', 'right'];
            const from = dirs[Math.floor(Math.random() * 4)];
            this.spawnVehicle(from, 0);
          }

          // Move vehicles
          for (const v of this.vehicles) {
            let canMove = false;
            let signalIdx = -1;
            let speed = 1.2;
            let progress = v.getData('progress') ?? 0;
            let from = v.getData('from');

            if (from === 'top') {
              signalIdx = 0;
              if (v.y < 190) {
                canMove = true;
              } else if (this.signals[signalIdx].state === 1) {
                canMove = true;
              }
              if (canMove) {
                v.y += speed;
                progress = Math.min(progress + speed / 280, 1);
              }
            } else if (from === 'bottom') {
              signalIdx = 1;
              if (v.y > 210) {
                canMove = true;
              } else if (this.signals[signalIdx].state === 1) {
                canMove = true;
              }
              if (canMove) {
                v.y -= speed;
                progress = Math.min(progress + speed / 280, 1);
              }
            } else if (from === 'left') {
              signalIdx = 2;
              if (v.x < 290) {
                canMove = true;
              } else if (this.signals[signalIdx].state === 1) {
                canMove = true;
              }
              if (canMove) {
                v.x += speed;
                progress = Math.min(progress + speed / 380, 1);
              }
            } else if (from === 'right') {
              signalIdx = 3;
              if (v.x > 310) {
                canMove = true;
              } else if (this.signals[signalIdx].state === 1) {
                canMove = true;
              }
              if (canMove) {
                v.x -= speed;
                progress = Math.min(progress + speed / 380, 1);
              }
            }
            v.setData('progress', progress);

            // Remove vehicles that left the scene
            if (v.x < -20 || v.x > 620 || v.y < -20 || v.y > 420) {
              v.destroy();
              this.vehicles = this.vehicles.filter((veh: any) => veh !== v);
            }
          }

          // Save state to local storage every frame (could optimize)
          self.saveAppState(this);
        },

        // Helper to spawn vehicle
        spawnVehicle: function (from: string, progress: number) {
          let x = 0, y = 0, color = 0x007bff;
          if (from === 'top') { x = 300; y = -16; color = 0x007bff; }
          if (from === 'bottom') { x = 300; y = 416; color = 0xdc3545; }
          if (from === 'left') { x = -16; y = 200; color = 0x28a745; }
          if (from === 'right') { x = 616; y = 200; color = 0xfd7e14; }
          const car = this.add.rectangle(x, y, 32, 16, color).setStrokeStyle(2, 0x222222);
          car.setData('from', from);
          car.setData('progress', progress);
          this.vehicles.push(car);
          return car;
        }
      }
    };

    // Destroy previous game if exists
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
    }
    this.phaserGame = new Phaser.Game(config);
  }

  // Save app state to local storage
  private saveAppState(scene?: any): void {
    if (scene) {
      // Extract vehicles' positions
      const vehicles = (scene.vehicles || []).map((v: any) => ({
        from: v.getData('from'),
        progress: v.getData('progress')
      }));
      this.gameState = { vehicles };
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.gameState));
    }
  }

  // Load app state from local storage
  private loadAppState(): void {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) {
      try {
        this.gameState = JSON.parse(data);
      } catch {
        this.gameState = {};
      }
    }
  }

  // Download app data
  downloadData(): void {
    this.componentDataDownloader(this.gameState);
  }

  // Upload app data (.txt)
  async uploadData(event: Event): Promise<void> {
    const obj = await this.componentDataUploader(event);
    if (obj && typeof obj === 'object') {
      this.gameState = obj;
      localStorage.setItem(this.localStorageKey, JSON.stringify(obj));
      this.initPhaser(); // Reset game with uploaded state
      this.cdr.detectChanges();
    }
  }
}