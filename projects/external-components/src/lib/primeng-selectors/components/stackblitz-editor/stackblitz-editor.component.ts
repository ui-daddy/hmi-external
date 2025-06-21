export interface DialogResult {
  action: 'SAVE' | 'CANCEL';
  code?: string;
}

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone, 
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  Optional,
  AfterViewInit,
} from '@angular/core';
import sdk from '@stackblitz/sdk';
import { isIosDevice } from '../../util/platform';
import { STACKBLITZ_ANGULAR_JSON, STACKBLITZ_APP_MODULE_TS, STACKBLITZ_COMMON_EXTERNAL_TS, STACKBLITZ_COMPONENT_CLASS_NAME, STACKBLITZ_COMPONENT_SELECTOR, STACKBLITZ_DEPENDENCIES, STACKBLITZ_HMI_PREVIEW_APP_COMP_HTML, STACKBLITZ_HMI_PREVIEW_APP_COMPONENT_TS, STACKBLITZ_INDEX_HTML, STACKBLITZ_MAIN_TS, STACKBLITZ_POLLYFILL_TS, STACKBLITZ_STYLES_CSS } from '../../constant/stackblitz-constant';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hmi-ext-stackblitz-editor',
  templateUrl: './stackblitz-editor.component.html',
  styleUrls: ['./stackblitz-editor.component.css']
})
export class StackblitzEditorComponent implements AfterViewInit, OnChanges {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;
  projectSnapshot: any;
  component = {
    selector: '',
    className: '',
  };
  onLoad = true;
  onIOS = isIosDevice(); // Flag to detect iOS devices

  @Input() code: string = '';
  @Input() dependencies: string = '';
  @Input() isDialog: boolean = true;
  @Input() customApiCall: any;
  @Input() initializeEvents:any;
  @Input() downloadLogEvent:any;
  @Input() checkBuildEvent:any;
  @Output() codeChange = new EventEmitter<string>();
  isBuildAppDisabled: boolean = false;
  intervalId: any;
  showSuccess: boolean = false;
  buildLog: any;
  showModal: boolean = false;
  buildStatus: any;
  previewLink!: string;
  buildStatusCompleted: boolean = false;
  override!: string | null;
  guestUser: boolean= false;

  constructor(
    private zone: NgZone,
    @Optional() public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.guestUser = !this.isLoggedInCheck()
  }
  ngAfterViewInit(): void {
    this.override = localStorage.getItem('override');
    if (!this.onIOS) {
      this.embedEditor();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.projectSnapshot) {
      return;
    }

    if (changes['code'] && !changes['code'].firstChange) {
      this.updateComponentFile();
    }
    if (changes['dependencies'] && !changes['dependencies'].firstChange) {
      this.updateDependencies();
    }
  }

  private async updateComponentFile(): Promise<void> {
    if (!this.component.selector) {
      this.component.selector = this.getSelectorName(this.code);
      this.component.className = this.getClassName(this.code);
    }
    
    try {
      await this.projectSnapshot.applyFsDiff({
        create: {
          [`src/app/${this.component.selector}/${this.component.selector}.component.ts`]: this.code
        },
        destroy: []
      });
    } catch (error) {
      console.error('Failed to update component file:', error);
    }
  }

  private async updateDependencies(): Promise<void> {
    try {
      const newDependencies = this.dependencies ? JSON.parse(this.dependencies).dependencies : {};
      await this.projectSnapshot.setPackageJson({
        dependencies: {
          ...STACKBLITZ_DEPENDENCIES,
          ...newDependencies
        }
      });
    } catch (error) {
      console.error('Failed to update dependencies:', error);
    }
  }

