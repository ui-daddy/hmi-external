import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-external-components',
  template: `
    <p>
      external-components works!
    </p>
  `,
  styles: [
  ]
})
export class ExternalComponentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
