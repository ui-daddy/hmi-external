import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

/*
  Features:
  - Add a note with title and content
  - Display list of notes
  - Delete a note
  - Add multiple notes at once (multi-note mode)
  - All data is persisted in local storage by default
  - Download/upload your notes as a .txt file for backup or transfer
  - Uses Bootstrap 5 for styling and PrimeIcons v7 for icons
*/

@Component({
  selector: 'app-sample-test1',
  template: `
    <div class="container my-4">
      <div class="card shadow-sm">
        <!-- Header with Download/Upload -->
        <div class="card-header d-flex justify-content-between align-items-center bg-light">
          <h2 class="card-title mb-0 text-center flex-grow-1">Simple Notes App</h2>
          <div class="d-flex gap-2 align-items-center ms-2">
            <!-- Download Button -->
            <button 
              type="button"
              class="btn btn-outline-primary btn-sm"
              [disabled]="notes.length === 0"
              (click)="downloadNotes()"
              aria-label="Download Notes"
              title="Download Notes"
            >
              <i class="pi pi-download"></i>
            </button>
            <!-- Upload Button -->
            <label class="btn btn-outline-secondary btn-sm mb-0" title="Upload Notes">
              <i class="pi pi-upload"></i>
              <input 
                type="file" 
                accept=".txt"
                (change)="uploadNotes($event)"
                hidden
              />
            </label>
          </div>
        </div>
        <div class="card-body">
          <!-- Toggle for multi-note mode -->
          <div class="form-check form-switch mb-3">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="multiNoteSwitch" 
              [(ngModel)]="multiNoteMode"
              (change)="resetForm()"
            />
            <label class="form-check-label" for="multiNoteSwitch">
              Enable Multiple Notes Entry
            </label>
          </div>
          
          <!-- Single Note Form -->
          <form 
            *ngIf="!multiNoteMode" 
            (ngSubmit)="addNote()" 
            #noteForm="ngForm" 
            class="mb-4 needs-validation" 
            novalidate
          >
            <div class="mb-2">
              <input 
                type="text" 
                class="form-control"
                [(ngModel)]="newTitle" 
                name="title" 
                placeholder="Title" 
                required 
                maxlength="50"
                [ngClass]="{'is-invalid': noteForm.submitted && !newTitle}"
              />
              <div class="invalid-feedback">Title is required.</div>
            </div>
            <div class="mb-2">
              <textarea 
                class="form-control"
                [(ngModel)]="newContent" 
                name="content" 
                placeholder="Content" 
                required 
                maxlength="200"
                rows="2"
                [ngClass]="{'is-invalid': noteForm.submitted && !newContent}"
              ></textarea>
              <div class="invalid-feedback">Content is required.</div>
            </div>
            <button 
              type="submit" 
              class="btn btn-primary w-100"
              [disabled]="!noteForm.form.valid"
            >Add Note</button>
          </form>

          <!-- Multi Note Form -->
          <form 
            *ngIf="multiNoteMode" 
            (ngSubmit)="addMultipleNotes()" 
            #multiNoteForm="ngForm" 
            class="mb-4 needs-validation" 
            novalidate
          >
            <div class="mb-2">
              <label class="form-label fw-bold">Enter multiple notes below:</label>
              <textarea 
                class="form-control"
                [(ngModel)]="multiNotesInput" 
                name="multiNotesInput" 
                placeholder="Format: Title1|Content1\nTitle2|Content2"
                required
                rows="5"
                [ngClass]="{'is-invalid': multiNoteForm.submitted && !multiNotesInput.trim()}"
              ></textarea>
              <div class="form-text">
                Each line = one note. Use <code>|</code> to separate title and content.<br>
                Example:<br>
                Shopping|Buy milk and eggs<br>
                Work|Send project update
              </div>
              <div class="invalid-feedback">Please enter at least one note.</div>
            </div>
            <button 
              type="submit" 
              class="btn btn-success w-100"
              [disabled]="!multiNotesInput.trim()"
            >Add Multiple Notes</button>
          </form>

          <!-- Notes List -->
          <ul class="list-group mt-3" *ngIf="notes.length > 0">
            <li 
              *ngFor="let note of notes; let i = index" 
              class="list-group-item d-flex justify-content-between align-items-start"
            >
              <div class="ms-2 me-auto">
                <div class="fw-bold">{{ note.title }}</div>
                <span>{{ note.content }}</span>
              </div>
              <button 
                class="btn btn-sm btn-danger ms-2"
                (click)="deleteNote(i)"
                aria-label="Delete"
                title="Delete Note"
              >
                <i class="pi pi-trash"></i>
              </button>
            </li>
          </ul>
          <div *ngIf="notes.length === 0" class="alert alert-info mt-3 text-center">
            No notes yet.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      max-width: 480px;
      margin: 0 auto;
      border-radius: 1rem;
    }
    textarea.form-control {
      resize: vertical;
    }
    .list-group-item {
      background: #f8f9fa;
    }
    .btn-danger {
      font-size: 1.1em;
      padding: 0 0.7em;
      line-height: 1;
    }
    .card-header {
      border-bottom: 1px solid #dee2e6;
      border-radius: 1rem 1rem 0 0;
    }
    .pi {
      vertical-align: middle;
    }
  `]
})
export class SampleTest1Component extends CommonExternalComponent {
  notes: Array<{ title: string; content: string }> = [];
  newTitle: string = '';
  newContent: string = '';
  multiNoteMode: boolean = false;
  multiNotesInput: string = '';

