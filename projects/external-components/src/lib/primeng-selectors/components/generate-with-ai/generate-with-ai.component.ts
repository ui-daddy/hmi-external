import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'hmi-ext-generate-with-ai',
  templateUrl: './generate-with-ai.component.html',
  styleUrls: ['./generate-with-ai.component.css']

})
export class GenerateWithAiComponent implements OnInit {
  messages!: Message[] ;

  constructor() { }

  ngOnInit(): void {
    this.messages = [
      { severity: 'info', detail: 'Info Message' },
      { severity: 'success', detail: 'Success Message' },
      { severity: 'warn', detail: 'Warning Message' },
      { severity: 'error', detail: 'Error Message' },
      { severity: 'secondary', detail: 'Secondary Message' },
      { severity: 'contrast', detail: 'Contrast Message' }
  ];
  }

}
