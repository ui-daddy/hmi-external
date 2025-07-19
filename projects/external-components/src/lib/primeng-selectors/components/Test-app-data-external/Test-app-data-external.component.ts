// test-app-data.component.ts

import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
  dueDateTime: string; // ISO string with timezone (YYYY-MM-DDTHH:mm:ss.sssZ)
  timezone: string;
  subtasks: SubTask[];
}

@Component({
  selector: 'app-test-app-data',
  template: `
    <!-- 
      Features:
      - Add, edit, list, remove daily todo tasks with due date, time, and timezone.
      - Mark tasks and subtasks as complete/incomplete.
      - Inline edit for task, due date, time, timezone, and subtasks.
      - Add/remove/edit subtasks under each main task.
      - Data auto-saved in browser local storage.
      - Backup & restore: Download/upload all saved data (.txt).
      - Reminder notification:
        - One day before due date/time.
        - Popup alert when less than 1 minute remains.
      - Responsive Bootstrap 5 UI.
      - Strict type checking throughout.
      - Delete uses a visible trash icon (PrimeIcons).
      - Edit uses a pencil icon (PrimeIcons).
      - Backup uses cloud-download and cloud-upload icons (PrimeIcons).
      - Timezone selection per task.
    -->
    <div class="card shadow mt-4">
      <div class="card-header d-flex justify-content-between align-items-center bg-primary text-white">
        <span>Todo App - Daily Tasks with Due Date, Time & Timezone</span>
        <div>
          <button 
            class="btn btn-outline-light btn-sm me-2" 
            (click)="downloadBackup()" 
            aria-label="Download backup"
            title="Download backup"
          >
            <i class="pi pi-cloud-download"></i>
          </button>
          <label class="btn btn-outline-light btn-sm mb-0" title="Upload backup">
            <i class="pi pi-cloud-upload"></i>
            <input 
              type="file" 
              accept=".txt"
              class="d-none"
              (change)="uploadBackup($event)"
              aria-label="Upload backup"
            >
          </label>
        </div>
      </div>
      <div class="card-body">
        <form class="row g-2 mb-3" (ngSubmit)="addTask()">
          <div class="col-md-4 col-12">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Enter new task..." 
              [(ngModel)]="newTask"
              name="task"
              required
              maxlength="100"
              [ngModelOptions]="{standalone: true}"
            >
          </div>
          <div class="col-md-2 col-6">
            <input 
              type="date" 
              class="form-control" 
              [(ngModel)]="newDueDate"
              name="dueDate"
              required
              min="{{today}}"
              [ngModelOptions]="{standalone: true}"
            >
          </div>
          <div class="col-md-2 col-6">
            <input 
              type="time" 
              class="form-control" 
              [(ngModel)]="newDueTime"
              name="dueTime"
              required
              [ngModelOptions]="{standalone: true}"
            >
          </div>
          <div class="col-md-2 col-8">
            <select 
              class="form-select"
              [(ngModel)]="newTimezone"
              name="timezone"
              required
              [ngModelOptions]="{standalone: true}"
            >
              <option *ngFor="let tz of timezones" [value]="tz">{{tz}}</option>
            </select>
          </div>
          <div class="col-md-2 col-4 d-grid">
            <button type="submit" class="btn btn-success">Add Task</button>
          </div>
        </form>
        <ul class="list-group">
          <li *ngFor="let item of todos" class="list-group-item d-flex flex-column gap-2">
            <div class="d-flex justify-content-between align-items-center w-100">
              <div class="flex-grow-1">
                <ng-container *ngIf="editId !== item.id; else editBlock">
                  <input 
                    class="form-check-input me-2" 
                    type="checkbox" 
                    [checked]="item.completed" 
                    (change)="toggleComplete(item.id)"
                    [attr.aria-label]="'Mark ' + item.task + ' as complete'"
                  >
                  <span [class.text-decoration-line-through]="item.completed">{{ item.task }}</span>
                  <span class="badge bg-secondary ms-2">
                    Due: {{ displayLocalDateTime(item.dueDateTime, item.timezone) }}
                  </span>
                  <span class="badge bg-info text-dark ms-2">{{item.timezone}}</span>
                  <span *ngIf="showReminderBadge(item)" class="badge bg-warning text-dark ms-2">
                    Reminder!
                  </span>
                </ng-container>
                <ng-template #editBlock>
                  <input 
                    type="text" 
                    class="form-control d-inline-block w-auto me-2"
                    [(ngModel)]="editTask"
                    maxlength="100"
                    required
                    [ngModelOptions]="{standalone: true}"
                    style="max-width:160px;"
                    aria-label="Edit task"
                  >
                  <input 
                    type="date" 
                    class="form-control d-inline-block w-auto me-2"
                    [(ngModel)]="editDueDate"
                    [min]="today"
                    required
                    [ngModelOptions]="{standalone: true}"
                    style="max-width:120px;"
                    aria-label="Edit due date"
                  >
                  <input 
                    type="time"
                    class="form-control d-inline-block w-auto me-2"
                    [(ngModel)]="editDueTime"
                    required
                    [ngModelOptions]="{standalone: true}"
                    style="max-width:100px;"
                    aria-label="Edit due time"
                  >
                  <select 
                    class="form-select d-inline-block w-auto me-2"
                    [(ngModel)]="editTimezone"
                    required
                    [ngModelOptions]="{standalone: true}"
                    style="max-width:130px;"
                  >
                    <option *ngFor="let tz of timezones" [value]="tz">{{tz}}</option>
                  </select>
                </ng-template>
              </div>
              <div class="d-flex align-items-center ms-2">
                <ng-container *ngIf="editId !== item.id; else editActions">
                  <button class="btn btn-outline-secondary btn-sm me-1" (click)="startEdit(item)" aria-label="Edit task">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button class="btn btn-danger btn-sm" (click)="removeTask(item.id)" aria-label="Delete task">
                    <i class="pi pi-trash fs-5"></i>
                  </button>
                </ng-container>
                <ng-template #editActions>
                  <button class="btn btn-success btn-sm me-1" (click)="saveEdit(item.id)" aria-label="Save">
                    <i class="pi pi-check"></i>
                  </button>
                  <button class="btn btn-outline-secondary btn-sm" (click)="cancelEdit()" aria-label="Cancel">
                    <i class="pi pi-times"></i>
                  </button>
                </ng-template>
              </div>
            </div>
            <!-- Subtasks Section -->
            <div class="ms-4 w-100">
              <div class="d-flex align-items-center mb-2">
                <strong class="me-2">Subtasks:</strong>
                <input 
                  type="text" 
                  class="form-control form-control-sm me-2"
                  placeholder="Add subtask..."
                  [(ngModel)]="subtaskInputs[item.id]"
                  [ngModelOptions]="{standalone: true}"
                  maxlength="80"
                  style="max-width:170px; display:inline-block;"
                  (keyup.enter)="addSubtask(item.id)"
                >
                <button class="btn btn-sm btn-outline-primary" (click)="addSubtask(item.id)">
                  <i class="pi pi-plus"></i>
                </button>
              </div>
              <ul class="list-group list-group-flush ps-2">
                <li *ngFor="let st of item.subtasks" class="list-group-item py-1 px-0 d-flex align-items-center border-0">
                  <input 
                    class="form-check-input me-2" 
                    type="checkbox" 
                    [checked]="st.completed" 
                    (change)="toggleSubtaskComplete(item.id, st.id)"
                  >
                  <span [class.text-decoration-line-through]="st.completed" class="flex-grow-1" *ngIf="!isEditingSubtask(item.id, st.id); else subEditBlock">
                    {{st.title}}
                  </span>
                  <ng-template #subEditBlock>
                    <input 
                      type="text"
                      class="form-control form-control-sm d-inline-block w-auto me-2"
                      [(ngModel)]="editingSubtaskTitle"
                      maxlength="80"
                      required
                      [ngModelOptions]="{standalone: true}"
                      style="max-width:140px;"
                      aria-label="Edit subtask"
                    >
                  </ng-template>
                  <ng-container *ngIf="!isEditingSubtask(item.id, st.id); else subEditActions">
                    <button class="btn btn-outline-secondary btn-xs btn-sm me-1" (click)="startEditSubtask(item.id, st)" aria-label="Edit subtask">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-xs btn-sm" (click)="removeSubtask(item.id, st.id)" aria-label="Delete subtask">
                      <i class="pi pi-trash"></i>
                    </button>
                  </ng-container>
                  <ng-template #subEditActions>
                    <button class="btn btn-success btn-xs btn-sm me-1" (click)="saveEditSubtask(item.id, st.id)" aria-label="Save subtask">
                      <i class="pi pi-check"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-xs btn-sm" (click)="cancelEditSubtask()" aria-label="Cancel subtask edit">
                      <i class="pi pi-times"></i>
                    </button>
                  </ng-template>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <div *ngIf="todos.length === 0" class="alert alert-info mt-3 mb-0">
          No tasks yet. Start by adding a new task!
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { max-width: 800px; margin: auto; }
    .form-control, .form-select { font-size: 1rem; }
    .list-group-item { font-size: 1.05rem; }
    .text-decoration-line-through { color: #6c757d !important; }
    .cursor-pointer { cursor: pointer; }
    .btn-xs { padding: 0.15rem 0.35rem; font-size: 0.85em; line-height: 1; }
    @media (max-width: 576px) {
      .card { margin: 1rem; }
      .col-md-4, .col-md-2, .col-12, .col-8, .col-6, .col-4 { flex: 0 0 100%; max-width: 100%; }
      .d-grid { margin-top: 0.5rem; }
    }
  `]
})
export class TestAppDataComponent extends CommonExternalComponent implements OnInit {
  public todos: TodoItem[] = [];
  public newTask: string = '';
  public newDueDate: string = '';
  public newDueTime: string = '';
  public newTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  public today: string = '';

