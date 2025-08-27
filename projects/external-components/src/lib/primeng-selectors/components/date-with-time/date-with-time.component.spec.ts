import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateWithTimeComponent } from './date-with-time.component';

describe('DateWithTimeComponent', () => {
  let component: DateWithTimeComponent;
  let fixture: ComponentFixture<DateWithTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateWithTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateWithTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
