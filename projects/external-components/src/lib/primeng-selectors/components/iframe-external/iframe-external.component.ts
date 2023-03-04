import { DOCUMENT } from '@angular/common';
import {  Component, OnInit, AfterViewInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Params } from '@angular/router';
import { CommonExternalComponent } from '../common-external/common-external.component';


@Component({
  selector: 'hmi-ext-iframe-external',
  templateUrl: './iframe-external.component.html',
  styleUrls: ['./iframe-external.component.css']
})
export class IframeExternalComponent extends CommonExternalComponent  implements OnInit, AfterViewInit {
  src: any;
  visible= false;
  queryParams: Params = {};
  @ViewChild('iframe') iframe: ElementRef | null = null;

  constructor(private sanitizer: DomSanitizer, private readonly activatedRoute:ActivatedRoute) { 
    super();
  }

  ngOnInit(): void {
    this.queryParams = this.activatedRoute.snapshot.queryParams;
    // this.activatedRoute.queryParamMap
    //   .subscribe((params) => {
    //     console.log({ ...params.keys, ...params });
    //   }
    // );
   
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.fieldObj.customAttributes.src);
	//this.iframe.nativeElement.contentWindow.history.replaceState('WhatEverNameYouWant', "", this.src);
  }
  ngAfterViewInit(): void {    
    console.debug('sending query params to iframe');
    this.iframe?.nativeElement.addEventListener('load', ()=> {
      // remove * in production
      this.iframe?.nativeElement.contentWindow?.postMessage(this.activatedRoute.snapshot.params,'*');
    })
    console.debug('query params sent to iframe');
  }

}