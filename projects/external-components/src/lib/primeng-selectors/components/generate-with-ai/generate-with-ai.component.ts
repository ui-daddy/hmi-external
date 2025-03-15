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

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private clipboard: Clipboard,
    public dialogService: DialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.fieldObj.value = { newMessage: "" };
    this.fieldObj.action.subscribe((actionObj: any) => {
      if (actionObj.actionType === "setfield") {
        console.log(actionObj.data);
        this.content = actionObj.data;
        const parts = this.parseCode(this.content.response);
        this.messages.push({
          isUser: false,
          parts,
        });
        console.log('messages ',this.messages)
      }

      this.cdr.detectChanges();
      this.scrollToBottom();
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  preview(code: string, messageIndex: number): void {
    const dependencies =
      this.messages[messageIndex].parts.find(
        (part) => part.type === "code" && part.language === "json"
      )?.content || "{}";
    this.dialogService
      .open(StackblitzEditorComponent, {
        header: "Page Preview",
        width: "100%",
        data: { code: code, dependencies: dependencies },
        height: "100vh",
        keepInViewport: true,
        baseZIndex: 500,
        contentStyle: { "flex-grow": 1 },
      })
      .onClose.subscribe((data: any) => {
        if (data?.action === "SAVE") {
          this.createComponent(data.code, messageIndex);
        }
      });
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

  createComponent(code: any, messageIndex: number) {
    this.messageData.code = "```component.ts```\n" + code;
    if (messageIndex != null) {
      const dependencies =
        this.messages[messageIndex].parts.find(
          (part) => part.type === "code" && part.language === "json"
        )?.content || "{}";
      this.messageData.code =
        this.messageData.code + "\n ```package.json``` \n" + dependencies;
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

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTo({
        top: this.messagesContainer.nativeElement.scrollHeight,
        behavior: "smooth",
      });
    } catch (err) {}
  }

  ngOnDestroy(): void {}

  getValue(messageIndex: number, language: 'json'|'typescript') {
    return (
      this.messages[messageIndex].parts.find(
        (part) => part.type === "code" && part.language === language
      )?.content || "{}"
    );
  }
}
