import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hmi-ext-checkbox-external',
  templateUrl: './checkbox-external.component.html',
  styleUrls: ['./checkbox-external.component.css']
})
export class CheckboxExternalComponent implements OnInit {

  @Input() fieldObj: any;
  @Input() dynamicAttributes: any;

  @Output() onChange: any;

  selectedValues: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
    // this.initializeSelectedBoxes();
    // this.updateSelectedBoxes();
  }

  private updateSelectedBoxes(): void {
    this.fieldObj.value.forEach((element: number) => {
      this.selectedValues.push(element);
    });
  }

  onCheckboxChange(event: any): void {
    console.log('Selected value: ' + this.fieldObj.value);
    // this.updateSelectedBoxes();
    this.onChange(this.fieldObj.value);
    // this.onChange(this.fieldObj.value);
  }

  // private initializeSelectedBoxes(): void {
  //   for (let i = 0; i < this.fieldObj.customAttributes.optionList.length; i++) {
  //     this.selectedValues.push(false);
  //   }
  // }
}
