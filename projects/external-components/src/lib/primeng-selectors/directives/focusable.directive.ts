import { Directive, ElementRef, Input, OnChanges, SimpleChanges, NgZone, inject } from '@angular/core';

@Directive({
  selector: '[hmiFocusable]',
  exportAs: 'hmiFocusable'
})
export class FocusableDirective implements OnChanges {
  private el = inject(ElementRef);
  private zone = inject(NgZone);

  private _shouldFocus: boolean = true;

  @Input('hmiFocusable')
  set shouldFocus(value: boolean | string | null | undefined) {
    this._shouldFocus = this.coerceBoolean(value);
  }

  get shouldFocus(): boolean {
    return this._shouldFocus;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.shouldFocus && changes['shouldFocus']) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => this.el.nativeElement.focus(), 0);
      });
    }
  }

  public focus(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => this.el.nativeElement.focus(), 0);
    });
  }

  private coerceBoolean(value: any): boolean {
    return value !== null && `${value}` !== 'false';
  }
}