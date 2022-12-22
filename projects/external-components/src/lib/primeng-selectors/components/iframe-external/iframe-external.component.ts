import {  Component, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { CommonExternalComponent } from '../common-external/common-external.component';


@Component({
  selector: 'hmi-ext-iframe-external',
  templateUrl: './iframe-external.component.html',
  styleUrls: ['./iframe-external.component.css']
})
export class IframeExternalComponent extends CommonExternalComponent  implements OnInit, AfterViewInit {
  src: any;
  visible= false;
  constructor(private sanitizer: DomSanitizer ) { super()}

  ngOnInit(): void {
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.fieldObj.customAttributes.src);
	//this.iframe.nativeElement.contentWindow.history.replaceState('WhatEverNameYouWant', "", this.src);
  }
  ngAfterViewInit(): void {
    this.visible= true;
  }

}