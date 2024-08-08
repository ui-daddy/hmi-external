import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import sdk from '@stackblitz/sdk';
import { STACKBLITZ_ANGULAR_JSON, STACKBLITZ_APP_MODULE_TS, STACKBLITZ_DEPENDENCIES, STACKBLITZ_INDEX_HTML, STACKBLITZ_MAIN_TS, STACKBLITZ_POLLYFILL_TS } from '../../constant/stackblitz-constant';


@Component({
  selector: 'hmi-ext-stackblitz-editor',
  templateUrl: './stackblitz-editor.component.html',
  styleUrls: ['./stackblitz-editor.component.css']

})
export class StackblitzEditorComponent implements OnInit {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  projectSnapshot: any

  constructor(private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.embedEditor();
  }

  embedEditor(): void {
    const files = {
      'src/main.ts': STACKBLITZ_MAIN_TS,
      'src/styles.css': ``,
      'src/app/app.component.ts': this.config.data,
      'src/app/app.module.ts': STACKBLITZ_APP_MODULE_TS,
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
        openFile: 'src/app/app.component.ts',
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
        //event.data?.payload["src/app/app.component.ts"]
        // Handle different types of messages here
        if (event.data.type === 'customEvent') {
          console.log('Custom event received:', event.data.payload);
        }
      };
    });
  }

  fetchCode(): void {
    // Fetch the updated code from StackBlitz
    this.projectSnapshot.getFsSnapshot().then((files: any) => {
      Object.keys(files).forEach((fileName) => {
        if (fileName === 'app.component.ts')
          console.log(`File: ${fileName}, Code: ${files[fileName]}`);
      });
    });
  }
}
