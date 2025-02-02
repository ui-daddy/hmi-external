import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'app-test2',
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <ngx-charts-bar-vertical
        [scheme]="colorScheme"
        [results]="data"
        [gradient]="false"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="true"
        [showLabels]="true"
        [animations]="true">
      </ngx-charts-bar-vertical>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class Test2Component extends CommonExternalComponent {
  data = [
    { name: 'January', value: 22 },
    { name: 'February', value: 24 },
    { name: 'March', value: 27 },
    { name: 'April', value: 30 },
    { name: 'May', value: 32 },
    { name: 'June', value: 29 },
    { name: 'July', value: 28 },
    { name: 'August', value: 27 },
    { name: 'September', value: 26 },
    { name: 'October', value: 25 },
    { name: 'November', value: 23 },
    { name: 'December', value: 21 }
  ];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
}