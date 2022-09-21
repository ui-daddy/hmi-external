import {  Component, ViewEncapsulation, ViewChild, ElementRef, PipeTransform, Pipe, OnInit, Input } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { CommonExternalComponent } from '../common-external/common-external.component';


@Component({
  selector: 'hmi-ext-iframe-external',
  templateUrl: './iframe-external.component.html',
  styleUrls: ['./iframe-external.component.css']
})
export class IframeExternalComponent extends CommonExternalComponent  implements OnInit {
  src: any;
  constructor(private sanitizer: DomSanitizer ) { super()}

  ngOnInit(): void {
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.fieldObj.customAttributes.src)
    console.log("I am iframe");
  }

}