  private readonly STORAGE_KEY: string = 'sampleTest1_notes';

  constructor(private cdr: ChangeDetectorRef) {
    super();
    this.loadNotes();
  }

  // Load notes from local storage on init
  loadNotes(): void {
    const stored: string | null = localStorage.getItem(this.STORAGE_KEY);
    this.notes = stored ? JSON.parse(stored) as Array<{ title: string; content: string }> : [];
  }

  // Save notes to local storage after any change
  saveNotes(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notes));
  }

  addNote(): void {
    if (this.newTitle.trim() && this.newContent.trim()) {
      this.notes.push({ title: this.newTitle.trim(), content: this.newContent.trim() });
      this.saveNotes();
      this.newTitle = '';
      this.newContent = '';
    }
  }

  addMultipleNotes(): void {
    if (!this.multiNotesInput.trim()) return;
    // Each line: Title|Content
    const lines: string[] = this.multiNotesInput.split('\n');
    for (const line of lines) {
      const [title, ...rest] = line.split('|');
      const content: string = rest.join('|');
      if (title && content) {
        this.notes.push({ title: title.trim().slice(0, 50), content: content.trim().slice(0, 200) });
      }
    }
    this.saveNotes();
    this.multiNotesInput = '';
  }

  deleteNote(index: number): void {
    if (index >= 0 && index < this.notes.length) {
      this.notes.splice(index, 1);
      this.saveNotes();
    }
  }

  resetForm(): void {
    this.newTitle = '';
    this.newContent = '';
    this.multiNotesInput = '';
  }

  // Download notes as .txt using parent function
  downloadNotes(): void {
    this.componentDataDownloader({ notes: this.notes });
  }

  // Upload notes from .txt using parent function, update view on upload
  async uploadNotes(event: Event): Promise<void> {
    const data: any = await this.componentDataUploader(event);
    if (data && data.notes && Array.isArray(data.notes)) {
      this.notes = data.notes.map((n: any) => ({
        title: typeof n.title === 'string' ? n.title.slice(0, 50) : '',
        content: typeof n.content === 'string' ? n.content.slice(0, 200) : ''
      }));
      this.saveNotes();
      this.cdr.detectChanges(); // Ensure UI updates after upload
    }
  }
}