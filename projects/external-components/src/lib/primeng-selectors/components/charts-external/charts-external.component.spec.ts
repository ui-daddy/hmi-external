import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsExternalComponent } from './charts-external.component';

describe('ChartsExternalComponent', () => {
  let component: ChartsExternalComponent;
  let fixture: ComponentFixture<ChartsExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
