import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { LocalNotifications, PermissionStatus } from '@capacitor/local-notifications';

/*
  Features:
  - Schedule/cancel local notifications at custom date & time (Android/iOS)
  - Notification permission handling
  - Stores scheduled notifications in localStorage
  - Download/upload all app data as .txt file using CommonExternalComponent helpers
  - Bootstrap 5 for UI styling
  - Inline HTML and CSS
  - Strict type checking
*/

interface ScheduledNotif {
  id: number;
  title: string;
  body: string;
  scheduledAt: Date;
}

@Component({
  selector: 'app-notification-tester',
  template: `
    <div class="container p-4 border rounded shadow bg-white">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Notification Scheduler</h4>
        <div>
          <!-- Download Button -->
          <button class="btn btn-outline-primary me-2" (click)="downloadData()" title="Download app data">
            <i class="bi bi-download"></i>
          </button>
          <!-- Upload Button -->
          <label class="btn btn-outline-secondary mb-0" title="Upload app data">
            <i class="bi bi-upload"></i>
            <input type="file" accept=".txt" hidden (change)="uploadData($event)" />
          </label>
        </div>
      </div>

      <form class="row g-3 mb-4" (ngSubmit)="scheduleNotification()" #notifForm="ngForm" autocomplete="off">
        <div class="col-md-6">
          <label class="form-label">Title</label>
          <input required [(ngModel)]="notification.title" name="title" class="form-control" maxlength="50" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Body</label>
          <input required [(ngModel)]="notification.body" name="body" class="form-control" maxlength="120" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Date</label>
          <input required [(ngModel)]="notification.date" name="date" class="form-control" type="date" [min]="todayStr" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Time</label>
          <input required [(ngModel)]="notification.time" name="time" class="form-control" type="time" />
        </div>
        <div class="col-12">
          <button class="btn btn-success w-100" [disabled]="!notifForm.form.valid">Schedule Notification</button>
        </div>
      </form>

      <div *ngIf="scheduledNotifications.length > 0" class="mt-4">
        <h5>Scheduled Notifications</h5>
        <ul class="list-group">
          <li *ngFor="let n of scheduledNotifications" class="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>{{n.title}}</strong> - {{n.body}}<br>
              <small class="text-muted">{{n.scheduledAt | date:'medium'}}</small>
            </span>
            <button class="btn btn-sm btn-danger" (click)="cancelNotification(n.id)">Cancel</button>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin-top: 40px; }
    h4 { margin-bottom: 0; }
    input[type="file"] { display: none; }
    .bi { font-size: 1.1rem; vertical-align: middle; }
  `]
})
export class NotificationTesterComponent extends CommonExternalComponent {
  notification: { title: string; body: string; date: string; time: string } = {
    title: '',
    body: '',
    date: '',
    time: ''
  };
  scheduledNotifications: ScheduledNotif[] = [];
  todayStr: string = new Date().toISOString().split('T')[0];

  constructor(private cdr: ChangeDetectorRef) {
    super();
    this.loadFromLocalStorage();
  }

  // Schedules a notification using @capacitor/local-notifications v7
  async scheduleNotification(): Promise<void> {
    const { title, body, date, time } = this.notification;

    if (!title || !body || !date || !time) return;

    // Parse selected date and time
    const [year, month, day]: number[] = date.split('-').map(Number);
    const [hour, minute]: number[] = time.split(':').map(Number);

    const scheduledDate: Date = new Date(year, month - 1, day, hour, minute, 0, 0);
    const now: Date = new Date();

    if (scheduledDate.getTime() <= now.getTime()) {
      alert('Please select a future date and time.');
      return;
    }

    // Request notification permission (v7 API)
    const perm: PermissionStatus = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') {
      alert('Notification permission not granted. Please enable it in app settings.');
      return;
    }

    // Generate unique ID
    const id: number = this.generateUniqueId();

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body,
            schedule: { at: scheduledDate },
            sound: 'default'
          }
        ]
      });

      this.scheduledNotifications.push({
        id,
        title,
        body,
        scheduledAt: scheduledDate
      });
      this.saveToLocalStorage();

      alert(`Notification scheduled for: ${scheduledDate.toLocaleString()}`);
      this.resetForm();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error scheduling notification:', error);
      alert('Failed to schedule notification. Check console for details.');
    }
  }

  // Cancels a scheduled notification by ID
  async cancelNotification(id: number): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
      this.scheduledNotifications = this.scheduledNotifications.filter((n: ScheduledNotif) => n.id !== id);
      this.saveToLocalStorage();
      this.cdr.detectChanges();
    } catch (err) {
      alert('Failed to cancel notification.');
    }
  }

  // Download app data as .txt
  downloadData(): void {
    const data: { scheduledNotifications: any[] } = {
      scheduledNotifications: this.scheduledNotifications.map((n: ScheduledNotif) => ({
        ...n,
        scheduledAt: n.scheduledAt instanceof Date ? n.scheduledAt.toISOString() : n.scheduledAt
      }))
    };
    this.componentDataDownloader(data);
  }

  // Upload app data from .txt
  async uploadData(event: Event): Promise<void> {
    const result: any = await this.componentDataUploader(event);
    if (result && Array.isArray(result.scheduledNotifications)) {
      this.scheduledNotifications = result.scheduledNotifications.map((n: any) => ({
        ...n,
        scheduledAt: new Date(n.scheduledAt)
      }));
      this.saveToLocalStorage();
      this.cdr.detectChanges();
    }
  }

  // Persist to localStorage
  private saveToLocalStorage(): void {
    localStorage.setItem(
      'notification-tester-data',
      JSON.stringify(
        this.scheduledNotifications.map((n: ScheduledNotif) => ({
          ...n,
          scheduledAt: n.scheduledAt instanceof Date ? n.scheduledAt.toISOString() : n.scheduledAt
        }))
      )
    );
  }

  // Load from localStorage
  private loadFromLocalStorage(): void {
    const raw: string | null = localStorage.getItem('notification-tester-data');
    if (raw) {
      try {
        const arr: any[] = JSON.parse(raw);
        this.scheduledNotifications = arr.map((n: any) => ({
          ...n,
          scheduledAt: new Date(n.scheduledAt)
        }));
      } catch {
        this.scheduledNotifications = [];
      }
    }
  }

  // Simple unique ID generator
  private generateUniqueId(): number {
    const ids: number[] = this.scheduledNotifications.map((n: ScheduledNotif) => n.id);
    let next = 1;
    while (ids.includes(next)) next++;
    return next;
  }

  // Reset form
  private resetForm(): void {
    this.notification = { title: '', body: '', date: '', time: '' };
  }
}