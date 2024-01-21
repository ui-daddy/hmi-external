import { Directive, ElementRef, Input, Renderer2, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[rowDataHandler]'
})
export class RowDataHandlerDirective {
  element: ElementRef;
  private _hrefValue: string = "";
  anchorTag: any;
  spanTag: any;

  constructor(private renderer: Renderer2,
    private elmRef: ElementRef, private domSanitizer: DomSanitizer) {
    this.element = elmRef;
  }

  @Input() set rowDataHandler(newHref: string) {
    if (newHref !== null && newHref !== undefined) {
      this._hrefValue = newHref;
      const urlPattern = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
      const patternTag = /<(“[^”]*”|'[^’]*’|[^'”>])*>/;
      if (typeof newHref === 'string' && newHref.match(urlPattern)) {
        if (this.anchorTag != null) {
          this.renderer.removeChild(this.elmRef.nativeElement, this.anchorTag);
        }
        this.anchorTag = this.renderer.createElement('a');
        this.anchorTag.href = this._hrefValue;
        const linkText = this.renderer.createText(this._hrefValue);
        this.renderer.appendChild(this.anchorTag, linkText);
        this.renderer.appendChild(this.elmRef.nativeElement, this.anchorTag);
      } else if (typeof newHref === 'string' && newHref.match(patternTag)) {
        let unsanitizedData = this._hrefValue;
        let sanitized = this.domSanitizer.sanitize(SecurityContext.HTML, unsanitizedData);
        this.elmRef.nativeElement.innerHTML = sanitized;
      } else {
        if (this.spanTag != null) {
          this.renderer.removeChild(this.elmRef.nativeElement, this.spanTag);
        }
        this.spanTag = this.renderer.createElement('span');
        const tableData = this.renderer.createText(this._hrefValue);
        this.renderer.appendChild(this.spanTag, tableData);
        this.renderer.appendChild(this.elmRef.nativeElement, this.spanTag);
      }
    }
  }
  get hrefValue(): string {
    return this._hrefValue;
  }
}