import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { environment } from '../../../constants/environment';

@Component({
  selector: 'hmi-ext-card-list',
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent extends CommonExternalComponent {
  loading: boolean = false;

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    if (this.fieldObj.customAttributes.apiConfig && this.fieldObj.customAttributes.apiConfig.url) {
      this.loading = true;
      this.customApiCall(this.fieldObj.customAttributes.apiConfig).subscribe((response: any) => {
        this.fieldObj.customAttributes.cardList = response;
        this.loading = false;
      });
    }
  }
}
