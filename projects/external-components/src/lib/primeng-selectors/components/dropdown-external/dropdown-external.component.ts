import { Component} from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'hmi-ext-dropdown-external',
  templateUrl: './dropdown-external.component.html',
  styleUrls: ['./dropdown-external.component.css']
})
export class DropdownExternal extends CommonExternalComponent {
  constructor() {
    super();
  }
}
