import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeExternalComponent } from './iframe-external.component';

describe('IframeExternalComponent', () => {
  let component: IframeExternalComponent;
  let fixture: ComponentFixture<IframeExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IframeExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
