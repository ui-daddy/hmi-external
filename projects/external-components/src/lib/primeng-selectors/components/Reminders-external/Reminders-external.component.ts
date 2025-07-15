// reminders.component.ts

import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { HttpClient } from '@angular/common/http';

/*
  Features:
  - Add, view, and save new reminders with title, message, date & time, and redirect URL.
  - Reminders are saved to local storage for persistence across sessions.
  - Download/upload all reminders as .txt file for backup/restore.
  - Clean, modern UI using Bootstrap 5 and PrimeIcons v7.
  - REST API call on save uses https://mini.nuvoroai.com/rest/reminders with credentials (cookies/session).
*/

interface Reminder {
  title: string;
  message: string;
  scheduledDate: string; // ISO string
  redirectUrl: string;
}

@Component({
  selector: 'app-reminders',
  template: `
    <div class="card shadow mt-4">
      <div class="card-header d-flex align-items-center justify-content-between">
        <span>
          <i class="pi pi-bell me-2"></i>
          Reminders
        </span>
        <div>
          <button type="button" class="btn btn-outline-primary btn-sm me-2"
            (click)="downloadReminders()" title="Download Reminders">
            <i class="pi pi-download"></i>
          </button>
          <label class="btn btn-outline-secondary btn-sm mb-0" title="Upload Reminders">
            <i class="pi pi-upload"></i>
            <input type="file" accept=".txt" hidden (change)="uploadReminders($event)">
          </label>
        </div>
      </div>
      <div class="card-body">
        <form class="row g-3" (ngSubmit)="addReminder()" #reminderForm="ngForm" autocomplete="off">
          <div class="col-md-6">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" required [(ngModel)]="newReminder.title" name="title" maxlength="100" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Scheduled Date & Time</label>
            <input type="datetime-local" class="form-control" required [(ngModel)]="newReminder.scheduledDate" name="scheduledDate" />
          </div>
          <div class="col-12">
            <label class="form-label">Message</label>
            <textarea class="form-control" rows="2" required [(ngModel)]="newReminder.message" name="message" maxlength="250"></textarea>
          </div>
          <div class="col-12">
            <label class="form-label">Redirect URL</label>
            <input type="url" class="form-control" [(ngModel)]="newReminder.redirectUrl" name="redirectUrl" placeholder="https://example.com/meeting"/>
          </div>
          <div class="col-12 text-end">
            <button type="submit" class="btn btn-success" [disabled]="!reminderForm.form.valid || isSaving">
              <i class="pi pi-check"></i> Save Reminder
            </button>
          </div>
        </form>

        <div *ngIf="reminders.length > 0" class="mt-4">
          <h6 class="mb-3"><i class="pi pi-list me-2"></i>Saved Reminders</h6>
          <ul class="list-group">
            <li *ngFor="let r of reminders; let i = index" class="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <div class="fw-bold">{{ r.title }}</div>
                <small class="text-muted">
                  <i class="pi pi-calendar"></i>
                  {{ r.scheduledDate | date:'medium' }}
                </small>
                <div>{{ r.message }}</div>
                <a *ngIf="r.redirectUrl" [href]="r.redirectUrl" target="_blank" rel="noopener" class="d-block small mt-1 text-primary">
                  <i class="pi pi-link"></i> Open Link
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { max-width: 700px; margin: auto; }
    textarea { resize: vertical; }
    .list-group-item { background: #f8f9fa; }
  `]
})
export class RemindersComponent extends CommonExternalComponent {
  reminders: Reminder[] = [];
  newReminder: Reminder = this.getEmptyReminder();
  isSaving: boolean = false;

  private readonly STORAGE_KEY: string = 'remindersAppData';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.loadReminders();
  }

  getEmptyReminder(): Reminder {
    return {
      title: '',
      message: '',
      scheduledDate: '',
      redirectUrl: ''
    };
  }

  loadReminders(): void {
    const data: string | null = localStorage.getItem(this.STORAGE_KEY);
    this.reminders = data ? JSON.parse(data) as Reminder[] : [];
  }

  saveReminders(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reminders));
  }

  addReminder(): void {
    if (!this.newReminder.title || !this.newReminder.message || !this.newReminder.scheduledDate) return;
    this.isSaving = true;

    const reminderToSave: Reminder = {
      ...this.newReminder,
      scheduledDate: new Date(this.newReminder.scheduledDate).toISOString(),
      redirectUrl: this.newReminder.redirectUrl || ''
    };

    this.http.post<{message: string}>(
      'https://mini.nuvoroai.com/rest/reminders',
      reminderToSave,
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.reminders.unshift(reminderToSave);
        this.saveReminders();
        this.newReminder = this.getEmptyReminder();
        this.isSaving = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isSaving = false;
        alert('Failed to save reminder. Please try again.');
      }
    });
  }

  downloadReminders(): void {
    this.componentDataDownloader({ reminders: this.reminders });
  }

  async uploadReminders(event: Event): Promise<void> {
    try {
      const uploaded: any = await this.componentDataUploader(event);
      if (uploaded && uploaded.reminders && Array.isArray(uploaded.reminders)) {
        this.reminders = uploaded.reminders as Reminder[];
        this.saveReminders();
        this.cdr.detectChanges();
      }
    } catch {
      alert('Failed to upload reminders. Invalid file format.');
    }
  }
}