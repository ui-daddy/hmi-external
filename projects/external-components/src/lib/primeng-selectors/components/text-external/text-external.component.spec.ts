import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextExternalComponent } from './text-external.component';

describe('PasswordExternalComponent', () => {
  let component: TextExternalComponent;
  let fixture: ComponentFixture<TextExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
