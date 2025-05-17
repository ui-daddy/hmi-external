import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-sample-test1',
  template: `
    <!--
      Features:
      - Add a note with title and content
      - Display list of notes
      - Delete a note
    -->
    <div class="notes-container">
      <h2>Simple Notes App</h2>
      <form (ngSubmit)="addNote()" #noteForm="ngForm" class="note-form">
        <input 
          type="text" 
          [(ngModel)]="newTitle" 
          name="title" 
          placeholder="Title" 
          required 
          maxlength="50"
        />
        <textarea 
          [(ngModel)]="newContent" 
          name="content" 
          placeholder="Content" 
          required 
          maxlength="200"
        ></textarea>
        <button type="submit" [disabled]="!noteForm.form.valid">Add Note</button>
      </form>

      <ul class="notes-list">
        <li *ngFor="let note of notes; let i = index" class="note-item">
          <strong>{{ note.title }}</strong>
          <p>{{ note.content }}</p>
          <button (click)="deleteNote(i)">Delete</button>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .notes-container {
      max-width: 400px;
      margin: 24px auto;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
    }
    .note-form input, .note-form textarea {
      width: 100%;
      margin-bottom: 10px;
      padding: 6px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 15px;
    }
    .note-form button {
      display: block;
      width: 100%;
      padding: 7px;
      background: #1976d2;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
    }
    .note-form button:disabled {
      background: #bdbdbd;
      cursor: not-allowed;
    }
    .notes-list {
      list-style: none;
      padding: 0;
      margin-top: 18px;
    }
    .note-item {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 10px;
      position: relative;
    }
    .note-item button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #e53935;
      color: #fff;
      border: none;
      border-radius: 3px;
      font-size: 13px;
      cursor: pointer;
      padding: 3px 8px;
    }
  `]
})
export class SampleTest1Component extends CommonExternalComponent {
  notes: Array<{ title: string; content: string }> = [];
  newTitle: string = '';
  newContent: string = '';

  addNote(): void {
    if (this.newTitle.trim() && this.newContent.trim()) {
      this.notes.push({ title: this.newTitle, content: this.newContent });
      this.newTitle = '';
      this.newContent = '';
    }
  }

  deleteNote(index: number): void {
    this.notes.splice(index, 1);
  }
}