  getSelectorName(componentString: string): string {
    const selectorRegex = /selector:\s*['"`]([^'"`]+)['"`]/;
    const match = componentString.match(selectorRegex);
    return match ? match[1] : "";
  }

  getClassName(componentString: string): string {
    const classRegex = /export\s+class\s+([A-Za-z0-9_]+)/;
    const match = componentString.match(classRegex);
    return match ? match[1] : "";
  }

  embedEditor(): void {
    this.component = {
      selector: this.getSelectorName(this.code),
      className: this.getClassName(this.code),
    };
    if (!this.component.selector || !this.component.className) {
      console.error("Not able to find component selector or class name", this.component.selector, this.component.className);
      return;
    }
    let finalAppModule: any = STACKBLITZ_APP_MODULE_TS;
    finalAppModule = finalAppModule.replaceAll(STACKBLITZ_COMPONENT_CLASS_NAME, this.component.className).replaceAll(STACKBLITZ_COMPONENT_SELECTOR, this.component.selector);
    const files = {
      'src/main.ts': STACKBLITZ_MAIN_TS,
      [`src/app/${this.component.selector}/${this.component.selector}.component.ts`]: this.code,
      'src/styles.css': STACKBLITZ_STYLES_CSS,
      'src/app/hmi-preview-app.component.ts': STACKBLITZ_HMI_PREVIEW_APP_COMPONENT_TS,
      'src/app/hmi-preview-app.component.html': STACKBLITZ_HMI_PREVIEW_APP_COMP_HTML.replaceAll(STACKBLITZ_COMPONENT_SELECTOR, this.component.selector),
      'src/app/app.module.ts': finalAppModule,
      'src/app/common-external/common-external.component.ts': STACKBLITZ_COMMON_EXTERNAL_TS,
      'angular.json': STACKBLITZ_ANGULAR_JSON,
      'src/index.html': STACKBLITZ_INDEX_HTML,
      'src/polyfills.ts': STACKBLITZ_POLLYFILL_TS,
    };
    if (!this.editorContainer || !this.editorContainer.nativeElement) {
      console.error('Editor container not found');
      return;
    }
    sdk.embedProject(
      this.editorContainer.nativeElement,
      {
        title: 'Angular Editor',
        description: 'Angular editor with live preview',
        template: 'angular-cli',
        files: files,
        dependencies: {
          ...STACKBLITZ_DEPENDENCIES,
          ...(this.dependencies && JSON.parse(this.dependencies).dependencies || {})
        },
      },
      {
        height: 500,
        openFile: `src/app/${this.component.selector}/${this.component.selector}.component.ts`,
        view: 'preview',
        hideDevTools: true,
        hideExplorer: true,
        showSidebar: false,
        theme: "light",
        hideNavigation: true
      }
    ).then((snapshot: any) => {
      this.projectSnapshot = snapshot;

      snapshot._rdc.port.onmessage = (event: MessageEvent) => {
        console.log('Message received from StackBlitz VM:', event.data);
        // Handle different types of messages here
        this.zone.run(() => {
          if (this.onLoad) {
            this.onLoad = false;
          } else if (
            event.data.type === 'SDK_GET_FS_SNAPSHOT_SUCCESS' &&
            event?.data?.payload?.[
              `src/app/${this.component.selector}/${this.component.selector}.component.ts`
            ] && !this.onLoad
          ) {  
            const updatedCode = event.data.payload[
              `src/app/${this.component.selector}/${this.component.selector}.component.ts`
            ];
            
            if (this.isDialog) {
              this.ref.close({
                action: "SAVE", 
                code: updatedCode
              } as DialogResult);
            } else {
              this.codeChange.emit(updatedCode);
            }
          }
        });
      }
        
      this.projectSnapshot.getFsSnapshot();
    });
  }

  openInNewTab(): void {
    this.component = {
      selector: this.getSelectorName(this.code),
      className: this.getClassName(this.code),
    };
    if (!this.component.selector || !this.component.className) {
      console.error("Not able to find component selector or class name", this.component.selector, this.component.className);
      return;
    }
    let finalAppModule: any = STACKBLITZ_APP_MODULE_TS;
    finalAppModule = finalAppModule.replaceAll(STACKBLITZ_COMPONENT_CLASS_NAME, this.component.className).replaceAll(STACKBLITZ_COMPONENT_SELECTOR, this.component.selector);
    const files = {
      'src/main.ts': STACKBLITZ_MAIN_TS,
      [`src/app/${this.component.selector}/${this.component.selector}.component.ts`]: this.code,
      'src/styles.css':  STACKBLITZ_STYLES_CSS,
      'src/app/hmi-preview-app.component.ts': STACKBLITZ_HMI_PREVIEW_APP_COMPONENT_TS,
      'src/app/hmi-preview-app.component.html': STACKBLITZ_HMI_PREVIEW_APP_COMP_HTML.replaceAll(STACKBLITZ_COMPONENT_SELECTOR, this.component.selector),
      'src/app/app.module.ts': finalAppModule,
      'src/app/common-external/common-external.component.ts': STACKBLITZ_COMMON_EXTERNAL_TS,
      'angular.json': STACKBLITZ_ANGULAR_JSON,
      'src/index.html': STACKBLITZ_INDEX_HTML,
      'src/polyfills.ts': STACKBLITZ_POLLYFILL_TS,
    };
    sdk.openProject({
      title: 'Angular Editor',
      description: 'Angular editor with live preview',
      template: 'angular-cli',
      files: files,
      dependencies: {
        ...STACKBLITZ_DEPENDENCIES,
        ...(this.dependencies && JSON.parse(this.dependencies).dependencies || {})
      },
    },
    {
      openFile: `src/app/${this.component.selector}/${this.component.selector}.component.ts`,
      view: 'preview',
      theme: "light",
    });
  }

  saveCode(): void {
    // below code will trigger the onmessage event
    this.isBuildAppDisabled = true;
    this.buildStatus = null;

    if (!this.onIOS) {
      this.projectSnapshot.getFsSnapshot();
    } else {
      this.codeChange.emit(this.code);
    }
    const BuildStatusAction = this.checkBuildEvent?.actions?.find((action: any) => action.actionType === "INVOKE_API");
    this.intervalId = setInterval(() => {
      this.customApiCall(BuildStatusAction.apiConfig).subscribe(
        (item: any) => {
          this.buildStatus = item?.data?.buildStatus;
          this.previewLink = `${item?.data?.deployLink}/${item?.data?.title}`;

          const guidStoreAction = this.checkBuildEvent?.actions?.find((action: any) => action.actionType === "SET_SHARED_DATA" && action.sharedData && action.sharedData.length);
          guidStoreAction.sharedData.forEach((shareDataObj: any) => {
            if (shareDataObj.staticData === "$guid$") {
              shareDataObj.staticData = item?.data?.guid;
            }
          });
          this.initializeEvents.emit({
            name: "fireEvent",
            events: [this.checkBuildEvent],
            data: null,
          });

          if (this.buildStatus === 'COMPLETED') {
            this.isBuildAppDisabled = false;
            clearInterval(this.intervalId);
            this.buildStatusCompleted = true;
            // const previewLink = `${item?.data?.deployLink}/${item?.data?.title}`;
            // const successMessageWithLink = `Building completed successfully. Copy following link to preview ${previewLink}`
            //this.showSuccess = true;
            //console.log('Build completed.');
            // this.initializeEvents.emit({
            //   name: 'fireEvent',
            //   events: [this.showMessageAction(successMessageWithLink, "success")]
            // })
          } else if (this.buildStatus === 'FAILED') {
            this.isBuildAppDisabled = false;
            clearInterval(this.intervalId);
            this.initializeEvents.emit({
              name: 'fireEvent',
              events: [this.showMessageAction('There was some error during build. Please generate new code and try again.', "danger")]
            });
          }
        },
        (err: any) => {
          this.isBuildAppDisabled = false;
          clearInterval(this.intervalId);
          console.error('Error during build status check:', err);
        }
      );
    }, 15000);

  }

  cancel() {
    if (this.isDialog) {
      this.ref.close({ action: 'CANCEL' } as DialogResult);
    }
  }

  private showMessageAction(messageText:string, messagetype:string) {
    return {
      event: '',
      actions: [
        {
          actionType: 'message',
          condition: "1==1",
          messagetype: messagetype,
          messageText: messageText,
        }
      ]
    }
  }

  loadLog() {
    this.showModal = true;
    this.buildLog = null;
    const downloadLogAction = this.downloadLogEvent?.actions?.find((action: any) => action.actionType === "INVOKE_API");
    this.customApiCall(downloadLogAction.apiConfig).subscribe((data: any) => {
      const parts = data.split("----------Errors---------");
      this.buildLog = parts.length > 1 ? parts[1] : '';

    })
  }

  isLoggedInCheck(): boolean{
    return document.cookie.split('; ').some(cookie => cookie.startsWith("accessToken" + '='));
  }
  
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

}
