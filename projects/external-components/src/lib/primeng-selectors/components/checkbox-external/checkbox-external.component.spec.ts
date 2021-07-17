import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxExternalComponent } from './checkbox-external.component';

describe('CheckboxExternalComponent', () => {
  let component: CheckboxExternalComponent;
  let fixture: ComponentFixture<CheckboxExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
