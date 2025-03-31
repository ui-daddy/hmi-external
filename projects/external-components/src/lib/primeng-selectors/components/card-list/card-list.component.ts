import { Component, inject } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { Router } from '@angular/router';

export interface Card {
  title: string;
  buildStatus: string;
  description: string;
  thumbnail: string;
}

export interface CardButtonAction {
  name: string;
  pageUrl: string;
}

export interface CardButton {
  label: string;
  visible: boolean;
  className: string;
  action: CardButtonAction;
}

@Component({
  selector: 'hmi-ext-card-list',
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.css'
})
export class CardListComponent extends CommonExternalComponent {
  loading: boolean = false;
  cardList: Card[] = [];
  buttons: CardButton[] = [];

  private router = inject(Router);

  ngOnInit() {
    this.cardList = this.fieldObj.customAttributes.cardList ?? [];
    this.buttons = this.fieldObj.customAttributes.buttons ?? [];
    this.onLoad();
  }

  cardTrack(_index: number, item: any): number {
    return item.id;
  }

  onLoad() {
    if (this.fieldObj.customAttributes.apiConfig && this.fieldObj.customAttributes.apiConfig.url) {
      this.refreshCards();
    }
    this.fieldObj.action.subscribe((actionObj: any) => {
      if (actionObj.actionType === "setfield") {
        this.cardList = actionObj.data;
      }
      if (actionObj.actionType === "RELOAD_COMPONENT_DATA") {
        this.refreshCards();
      }
    });
  }

  private refreshCards() {
    this.loading = true;
    this.customApiCall(this.fieldObj.customAttributes.apiConfig).subscribe((response: any) => {
      this.cardList = response;
      this.loading = false;
    });
  }

  onBtnClick(card: any, action: any) {
    if(action) {
      switch (action.name) {
        case 'OPEN_URL': 
          this.router.navigate([action.pageUrl], { queryParams: { 'projectId': card.id, 'pageName': card.title, 'edit': true} })
          break;
        case 'OPEN_IN_NEW_WINDOW': 
          window.open(`${card.deployLink}/${card.title}`, '_blank');
          break;
        case 'INVOKE_API': 
          this.customApiCall(action.apiConfig, card).subscribe((_:any)=>{

          })
          break;
        default:
          console.error('Unknown button event');
      }
    }
  }
}
