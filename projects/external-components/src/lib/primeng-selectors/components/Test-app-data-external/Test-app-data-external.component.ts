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
  dueDateTime: string;
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
        - Popup alert with modern UI when less than 1 minute remains.
      - Mobile-first Bootstrap 5 UI, simplified layout for small screens.
      - Filters/search in an accordion for mobile usability.
      - Strict type checking throughout.
      - Delete uses a visible trash icon (PrimeIcons).
      - Edit uses a pencil icon (PrimeIcons).
      - Backup uses cloud-download and cloud-upload icons (PrimeIcons).
      - Timezone selection per task.
      - Search/filter by text, date, time, and timezone.
    -->
    <div class="card shadow-sm mt-3 mobile-max-w">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center px-2 py-2">
        <span class="fw-semibold fs-6">Todo</span>
        <div class="d-flex gap-1">
          <button class="btn btn-outline-light btn-sm p-1" (click)="downloadBackup()" aria-label="Download backup" title="Download backup">
            <i class="pi pi-cloud-download"></i>
          </button>
          <label class="btn btn-outline-light btn-sm mb-0 p-1" title="Upload backup">
            <i class="pi pi-cloud-upload"></i>
            <input type="file" accept=".txt" class="d-none" (change)="uploadBackup($event)" aria-label="Upload backup">
          </label>
        </div>
      </div>
      <div class="card-body p-2">

        <!-- Filter/Search Accordion -->
        <div class="accordion mb-2" id="filterAccordion">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingFilter">
              <button class="accordion-button collapsed py-2 px-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilter"
                aria-expanded="false" aria-controls="collapseFilter">
                <i class="pi pi-filter me-2"></i>Filters &amp; Search
              </button>
            </h2>
            <div id="collapseFilter" class="accordion-collapse collapse" aria-labelledby="headingFilter" data-bs-parent="#filterAccordion">
              <div class="accordion-body py-2 px-2">
                <form class="row g-1" (ngSubmit)="$event.preventDefault()">
                  <div class="col-12">
                    <input type="text" class="form-control form-control-sm" placeholder="Search..." [(ngModel)]="searchText" name="searchText" maxlength="100" [ngModelOptions]="{standalone: true}">
                  </div>
                  <div class="col-6">
                    <input type="date" class="form-control form-control-sm" [(ngModel)]="filterDate" name="filterDate" [ngModelOptions]="{standalone: true}">
                  </div>
                  <div class="col-6">
                    <input type="time" class="form-control form-control-sm" [(ngModel)]="filterTime" name="filterTime" [ngModelOptions]="{standalone: true}">
                  </div>
                  <div class="col-8">
                    <select class="form-select form-select-sm" [(ngModel)]="filterTimezone" name="filterTimezone" [ngModelOptions]="{standalone: true}">
                      <option value="">All Timezones</option>
                      <option *ngFor="let tz of timezones" [value]="tz">{{tz}}</option>
                    </select>
                  </div>
                  <div class="col-4 d-grid">
                    <button type="button" class="btn btn-outline-secondary btn-sm" (click)="clearFilters()" title="Clear filters">
                      <i class="pi pi-filter-slash"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Task Compact -->
        <form class="row g-1 mb-2" (ngSubmit)="addTask()">
          <div class="col-12">
            <input type="text" class="form-control form-control-sm" placeholder="New task..." [(ngModel)]="newTask" name="task" required maxlength="100" [ngModelOptions]="{standalone: true}">
          </div>
          <div class="col-6">
            <input type="date" class="form-control form-control-sm" [(ngModel)]="newDueDate" name="dueDate" required min="{{today}}" [ngModelOptions]="{standalone: true}">
          </div>
          <div class="col-6">
            <input type="time" class="form-control form-control-sm" [(ngModel)]="newDueTime" name="dueTime" required [ngModelOptions]="{standalone: true}">
          </div>
          <div class="col-8">
            <select class="form-select form-select-sm" [(ngModel)]="newTimezone" name="timezone" required [ngModelOptions]="{standalone: true}">
              <option *ngFor="let tz of timezones" [value]="tz">{{tz}}</option>
            </select>
          </div>
          <div class="col-4 d-grid">
            <button type="submit" class="btn btn-success btn-sm w-100">Add</button>
          </div>
        </form>
        <!-- Tasks List (Mobile Card Style) -->
        <ul class="list-group border-0">
          <li *ngFor="let item of filteredTodos()" class="list-group-item px-1 py-2 border-0 border-bottom mobile-list-li">
            <div class="d-flex align-items-center justify-content-between">
              <div class="flex-grow-1">
                <ng-container *ngIf="editId !== item.id; else editBlock">
                  <div class="d-flex align-items-center">
                    <input class="form-check-input me-2" type="checkbox" [checked]="item.completed" (change)="toggleComplete(item.id)">
                    <span [class.text-decoration-line-through]="item.completed" class="fw-semibold small">{{ item.task }}</span>
                  </div>
                  <div class="small ms-4 mt-1">
                    <span class="badge bg-secondary me-1 mb-1">
                      {{ displayLocalDateTime(item.dueDateTime, item.timezone) }}
                    </span>
                    <span class="badge bg-info text-dark me-1 mb-1">{{item.timezone}}</span>
                    <span *ngIf="showReminderBadge(item)" class="badge bg-warning text-dark mb-1">Reminder!</span>
                  </div>
                </ng-container>
                <ng-template #editBlock>
                  <div class="d-flex flex-wrap gap-1 align-items-center">
                    <input type="text" class="form-control form-control-sm w-auto" [(ngModel)]="editTask" maxlength="100" required [ngModelOptions]="{standalone: true}" style="max-width:130px;">
                    <input type="date" class="form-control form-control-sm w-auto" [(ngModel)]="editDueDate" [min]="today" required [ngModelOptions]="{standalone: true}" style="max-width:90px;">
                    <input type="time" class="form-control form-control-sm w-auto" [(ngModel)]="editDueTime" required [ngModelOptions]="{standalone: true}" style="max-width:80px;">
                    <select class="form-select form-select-sm w-auto" [(ngModel)]="editTimezone" required [ngModelOptions]="{standalone: true}" style="max-width:110px;">
                      <option *ngFor="let tz of timezones" [value]="tz">{{tz}}</option>
                    </select>
                  </div>
                </ng-template>
              </div>
              <div class="ms-2 d-flex flex-column gap-1 align-items-end">
                <ng-container *ngIf="editId !== item.id; else editActions">
                  <button class="btn btn-outline-secondary btn-xs btn-sm p-1" (click)="startEdit(item)" aria-label="Edit"><i class="pi pi-pencil"></i></button>
                  <button class="btn btn-danger btn-xs btn-sm p-1" (click)="removeTask(item.id)" aria-label="Delete"><i class="pi pi-trash"></i></button>
                </ng-container>
                <ng-template #editActions>
                  <button class="btn btn-success btn-xs btn-sm p-1" (click)="saveEdit(item.id)" aria-label="Save"><i class="pi pi-check"></i></button>
                  <button class="btn btn-outline-secondary btn-xs btn-sm p-1" (click)="cancelEdit()" aria-label="Cancel"><i class="pi pi-times"></i></button>
                </ng-template>
              </div>
            </div>
            <!-- Subtasks (Accordion style on mobile) -->
            <div class="mt-1 ms-4">
              <div class="d-flex align-items-center mb-1 gap-1">
                <input type="text" class="form-control form-control-sm me-1" placeholder="Subtask..." [(ngModel)]="subtaskInputs[item.id]" [ngModelOptions]="{standalone: true}" maxlength="60" style="max-width:120px;" (keyup.enter)="addSubtask(item.id)">
                <button class="btn btn-outline-primary btn-xs btn-sm p-1" (click)="addSubtask(item.id)"><i class="pi pi-plus"></i></button>
              </div>
              <ul class="list-group list-group-flush ps-2">
                <li *ngFor="let st of item.subtasks" class="list-group-item py-1 px-0 d-flex align-items-center border-0">
                  <input class="form-check-input me-2" type="checkbox" [checked]="st.completed" (change)="toggleSubtaskComplete(item.id, st.id)">
                  <span [class.text-decoration-line-through]="st.completed" class="flex-grow-1 small" *ngIf="!isEditingSubtask(item.id, st.id); else subEditBlock">{{st.title}}</span>
                  <ng-template #subEditBlock>
                    <input type="text" class="form-control form-control-sm d-inline-block w-auto me-2" [(ngModel)]="editingSubtaskTitle" maxlength="60" required [ngModelOptions]="{standalone: true}" style="max-width:90px;">
                  </ng-template>
                  <ng-container *ngIf="!isEditingSubtask(item.id, st.id); else subEditActions">
                    <button class="btn btn-outline-secondary btn-xs btn-sm me-1 p-1" (click)="startEditSubtask(item.id, st)" aria-label="Edit"><i class="pi pi-pencil"></i></button>
                    <button class="btn btn-danger btn-xs btn-sm p-1" (click)="removeSubtask(item.id, st.id)" aria-label="Delete"><i class="pi pi-trash"></i></button>
                  </ng-container>
                  <ng-template #subEditActions>
                    <button class="btn btn-success btn-xs btn-sm me-1 p-1" (click)="saveEditSubtask(item.id, st.id)" aria-label="Save"><i class="pi pi-check"></i></button>
                    <button class="btn btn-outline-secondary btn-xs btn-sm p-1" (click)="cancelEditSubtask()" aria-label="Cancel"><i class="pi pi-times"></i></button>
                  </ng-template>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <div *ngIf="filteredTodos().length === 0" class="alert alert-info mt-2 mb-0 py-2 px-1 text-center small">
          No tasks found.
        </div>
      </div>
    </div>
    <!-- Modern Popup for Final Reminder -->
    <div *ngIf="finalReminderPopup.visible" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.45);" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-warning shadow-lg">
          <div class="modal-header bg-warning text-dark py-2 px-3">
            <h6 class="modal-title"><i class="pi pi-bell me-2"></i>Final Reminder</h6>
            <button type="button" class="btn-close" aria-label="Close" (click)="closeFinalReminderPopup()"></button>
          </div>
          <div class="modal-body py-2 px-3">
            <p class="mb-2 fw-bold small">{{finalReminderPopup.task}}</p>
            <p class="mb-1 small"><i class="pi pi-clock me-1"></i>Due: {{finalReminderPopup.due}}</p>
            <div class="alert alert-warning py-2 mb-0 small">
              ⏰ This task is due within 1 minute!
            </div>
          </div>
          <div class="modal-footer py-2 px-3">
            <button type="button" class="btn btn-outline-secondary btn-sm" (click)="closeFinalReminderPopup()">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-max-w { max-width: 430px; margin: auto; border-radius: 12px; }
    .form-control, .form-select { font-size: 1rem; }
    .form-control-sm, .form-select-sm { font-size: 0.98rem; }
    .list-group-item { font-size: 0.99rem; }
    .text-decoration-line-through { color: #6c757d !important; }
    .btn-xs { padding: 0.15rem 0.35rem; font-size: 0.85em; line-height: 1; }
    .modal-backdrop.show { opacity: 0.45; }
    .modal.fade.show.d-block { z-index: 2000; }
    .mobile-list-li { border-radius: 10px; background: #f9fbfc; margin-bottom: 7px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);}
    @media (max-width: 600px) {
      .mobile-max-w { max-width: 100vw; margin: 0.2rem; border-radius: 0.5rem; }
      .card-body { padding: 0.7rem 0.3rem !important; }
      .mobile-list-li { padding-left: 0.5rem; padding-right: 0.5rem; }
      .modal-dialog { margin: 1rem; }
      .modal-content { font-size: 0.97rem; }
    }
    @media (max-width: 400px) {
      .mobile-max-w { margin: 0; border-radius: 0; }
      .modal-dialog { margin: 0.2rem; }
    }
    .d-grid > .btn, .d-grid > label.btn { width: 100%; }
    .accordion-button { font-size: 1rem; }
    .accordion-body { background: #f8fafd; }
  `]
})
export class TestAppDataComponent extends CommonExternalComponent implements OnInit {
  public todos: TodoItem[] = [];
  public newTask: string = '';
  public newDueDate: string = '';
  public newDueTime: string = '';
  public newTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  public today: string = '';

  public editId: number | null = null;
  public editTask: string = '';
  public editDueDate: string = '';
  public editDueTime: string = '';
  public editTimezone: string = this.newTimezone;

  public subtaskInputs: {[taskId: number]: string} = {};
  public editingSubtaskId: {taskId: number, subId: number} | null = null;
  public editingSubtaskTitle: string = '';

  public searchText: string = '';
  public filterDate: string = '';
  public filterTime: string = '';
  public filterTimezone: string = '';

  public finalReminderPopup: {visible: boolean, task: string, due: string} = {visible: false, task: '', due: ''};
  private lastPopupKey: string = '';

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
    setInterval(() => this.checkAndNotifyReminders(), 60 * 60 * 1000);
    setInterval(() => this.checkOneMinuteReminders(), 10 * 1000);
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
    if (this.editId === id) this.cancelEdit();
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
      if (this.isEditingSubtask(taskId, subId)) this.cancelEditSubtask();
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

  parseDateTime(iso: string, timezone: string): {date: string, time: string} {
    try {
      const dt = new Date(iso);
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

  combineDateTime(date: string, time: string, timezone: string): string {
    try {
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute] = time.split(':').map(Number);
      const local = new Date(Date.UTC(year, month - 1, day, hour, minute));
      const tzOffset = -this.getTimezoneOffsetMinutes(local, timezone);
      local.setMinutes(local.getMinutes() + tzOffset);
      return local.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

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
    for (const item of this.filteredTodosRaw()) {
      if (item.completed) continue;
      const due: Date = new Date(item.dueDateTime);
      const diff: number = due.getTime() - now.getTime();
      if (diff > 0 && diff <= 60 * 1000) {
        const popupKey: string = `todo-popup-reminded-${item.id}-${due.toISOString()}`;
        if (this.lastPopupKey !== popupKey && !window.localStorage.getItem(popupKey)) {
          this.finalReminderPopup.visible = true;
          this.finalReminderPopup.task = `⏰ FINAL REMINDER: Task "${item.task}"`;
          this.finalReminderPopup.due = this.displayLocalDateTime(item.dueDateTime, item.timezone);
          this.lastPopupKey = popupKey;
          window.localStorage.setItem(popupKey, '1');
          this.cdr.detectChanges();
          break;
        }
      }
    }
  }

  closeFinalReminderPopup(): void {
    this.finalReminderPopup.visible = false;
    this.finalReminderPopup.task = '';
    this.finalReminderPopup.due = '';
    this.cdr.detectChanges();
  }

  downloadBackup(): void {
    this.componentDataDownloader(this.todos);
  }

  async uploadBackup(event: Event): Promise<void> {
    await this.componentDataUploader(event).then((data: any) => {
      if (Array.isArray(data)) {
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

  filteredTodosRaw(): TodoItem[] {
    return this.todos.slice();
  }

  filteredTodos(): TodoItem[] {
    let list: TodoItem[] = this.todos.slice();

    if (this.searchText.trim()) {
      const q: string = this.searchText.trim().toLowerCase();
      list = list.filter(item =>
        item.task.toLowerCase().includes(q) ||
        (item.subtasks && item.subtasks.some(st => st.title.toLowerCase().includes(q)))
      );
    }
    if (this.filterDate) {
      list = list.filter(item => {
        const dt = this.parseDateTime(item.dueDateTime, item.timezone);
        return dt.date === this.filterDate;
      });
    }
    if (this.filterTime) {
      list = list.filter(item => {
        const dt = this.parseDateTime(item.dueDateTime, item.timezone);
        return dt.time === this.filterTime;
      });
    }
    if (this.filterTimezone) {
      list = list.filter(item => item.timezone === this.filterTimezone);
    }
    return list;
  }

  clearFilters(): void {
    this.searchText = '';
    this.filterDate = '';
    this.filterTime = '';
    this.filterTimezone = '';
    this.cdr.detectChanges();
  }
}