import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'hmi-ext-common-external',
  template: ''
})
export class CommonExternalComponent implements AfterViewInit {

  private _fieldObj: any;
  public isDirective: boolean = false;
  private isEventInitialized = false;
  public get fieldObj() {
    return this._fieldObj;
  }
  @Input()
  public set fieldObj(theFieldObj: any) {
    this._fieldObj = theFieldObj;
    if (this.primeElement) {
      Object.assign(this.isDirective? this.primeElement?.nativeElement : this.primeElement, this._fieldObj.customAttributes);
    }
  }
  @Input() dynamicAttributes: any;
  @Input() formGroupObj: any;
  @Input() customApiCall: any;
  @Output('initializeEvents') protected initializeEvents = new EventEmitter<any>();

  @ViewChild('primeElement', {static: true}) primeElement!: any; 
  subscription: any;

  constructor() { }

  ngAfterViewInit() {
    if (this.primeElement) {
      const nativeElement = this.primeElement?.nativeElement || (this.primeElement.input && this.primeElement.input.nativeElement);
      if (nativeElement) {
        nativeElement.readOnly = this.dynamicAttributes.readOnlyValue;
      } else {
        this.primeElement.readonly = this.dynamicAttributes.readOnlyValue;
      }
    }

    if (!this.isEventInitialized) {
      this.isEventInitialized = true;
      this.initializeEvents.emit();
    }
  }

  componentDataDownloader(data:any){
    const txtData = JSON.stringify(data, null, 2);
    const blob = new Blob([txtData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.txt';
    link.click();

    URL.revokeObjectURL(url); // Clean up
  }

  componentDataUploader(event: Event): Promise<any> {
    return new Promise((resolve, reject) => {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) {
        reject('No file selected.');
        return;
      }

      const file = input.files[0];

      if (file.type === 'text/plain') {
        const reader = new FileReader();

        reader.onload = () => {
          try {
            const text = reader.result as string;
            const jsonData = JSON.parse(text);
            resolve(jsonData);
          } catch (err) {
            console.error('Invalid JSON in file:', err);
            reject('The file does not contain valid JSON.');
          }
        };

        reader.onerror = () => {
          reject('Error reading the file.');
        };

        reader.readAsText(file);
      } else {
        reject('Please upload a .txt file.');
      }
    });
  }

}
