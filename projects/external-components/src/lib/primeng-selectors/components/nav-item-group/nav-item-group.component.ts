import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { ActivatedRoute, Router } from '@angular/router';
//import { CommonLibService } from '@lib-service/common-lib.service';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
@Component({
  selector: 'hmi-ext-nav-item-group',
  templateUrl: './nav-item-group.component.html',
  styleUrls: ['./nav-item-group.component.css']
})
export class NavItemGroupComponent extends CommonExternalComponent implements OnInit {

  currentRoute!: string;
  isMobileDevice!: boolean;
  resizeObservable$!: Observable<Event>;
  resizeSubscription$!: Subscription;
  navItemCount!: number;

  constructor(private route: ActivatedRoute,
    private router: Router) {
    super();
   }

  ngOnInit(): void {
    this.currentRoute = this.router.url.split('?')[0] + "/";
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.navItemCount = this.fieldObj.navItems?.length;
  }

  ngAfterViewInit() {
    this.resizeEvent();
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.resizeEvent();
    });
  }

  resizeEvent() {
    //this.isMobileDevice = this.commonLibService.isMobileDevice();
    const childContainer = this.primeElement.nativeElement.children[0]; //

    if (childContainer && childContainer.childElementCount) {
        const optionCount = childContainer.childElementCount,
        dropdownWidth = childContainer.children[optionCount - 1]?.offsetWidth,
        containerWidth = this.primeElement.nativeElement.offsetWidth - dropdownWidth; //
      let width = 0;
      this.navItemCount = 0;
      for (let index in childContainer.children) {
        const element = childContainer.children[index];
        let gap = 0;
        if (parseInt(index) > 0) {
          const lastElement = childContainer.children[parseInt(index) - 1];
          gap = element.offsetLeft - (lastElement.offsetLeft + lastElement.offsetWidth)
        }
        
        width += element.offsetWidth + gap;
        if(width >= containerWidth) break;
        this.navItemCount++;
      }
    }
  }

  navItemClick(event: any, item: any): void {
    event.preventDefault();
    if (item.navigateToPage && item.navigateToPage.length) {
      this.router.navigate([item.navigateToPage], { relativeTo: this.route });
    } else if (item.href && item.href.length) {
      window.location.href = item.href;
    }
  }

  getNavItems() {
    if (this.isMobileDevice) {
      return this.fieldObj.navItems;
    } else {
      return this.fieldObj.navItems.slice(0, this.navItemCount);
    }
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }

}
