import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordExternalComponent } from './password-external.component';

describe('PasswordExternalComponent', () => {
  let component: PasswordExternalComponent;
  let fixture: ComponentFixture<PasswordExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
