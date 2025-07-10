import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-login-page',
  template: `
    <!-- 
      Features:
      - Responsive login form with Bootstrap 5 styling
      - Username & password fields with icons
      - Data stored in local storage by default
      - Download/Upload user data as .txt file (header buttons)
      - Button color can be easily customized
      - Live update on upload using change detection
    -->
    <div class="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div class="card shadow p-4" style="max-width: 380px; width: 100%;">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0"><i class="pi pi-user me-2"></i>Login</h4>
          <div>
            <button type="button" class="btn btn-outline-primary btn-sm me-1"
              (click)="downloadData()" title="Download your data">
              <i class="pi pi-download"></i>
            </button>
            <label class="btn btn-outline-secondary btn-sm mb-0" title="Upload your data">
              <i class="pi pi-upload"></i>
              <input type="file" accept=".txt" hidden (change)="uploadData($event)">
            </label>
          </div>
        </div>
        <form (ngSubmit)="onLogin()" autocomplete="off">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <div class="input-group">
              <span class="input-group-text bg-light"><i class="pi pi-user"></i></span>
              <input type="text" id="username" class="form-control"
                [(ngModel)]="username" name="username" required maxlength="32" />
            </div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-group-text bg-light"><i class="pi pi-lock"></i></span>
              <input type="password" id="password" class="form-control"
                [(ngModel)]="password" name="password" required minlength="6" maxlength="64" />
            </div>
          </div>
          <button type="submit" class="btn btn-success w-100" [disabled]="loading">
            <span *ngIf="!loading"><i class="pi pi-sign-in me-1"></i>Login</span>
            <span *ngIf="loading"><i class="pi pi-spin pi-spinner me-1"></i>Logging in...</span>
          </button>
        </form>
        <div *ngIf="loginError" class="alert alert-danger mt-3 py-2 small text-center">
          {{ loginError }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 1rem;
    }
    .btn-success {
      background-color: #ff5722 !important; /* Changed button colour to deep orange */
      border-color: #ff5722 !important;
    }
    .btn-success:hover, .btn-success:focus {
      background-color: #e64a19 !important;
      border-color: #e64a19 !important;
    }
  `]
})
export class LoginPageComponent extends CommonExternalComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  loginError: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {
    super();
    // Load saved data if available
    const data = localStorage.getItem('loginData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.username = parsed.username ?? '';
        this.password = parsed.password ?? '';
      } catch {}
    }
  }

  onLogin(): void {
    this.loginError = null;
    this.loading = true;
    setTimeout(() => {
      // Demo: Accept any credentials, save to localStorage
      localStorage.setItem('loginData', JSON.stringify({ username: this.username, password: this.password }));
      this.loading = false;
      // Show error if empty (demo validation)
      if (!this.username || !this.password) {
        this.loginError = 'Please enter both username and password.';
      } else {
        this.loginError = null;
        // Success: You can add navigation or other logic here
      }
      this.cdr.detectChanges();
    }, 1200);
  }

  downloadData(): void {
    const data = {
      username: this.username,
      password: this.password
    };
    this.componentDataDownloader(data);
  }

  async uploadData(event: Event): Promise<void> {
    const uploaded = await this.componentDataUploader(event);
    if (uploaded && typeof uploaded === 'object') {
      this.username = uploaded.username ?? '';
      this.password = uploaded.password ?? '';
      localStorage.setItem('loginData', JSON.stringify(uploaded));
      this.cdr.detectChanges();
    }
  }
}