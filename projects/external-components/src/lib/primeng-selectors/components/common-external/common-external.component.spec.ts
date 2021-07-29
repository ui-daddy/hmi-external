import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonExternalComponent } from './common-external.component';

describe('PasswordExternalComponent', () => {
  let component: CommonExternalComponent;
  let fixture: ComponentFixture<CommonExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
