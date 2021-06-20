import { Component, Input, OnInit } from '@angular/core';

interface IText {
  disabled: boolean;
}

@Component({
  selector: 'hmi-ext-text-external',
  templateUrl: './text-external.component.html',
  styleUrls: ['./text-external.component.scss']
})
export class TextExternalComponent implements OnInit {

  @Input()
  inputPropsMapping: any = {};

  property: string = "testing";

  constructor() { }

  ngOnInit(): void {
    console.log(this.inputPropsMapping);
  }

}
