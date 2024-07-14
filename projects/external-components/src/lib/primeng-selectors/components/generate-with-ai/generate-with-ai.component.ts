import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { Observable } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';



interface MessagePart {
  type: 'text' | 'code';
  content: string;
}

interface Message {
  isUser: boolean;
  parts: MessagePart[];
}

@Component({
  selector: 'hmi-ext-generate-with-ai',
  templateUrl: './generate-with-ai.component.html',
  styleUrls: ['./generate-with-ai.component.css']

})
export class GenerateWithAiComponent extends CommonExternalComponent implements OnInit, AfterViewInit, OnDestroy {
  messages: Message[] = [];

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  componentName: string = "";
  messageData: any = {}; // Initialize messageData
  actions:any;
  response$!: Observable<any>
  content: any;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private clipboard: Clipboard) {
    super();
   }

   ngOnInit(): void {
    
    this.fieldObj.value = { newMessage: '' };   
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  sendMessage() {
    this.messageData.newMessage = this.fieldObj.value.newMessage; 
    if (this.fieldObj.value.newMessage.trim()) {
      this.messages.push({
        isUser: true,
        parts: [{ type: 'text', content: this.fieldObj.value.newMessage.trim() }]
      });
      this.fieldObj.value.newMessage = '';      
      this.initializeEvents.emit({ name: "fireEvent", "events": [this.fieldObj.events[0]], data: null});

      this.subscription = this.fieldObj.action.subscribe((actionObj: any) => {
      
        if (actionObj.actionType === "setfield") {
          console.log( actionObj.data);
          this.content = actionObj.data;
          const parts = this.parseMessage(this.content.response);
          this.messages.push({
            isUser: false,
            parts
          });
        }
        this.subscription.unsubscribe();
        
        this.cdr.detectChanges();
        this.scrollToBottom();
      });

      this.scrollToBottom();
    }
    this.scrollToBottom();

  }

  private parseMessage(message: string): MessagePart[] {
    const parts: MessagePart[] = [];
    const regex = /```(?:\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(message)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: message.slice(lastIndex, match.index).trim()
        });
      }
      parts.push({
        type: 'code',
        content: match[1].trim()
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < message.length) {
      parts.push({
        type: 'text',
        content: message.slice(lastIndex).trim()
      });
    }

    return parts;
  }

  copycode(code:any){
    //console.log(code)
    this.clipboard.copy(code);
    this.messageData.code = code;
    this.fieldObj.events.forEach((event: any) => {
      event.actions.forEach((action: any) => {
        if (action.actionType === "SET_SHARED_DATA" && action.sharedData && action.sharedData.length) {
          action.sharedData.forEach((shareDataObj: any) => {
            if (shareDataObj.staticData === "$copyCodeDatas$") {
              shareDataObj.staticData = this.messageData;
            }
          });
        }
      });
    });

    this.initializeEvents.emit({ name: "fireEvent", "events": [this.fieldObj.events[1]], data: null});

  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTo({
        top: this.messagesContainer.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    } catch (err) { }
  }

 
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  } 
}
