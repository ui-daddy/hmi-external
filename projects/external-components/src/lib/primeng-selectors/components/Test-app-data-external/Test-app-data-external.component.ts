// test-app-data.component.ts

import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
  dueDate: string; // ISO date string (YYYY-MM-DD)
}

@Component({
  selector: 'app-test-app-data',
  template: `
    <!-- 
      Features:
      - Add, edit, list, remove daily todo tasks with due dates.
      - Mark tasks as complete/incomplete.
      - Edit task or due date inline with save/cancel actions.
      - Data auto-saved in browser local storage.
      - Backup & restore: Download/upload all saved data (.txt).
      - Reminder notification one day before due date, including on every app open.
      - Responsive Bootstrap 5 UI.
      - Strict type checking throughout.
      - Delete uses a visible trash icon (PrimeIcons).
      - Edit uses a pencil icon (PrimeIcons).
      - Backup uses cloud-download and cloud-upload icons (PrimeIcons).
    -->
    <div class="card shadow mt-4">
      <div class="card-header d-flex justify-content-between align-items-center bg-primary text-white">
        <span>Todo App - Daily Tasks with Due Dates</span>
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
          <div class="col-md-6 col-12">
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
          <div class="col-md-4 col-8">
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
          <div class="col-md-2 col-4 d-grid">
            <button type="submit" class="btn btn-success">Add Task</button>
          </div>
        </form>
        <ul class="list-group">
          <li *ngFor="let item of todos" class="list-group-item d-flex justify-content-between align-items-center">
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
                  Due: {{ item.dueDate | date:'mediumDate' }}
                </span>
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
                  style="max-width:180px;"
                  aria-label="Edit task"
                >
                <input 
                  type="date" 
                  class="form-control d-inline-block w-auto me-2"
                  [(ngModel)]="editDueDate"
                  [min]="today"
                  required
                  [ngModelOptions]="{standalone: true}"
                  style="max-width:140px;"
                  aria-label="Edit due date"
                >
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
          </li>
        </ul>
        <div *ngIf="todos.length === 0" class="alert alert-info mt-3 mb-0">
          No tasks yet. Start by adding a new task!
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { max-width: 700px; margin: auto; }
    .form-control { font-size: 1rem; }
    .list-group-item { font-size: 1.05rem; }
    .text-decoration-line-through { color: #6c757d !important; }
    .cursor-pointer { cursor: pointer; }
    @media (max-width: 576px) {
      .card { margin: 1rem; }
      .col-md-6, .col-md-4, .col-md-2, .col-12, .col-8, .col-4 { flex: 0 0 100%; max-width: 100%; }
      .d-grid { margin-top: 0.5rem; }
    }
  `]
})
export class TestAppDataComponent extends CommonExternalComponent implements OnInit {
  public todos: TodoItem[] = [];
  public newTask: string = '';
  public newDueDate: string = '';
  public today: string = '';

  // For editing
  public editId: number | null = null;
  public editTask: string = '';
  public editDueDate: string = '';

  constructor(private cdr: ChangeDetectorRef) {
    super();
    this.today = this.getTodayString();
    this.loadFromLocalStorage();
  }

  ngOnInit(): void {
    this.requestNotificationPermission();
    setTimeout(() => this.checkAndNotifyReminders(), 500);
    setInterval(() => this.checkAndNotifyReminders(), 60 * 60 * 1000);
  }

  addTask(): void {
    const trimmed: string = this.newTask.trim();
    if (trimmed && this.newDueDate) {
      const newId: number = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id)) + 1 : 1;
      this.todos.push({ id: newId, task: trimmed, completed: false, dueDate: this.newDueDate });
      this.saveToLocalStorage();
      this.newTask = '';
      this.newDueDate = '';
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
    this.editDueDate = item.dueDate;
    this.cdr.detectChanges();
  }

  saveEdit(id: number): void {
    const trimmed: string = this.editTask.trim();
    if (!trimmed || !this.editDueDate) return;
    const idx: number = this.todos.findIndex((t: TodoItem) => t.id === id);
    if (idx > -1) {
      this.todos[idx].task = trimmed;
      this.todos[idx].dueDate = this.editDueDate;
      this.saveToLocalStorage();
      this.editId = null;
      this.editTask = '';
      this.editDueDate = '';
      this.cdr.detectChanges();
      this.checkAndNotifyReminders();
    }
  }

  cancelEdit(): void {
    this.editId = null;
    this.editTask = '';
    this.editDueDate = '';
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
            dueDate: String(t.dueDate)
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

  showReminderBadge(item: TodoItem): boolean {
    if (item.completed) return false;
    const due: Date = new Date(item.dueDate);
    const now: Date = new Date();
    const diff: number = due.getTime() - now.getTime();
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
      const due: Date = new Date(item.dueDate);
      const diff: number = due.getTime() - now.getTime();
      if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
        const notifKey: string = `todo-reminder-notified-${item.id}-${now.toISOString().split('T')[0]}`;
        if (!window.localStorage.getItem(notifKey)) {
          new Notification('Task Reminder', {
            body: `Your task "${item.task}" is due tomorrow (${due.toLocaleDateString()})!`,
            icon: ''
          });
          window.localStorage.setItem(notifKey, '1');
        }
      }
    }
  }

  // Backup/restore
  downloadBackup(): void {
    // Passes the todos object to the downloader function from CommonExternalComponent
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
          typeof t.dueDate === 'string'
        );
        if (valid) {
          this.todos = data.map((t: any) => ({
            id: Number(t.id),
            task: String(t.task),
            completed: Boolean(t.completed),
            dueDate: String(t.dueDate)
          }));
          this.saveToLocalStorage();
          this.cdr.detectChanges();
          this.checkAndNotifyReminders();
        }
      }
    });
  }
}