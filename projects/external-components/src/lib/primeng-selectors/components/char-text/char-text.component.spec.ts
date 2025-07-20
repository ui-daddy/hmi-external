import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CharTextComponent } from './char-text.component';

describe('InputTextComponent', () => {
  let component: CharTextComponent;
  let fixture: ComponentFixture<CharTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CharTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