  // For editing main task
  public editId: number | null = null;
  public editTask: string = '';
  public editDueDate: string = '';
  public editDueTime: string = '';
  public editTimezone: string = this.newTimezone;

  // For subtasks
  public subtaskInputs: {[taskId: number]: string} = {};
  public editingSubtaskId: {taskId: number, subId: number} | null = null;
  public editingSubtaskTitle: string = '';

  // List of common timezones (can be expanded)
  public timezones: string[] = [
    'UTC', 'America/New_York', 'Europe/London', 'Europe/Paris', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'
  ];

  constructor(private cdr: ChangeDetectorRef) {
    super();
    this.today = this.getTodayString();
    this.loadFromLocalStorage();
  }

  ngOnInit(): void {
    this.requestNotificationPermission();
    setTimeout(() => this.checkAndNotifyReminders(), 500);
    setInterval(() => this.checkAndNotifyReminders(), 60 * 60 * 1000); // hourly
    setInterval(() => this.checkOneMinuteReminders(), 10 * 1000); // every 10s
  }

  addTask(): void {
    const trimmed: string = this.newTask.trim();
    if (trimmed && this.newDueDate && this.newDueTime && this.newTimezone) {
      const newId: number = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id)) + 1 : 1;
      const dueDateTime: string = this.combineDateTime(this.newDueDate, this.newDueTime, this.newTimezone);
      this.todos.push({ 
        id: newId, 
        task: trimmed, 
        completed: false, 
        dueDateTime, 
        timezone: this.newTimezone,
        subtasks: []
      });
      this.saveToLocalStorage();
      this.newTask = '';
      this.newDueDate = '';
      this.newDueTime = '';
      this.newTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.cdr.detectChanges();
      this.checkAndNotifyReminders();
    }
  }

  removeTask(id: number): void {
    this.todos = this.todos.filter((t: TodoItem) => t.id !== id);
    this.saveToLocalStorage();
    this.cdr.detectChanges();
    if (this.editId === id) {
      this.cancelEdit();
    }
    delete this.subtaskInputs[id];
  }

  toggleComplete(id: number): void {
    const idx: number = this.todos.findIndex((t: TodoItem) => t.id === id);
    if (idx > -1) {
      this.todos[idx].completed = !this.todos[idx].completed;
      this.saveToLocalStorage();
      this.cdr.detectChanges();
    }
  }

  // Edit functions
  startEdit(item: TodoItem): void {
    this.editId = item.id;
    this.editTask = item.task;
    const dt = this.parseDateTime(item.dueDateTime, item.timezone);
    this.editDueDate = dt.date;
    this.editDueTime = dt.time;
    this.editTimezone = item.timezone;
    this.cdr.detectChanges();
  }

  saveEdit(id: number): void {
    const trimmed: string = this.editTask.trim();
    if (!trimmed || !this.editDueDate || !this.editDueTime || !this.editTimezone) return;
    const idx: number = this.todos.findIndex((t: TodoItem) => t.id === id);
    if (idx > -1) {
      this.todos[idx].task = trimmed;
      this.todos[idx].dueDateTime = this.combineDateTime(this.editDueDate, this.editDueTime, this.editTimezone);
      this.todos[idx].timezone = this.editTimezone;
      this.saveToLocalStorage();
      this.editId = null;
      this.editTask = '';
      this.editDueDate = '';
      this.editDueTime = '';
      this.editTimezone = this.newTimezone;
      this.cdr.detectChanges();
      this.checkAndNotifyReminders();
    }
  }

  cancelEdit(): void {
    this.editId = null;
    this.editTask = '';
    this.editDueDate = '';
    this.editDueTime = '';
    this.editTimezone = this.newTimezone;
    this.cdr.detectChanges();
  }

  // Subtask functions
  addSubtask(taskId: number): void {
    const input: string = (this.subtaskInputs[taskId] || '').trim();
    if (!input) return;
    const taskIdx: number = this.todos.findIndex(t => t.id === taskId);
    if (taskIdx > -1) {
      const subId: number = this.todos[taskIdx].subtasks.length > 0 ?
        Math.max(...this.todos[taskIdx].subtasks.map(st => st.id)) + 1 : 1;
      this.todos[taskIdx].subtasks.push({ id: subId, title: input, completed: false });
      this.subtaskInputs[taskId] = '';
      this.saveToLocalStorage();
      this.cdr.detectChanges();
    }
  }

  removeSubtask(taskId: number, subId: number): void {
    const taskIdx: number = this.todos.findIndex(t => t.id === taskId);
    if (taskIdx > -1) {
      this.todos[taskIdx].subtasks = this.todos[taskIdx].subtasks.filter(st => st.id !== subId);
      this.saveToLocalStorage();
      this.cdr.detectChanges();
      if (this.isEditingSubtask(taskId, subId)) {
        this.cancelEditSubtask();
      }
    }
  }

  toggleSubtaskComplete(taskId: number, subId: number): void {
    const taskIdx: number = this.todos.findIndex(t => t.id === taskId);
    if (taskIdx > -1) {
      const stIdx: number = this.todos[taskIdx].subtasks.findIndex(st => st.id === subId);
      if (stIdx > -1) {
        this.todos[taskIdx].subtasks[stIdx].completed = !this.todos[taskIdx].subtasks[stIdx].completed;
        this.saveToLocalStorage();
        this.cdr.detectChanges();
      }
    }
  }

  isEditingSubtask(taskId: number, subId: number): boolean {
    return !!this.editingSubtaskId && this.editingSubtaskId.taskId === taskId && this.editingSubtaskId.subId === subId;
  }

  startEditSubtask(taskId: number, subtask: SubTask): void {
    this.editingSubtaskId = {taskId, subId: subtask.id};
    this.editingSubtaskTitle = subtask.title;
    this.cdr.detectChanges();
  }

  saveEditSubtask(taskId: number, subId: number): void {
    const title: string = this.editingSubtaskTitle.trim();
    if (!title) return;
    const taskIdx: number = this.todos.findIndex(t => t.id === taskId);
    if (taskIdx > -1) {
      const stIdx: number = this.todos[taskIdx].subtasks.findIndex(st => st.id === subId);
      if (stIdx > -1) {
        this.todos[taskIdx].subtasks[stIdx].title = title;
        this.saveToLocalStorage();
        this.cancelEditSubtask();
        this.cdr.detectChanges();
      }
    }
  }

  cancelEditSubtask(): void {
    this.editingSubtaskId = null;
    this.editingSubtaskTitle = '';
    this.cdr.detectChanges();
  }

  saveToLocalStorage(): void {
    window.localStorage.setItem('test-app-todos', JSON.stringify(this.todos));
  }

  loadFromLocalStorage(): void {
    const saved: string | null = window.localStorage.getItem('test-app-todos');
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.todos = parsed.map((t: any) => ({
            id: Number(t.id),
            task: String(t.task),
            completed: Boolean(t.completed),
            dueDateTime: String(t.dueDateTime),
            timezone: typeof t.timezone === 'string' ? t.timezone : 'UTC',
            subtasks: Array.isArray(t.subtasks)
              ? t.subtasks.map((st: any) => ({
                  id: Number(st.id),
                  title: String(st.title),
                  completed: Boolean(st.completed)
                }))
              : []
          }));
        }
      } catch {
        this.todos = [];
      }
    }
  }

  getTodayString(): string {
    const today: Date = new Date();
    return today.toISOString().split('T')[0];
  }

  // Convert ISO string to date and time in selected timezone
  parseDateTime(iso: string, timezone: string): {date: string, time: string} {
    try {
      const dt = new Date(iso);
      // Use Intl.DateTimeFormat to get local values in the timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const parts = formatter.formatToParts(dt);
      const y = parts.find(p => p.type === 'year')?.value ?? '1970';
      const m = parts.find(p => p.type === 'month')?.value ?? '01';
      const d = parts.find(p => p.type === 'day')?.value ?? '01';
      const h = parts.find(p => p.type === 'hour')?.value ?? '00';
      const min = parts.find(p => p.type === 'minute')?.value ?? '00';
      return {
        date: `${y}-${m}-${d}`,
        time: `${h.padStart(2,'0')}:${min.padStart(2,'0')}`
      };
    } catch {
      return {date: '', time: ''};
    }
  }

  // Combine date, time, and timezone into ISO string in UTC
  combineDateTime(date: string, time: string, timezone: string): string {
    // date: YYYY-MM-DD, time: HH:mm
    try {
      // Create a Date object in the selected timezone
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute] = time.split(':').map(Number);
      // Get timestamp in that timezone using Date.UTC and offset
      // But JS Date does not support timezones directly, so use workaround:
      // 1. Create a date in that timezone via toLocaleString
      // 2. Parse back as UTC
      const local = new Date(Date.UTC(year, month - 1, day, hour, minute));
      // Now get offset between UTC and desired timezone at that moment
      const tzOffset = -this.getTimezoneOffsetMinutes(local, timezone);
      // Apply offset to get the correct UTC time
      local.setMinutes(local.getMinutes() + tzOffset);
      return local.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  // Returns the offset in minutes for a date in a given timezone
  getTimezoneOffsetMinutes(date: Date, timezone: string): number {
    const locale = 'en-US';
    const dtf = new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    });
    const [{ value: mo },,{ value: da },,{ value: ye },,{ value: ho },,{ value: mi }] = dtf.formatToParts(date);
    const asUTC = Date.UTC(Number(ye), Number(mo)-1, Number(da), Number(ho), Number(mi));
    return (asUTC - date.getTime()) / 60000;
  }

  // Display date/time in user's local format for a given timezone
  displayLocalDateTime(iso: string, timezone: string): string {
    try {
      const dt = new Date(iso);
      return dt.toLocaleString(undefined, { timeZone: timezone, year:'numeric', month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit' });
    } catch {
      return iso;
    }
  }

  showReminderBadge(item: TodoItem): boolean {
    if (item.completed) return false;
    const now = new Date();
    const due = new Date(item.dueDateTime);
    const diff = due.getTime() - now.getTime();
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
  }

  requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  checkAndNotifyReminders(): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now: Date = new Date();
    for (const item of this.todos) {
      if (item.completed) continue;
      const due: Date = new Date(item.dueDateTime);
      const diff: number = due.getTime() - now.getTime();
      if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
        const notifKey: string = `todo-reminder-notified-${item.id}-${now.toISOString().split('T')[0]}`;
        if (!window.localStorage.getItem(notifKey)) {
          new Notification('Task Reminder', {
            body: `Your task "${item.task}" is due soon (${this.displayLocalDateTime(item.dueDateTime, item.timezone)})!`,
            icon: ''
          });
          window.localStorage.setItem(notifKey, '1');
        }
      }
    }
  }

  checkOneMinuteReminders(): void {
    const now: Date = new Date();
    for (const item of this.todos) {
      if (item.completed) continue;
      const due: Date = new Date(item.dueDateTime);
      const diff: number = due.getTime() - now.getTime();
      if (diff > 0 && diff <= 60 * 1000) {
        const popupKey: string = `todo-popup-reminded-${item.id}-${due.toISOString()}`;
        if (!window.localStorage.getItem(popupKey)) {
          alert(`⏰ FINAL REMINDER: Task "${item.task}" is due within 1 minute!\nDue: ${this.displayLocalDateTime(item.dueDateTime, item.timezone)}`);
          window.localStorage.setItem(popupKey, '1');
        }
      }
    }
  }

  // Backup/restore
  downloadBackup(): void {
    this.componentDataDownloader(this.todos);
  }

  async uploadBackup(event: Event): Promise<void> {
    await this.componentDataUploader(event).then((data: any) => {
      if (Array.isArray(data)) {
        // Validate structure
        const valid: boolean = data.every((t: any) =>
          typeof t.id === 'number' &&
          typeof t.task === 'string' &&
          typeof t.completed === 'boolean' &&
          typeof t.dueDateTime === 'string' &&
          typeof t.timezone === 'string' &&
          Array.isArray(t.subtasks)
        );
        if (valid) {
          this.todos = data.map((t: any) => ({
            id: Number(t.id),
            task: String(t.task),
            completed: Boolean(t.completed),
            dueDateTime: String(t.dueDateTime),
            timezone: String(t.timezone),
            subtasks: Array.isArray(t.subtasks)
              ? t.subtasks.map((st: any) => ({
                  id: Number(st.id),
                  title: String(st.title),
                  completed: Boolean(st.completed)
                }))
              : []
          }));
          this.saveToLocalStorage();
          this.cdr.detectChanges();
          this.checkAndNotifyReminders();
        }
      }
    });
  }
}