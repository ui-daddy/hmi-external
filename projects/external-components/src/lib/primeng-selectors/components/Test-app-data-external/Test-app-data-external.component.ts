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
      - Add, list, remove daily todo tasks with due dates.
      - Mark tasks as complete/incomplete.
      - Download/upload all app data (.txt file).
      - Data auto-saved in browser local storage.
      - Reminder notification one day before due date, including on every app open.
      - Responsive Bootstrap 5 UI.
    -->
    <div class="card shadow mt-4">
      <div class="card-header d-flex justify-content-between align-items-center bg-primary text-white">
        <span>Todo App - Daily Tasks with Due Dates</span>
        <div>
          <button class="btn btn-light btn-sm me-2" (click)="downloadData()">
            <i class="bi bi-download"></i> Download
          </button>
          <label class="btn btn-light btn-sm mb-0">
            <i class="bi bi-upload"></i> Upload
            <input type="file" accept=".txt" hidden (change)="uploadData($event)">
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
            <div>
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
            </div>
            <button class="btn btn-danger btn-sm" (click)="removeTask(item.id)">
              <i class="bi bi-trash"></i>
            </button>
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

  constructor(private cdr: ChangeDetectorRef) {
    super();
    this.today = this.getTodayString();
    this.loadFromLocalStorage();
  }

  ngOnInit(): void {
    this.requestNotificationPermission();
    // Show reminders immediately when app is opened
    setTimeout(() => this.checkAndNotifyReminders(), 500);
    setInterval(() => this.checkAndNotifyReminders(), 60 * 60 * 1000); // check every hour
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
  }

  toggleComplete(id: number): void {
    const idx: number = this.todos.findIndex((t: TodoItem) => t.id === id);
    if (idx > -1) {
      this.todos[idx].completed = !this.todos[idx].completed;
      this.saveToLocalStorage();
      this.cdr.detectChanges();
    }
  }

  downloadData(): void {
    const data: { todos: TodoItem[] } = { todos: this.todos };
    this.componentDataDownloader(data);
  }

  async uploadData(event: Event): Promise<void> {
    try {
      const uploaded: any = await this.componentDataUploader(event);
      if (uploaded && uploaded.todos && Array.isArray(uploaded.todos)) {
        this.todos = uploaded.todos.map((t: any) => ({
          id: Number(t.id),
          task: String(t.task),
          completed: Boolean(t.completed),
          dueDate: String(t.dueDate)
        }));
        this.saveToLocalStorage();
        this.cdr.detectChanges();
        this.checkAndNotifyReminders();
      }
    } catch (err) {
      // Optionally handle error
    }
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
      // Notify only if due within 24h and not overdue, and not already notified today
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
}