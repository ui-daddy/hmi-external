import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonExternalComponent } from "../common-external/common-external.component";
import { Observable } from "rxjs";
import { Clipboard } from "@angular/cdk/clipboard";
import { StackblitzEditorComponent } from "../stackblitz-editor/stackblitz-editor.component";
import { DialogService } from "primeng/dynamicdialog";
import { deepClone } from "../../util/util";
import { DialogResult } from "../stackblitz-editor/stackblitz-editor.component";

interface MessagePart {
  type: "text" | "code";
  content: string;
  language?: string;
}

interface Message {
  isUser: boolean;
  parts: MessagePart[];
}

@Component({
  selector: "hmi-ext-generate-with-ai",
  templateUrl: "./generate-with-ai.component.html",
  styleUrls: ["./generate-with-ai.component.css"],
})
export class GenerateWithAiComponent
  extends CommonExternalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  messages: Message[] = [];

  @ViewChild("messagesContainer") private messagesContainer!: ElementRef;
  componentName: string = "";
  messageData: any = {}; // Initialize messageData
  actions: any;
  response$!: Observable<any>;
  content: any;
  showCopiedLabel: boolean = false;
  previewCode: string = "";
  previewDependencies: string = "";
  currentTime!: string;
  defaultSuggestions: string[] = [
    "An EMI Calculator...",
    "A diet tracker...",
    "An expense tracker...",
    "A tic-tac-toe game...",
    "A daily TODO list..."
  ];
  editSuggestions: string[] = [
    "Update the color scheme.",
    "Rearrange the layout.",
    "Change the text size to large."
  ];  
  private currentIndex: number = 0;
  public displayedText: string = '';
  private typingIntervalId: any;
  private erasingIntervalId: any;
  private pauseTimeoutId: any;
  isTypingActive: boolean = true;
  isEdit!: string | null;
  sourceTexts!: string[];
  isCollapsed: boolean = false;
  checkBuildEvent: any;
  downloadLogEvent: any;
  projectId!: string | null;
  readonly chatHistoryKey: string = 'history';

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private clipboard: Clipboard,
    public dialogService: DialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.queryParamMap.get('projectId');
    const history = JSON.parse(localStorage.getItem(this.chatHistoryKey) || '{}');
    this.getMessages(history);
    this.previewCode = history[this.projectId!]?.code || '';
    this.fieldObj.value = { newMessage: "" };
    this.fieldObj.action.subscribe((actionObj: any) => {
      if (actionObj.actionType === "setfield") {
        this.content = actionObj.data;
        const parts = this.parseCode(this.content.response);
        this.messages.push({
          isUser: false,
          parts,
        });

        if (this.projectId) {
          history[this.projectId] = {
            messages: this.messages,
            code: this.getLatestCode(this.messages),
            chatId: this.content.id
          };
          localStorage.setItem('history', JSON.stringify(history));
        }
        

        console.log('messages ',this.messages)
      }

      this.cdr.detectChanges();
      this.scrollToBottom();
    });

    const currentDate = new Date();
    // Format the date to get the weekday (e.g., "Sat")
    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'short' });
    // Format the time (e.g., "8:21 AM")
    const time = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    // Combine them into the desired format
     this.currentTime = `${dayOfWeek} ${time}`;
     this.isEdit = this.route.snapshot.queryParamMap.get('edit');
     this.typeText();
     this.checkBuildEvent = this.fieldObj.events?.find((evt: any) => evt.event === "checkBuildStatus");
     this.downloadLogEvent = this.fieldObj.events?.find((evt: any) => evt.event === "showLog");

  }

  private getMessages(history:any) {
    const projectMessages = history[this.projectId!]?.messages;
    if (projectMessages) {
      this.messages = projectMessages;
    }
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  preview(code: string, messageIndex: number, useDialog: boolean = true): void {
    if (useDialog) {
      this.dialogService
        .open(StackblitzEditorComponent, {
          header: "Page Preview",
          width: "100%",
          data: { 
            code: code, 
            dependencies: this.messages[messageIndex].parts.find(
              (part) => part.type === "code" && part.language === "json"
            )?.content || "{}", 
            isDialog: true 
          },
          height: "100vh",
          keepInViewport: true,
          baseZIndex: 500,
          contentStyle: { "flex-grow": 1 },
        })
        .onClose.subscribe((data: DialogResult) => {
          if (data?.action === "SAVE" && data.code != null) {
            this.createComponent(data.code, messageIndex);
          }
        });
    }
  }

  copycode(code: string): void {
    if (!this.showCopiedLabel) {
      let copyCodeEvent = this.fieldObj.events?.find(
        (obj: { event: string }) => obj.event === "copycode"
      );
      if (copyCodeEvent) {
        copyCodeEvent = deepClone(copyCodeEvent);
        this.initializeEvents.emit({
          name: "fireEvent",
          events: [copyCodeEvent],
          data: null,
        });
      }
      this.clipboard.copy(code);
      this.showCopiedLabel = true;
      setTimeout(() => {
        this.showCopiedLabel = false;
      }, 3000);
    }
  }

  sendMessage() {
    this.stopTyping();
    this.messageData.newMessage = this.fieldObj.value.newMessage;
    if (this.fieldObj.value.newMessage.trim()) {
      this.messages.push({
        isUser: true,
        parts: [
          { type: "text", content: this.fieldObj.value.newMessage.trim() },
        ],
      });
      let sendMsgEvent = this.fieldObj.events?.find(
        (obj: { event: string }) => obj.event === "sendmessage"
      );
      if (sendMsgEvent) {
        sendMsgEvent = deepClone(sendMsgEvent);
        sendMsgEvent.actions.forEach((action: any) => {
          if (
            action.actionType === "SET_SHARED_DATA" &&
            action.sharedData &&
            action.sharedData.length
          ) {
            action.sharedData.forEach((shareDataObj: any) => {
              if (shareDataObj.staticData === "$USER_QUERY$") {
                shareDataObj.staticData = this.messageData.newMessage;
              }
            });
          }
        });
        this.initializeEvents.emit({
          name: "fireEvent",
          events: [sendMsgEvent],
          data: null,
        });
        this.fieldObj.value.newMessage = "";
      } else {
        console.error("No Send Message event detected");
      }
    }
    this.scrollToBottom();
  }

  parseCode(response: string): MessagePart[] {
    let msgParts: MessagePart[] = this.parseMessage(response);
    return msgParts;
  }

  private parseMessage(message: string): MessagePart[] {
    const parts: MessagePart[] = [];
    const regex = /```([\w]+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(message)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: message.slice(lastIndex, match.index).trim(),
        });
      }
      parts.push({
        type: "code",
        content: match[2].trim(),
        language: match[1] || "",
      });
      lastIndex = regex.lastIndex;
      if(match[1] === "typescript") {
        this.previewCode = match[2].trim();
      } else if (match[1] === "json") {
        this.previewDependencies = match[2].trim();
      }
      
    }

    if (lastIndex < message.length) {
      parts.push({
        type: "text",
        content: message.slice(lastIndex).trim(),
      });
    }

    return parts;
  }

  private saveComponentCode(code: string, dependencies?: string): void {
    this.messageData.code = "```component.ts```\n" + code;
    if (dependencies) {
      this.messageData.code += "\n ```package.json``` \n" + dependencies;
    }

    let saveCompEvent = this.fieldObj.events?.find(
      (obj: { event: string }) => obj.event === "savecomponent"
    );
    if (saveCompEvent) {
      saveCompEvent = deepClone(saveCompEvent);
      saveCompEvent.actions.forEach((action: any) => {
        if (
          action.actionType === "SET_SHARED_DATA" &&
          action.sharedData &&
          action.sharedData.length
        ) {
          action.sharedData.forEach((shareDataObj: any) => {
            if (shareDataObj.staticData === "$SAVE_CODE_DATA$") {
              shareDataObj.staticData = this.messageData;
            }
          });
        }
      });

      this.initializeEvents.emit({
        name: "fireEvent",
        events: [saveCompEvent],
        data: null,
      });
    } else {
      console.error("No Copy Code event detected");
    }
  }

  createComponent(code: string, messageIndex: number): void {
    const dependencies = this.messages[messageIndex].parts.find(
      (part) => part.type === "code" && part.language === "json"
    )?.content || "{}";
    
    this.saveComponentCode(code, dependencies);
  }

  // Add this method to handle code changes when component is directly embedded
  onCodeChange(code: string): void {
    this.saveComponentCode(code, this.previewDependencies);
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTo({
        top: this.messagesContainer.nativeElement.scrollHeight,
        behavior: "smooth",
      });
    } catch (err) {}
  }

  ngOnDestroy(): void {
    this.stopTyping(); 
  }
 

  getValue(messageIndex: number, language: 'json'|'typescript') {
    return (
      this.messages[messageIndex].parts.find(
        (part) => part.type === "code" && part.language === language
      )?.content || "{}"
    );
  }

  // Add a getter for filtered messages
  get filteredMessages() {
    return this.messages?.filter(message => 
      message.parts?.some(part => part.type === 'text' && part.content)
    ) || []; 
  }

  private typeText(): void {
    if (!this.isTypingActive) return;
    this.sourceTexts = this.isEdit === 'true' ? this.editSuggestions : this.defaultSuggestions;


    const text = this.sourceTexts[this.currentIndex];
    let charIndex = 0;

    this.typingIntervalId = setInterval(() => {
      if (!this.isTypingActive) return;

      if (charIndex < text.length) {
        this.displayedText += text.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(this.typingIntervalId);
        this.pauseTimeoutId = setTimeout(() => {
          this.eraseText(text);
        }, 1500); // Wait before erasing
      }
    }, 75); // Typing speed
  }

  private eraseText(text: string): void {
    if (!this.isTypingActive) return;

    let charIndex = text.length;

     this.erasingIntervalId = setInterval(() => {
      if (!this.isTypingActive) return;

      if (charIndex > 0) {
        this.displayedText = text.substring(0, charIndex - 1);
        charIndex--;
      } else {
        clearInterval(this.erasingIntervalId);
        this.currentIndex = (this.currentIndex + 1) % this.sourceTexts.length; // Cycle through sourceTexts
        this.displayedText = ''; // Clear text before typing next
        this.typeText(); // Start typing next text
      }
    }, 75); // Erasing speed
  }

  stopTyping() {
    this.isTypingActive = false;
    clearInterval(this.typingIntervalId);
    clearInterval(this.erasingIntervalId);
    clearTimeout(this.pauseTimeoutId);
  }
  toggleCodeHeight(){
    this.isCollapsed = !this.isCollapsed;
  }

  getLatestCode(chatHistory: Message[]) {
    for (let chatHistoryLength = chatHistory.length - 1; chatHistoryLength >= 0; chatHistoryLength--) {
      const message = chatHistory[chatHistoryLength];
      if (!message.isUser) {
        const codePart = message.parts.find((part:any) => part.type === "code");
        if (codePart) {
          return codePart.content;
        }
      }
    }
    return null;
  }
}
