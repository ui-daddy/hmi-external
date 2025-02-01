import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone 
} from '@angular/core';
import sdk from '@stackblitz/sdk';
import { STACKBLITZ_ANGULAR_JSON, STACKBLITZ_APP_MODULE_TS, STACKBLITZ_COMMON_EXTERNAL_TS, STACKBLITZ_COMPONENT_CLASS_NAME, STACKBLITZ_COMPONENT_SELECTOR, STACKBLITZ_DEPENDENCIES, STACKBLITZ_HMI_PREVIEW_APP_COMP_HTML, STACKBLITZ_HMI_PREVIEW_APP_COMPONENT_TS, STACKBLITZ_INDEX_HTML, STACKBLITZ_MAIN_TS, STACKBLITZ_POLLYFILL_TS } from '../../constant/stackblitz-constant';


@Component({
  selector: 'hmi-ext-stackblitz-editor',
  templateUrl: './stackblitz-editor.component.html',
  styleUrls: ['./stackblitz-editor.component.css']

})
export class StackblitzEditorComponent implements OnInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  projectSnapshot: any;
  component = {
    selector: '',
    className: '',
  };
  onLoad = true;

  constructor(private config: DynamicDialogConfig, public ref: DynamicDialogRef, private zone: NgZone) {}

  ngOnInit(): void {
    this.embedEditor();
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
      selector: this.getSelectorName(this.config.data),
      className: this.getClassName(this.config.data),
    };
    if (!this.component.selector || !this.component.className) {
      console.error("Not able to find component selector or class name", this.component.selector, this.component.className);
      return;
    }
    let finalAppModule: any = STACKBLITZ_APP_MODULE_TS;
    finalAppModule = finalAppModule.replaceAll(STACKBLITZ_COMPONENT_CLASS_NAME, this.component.className).replaceAll(STACKBLITZ_COMPONENT_SELECTOR, this.component.selector);
    const files = {
      'src/main.ts': STACKBLITZ_MAIN_TS,
      [`src/app/${this.component.selector}/${this.component.selector}.component.ts`]: this.config.data,
      'src/styles.css': '',
      'src/app/hmi-preview-app.component.ts': STACKBLITZ_HMI_PREVIEW_APP_COMPONENT_TS,
      'src/app/hmi-preview-app.component.html': STACKBLITZ_HMI_PREVIEW_APP_COMP_HTML.replaceAll(STACKBLITZ_COMPONENT_SELECTOR, this.component.selector),
      'src/app/app.module.ts': finalAppModule,
      'src/app/common-external/common-external.component.ts': STACKBLITZ_COMMON_EXTERNAL_TS,
      'angular.json': STACKBLITZ_ANGULAR_JSON,
      'src/index.html': STACKBLITZ_INDEX_HTML,
      'src/polyfills.ts': STACKBLITZ_POLLYFILL_TS,
    };
    sdk.embedProject(
      this.editorContainer.nativeElement,
      {
        title: 'Angular Editor',
        description: 'Angular editor with live preview',
        template: 'angular-cli',
        files: files,
        dependencies: STACKBLITZ_DEPENDENCIES,
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
            this.ref.close({action: "SAVE", code: event.data.payload[
              `src/app/${this.component.selector}/${this.component.selector}.component.ts`
            ]});
          }
        });
      }
        
      this.projectSnapshot.getFsSnapshot();
    });
  }

  saveCode(): void {
    // below code will trigger the onmessage event
    this.projectSnapshot.getFsSnapshot();
  }

  cancel() {
    this.ref.close();
  }
}
