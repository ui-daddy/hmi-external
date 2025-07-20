import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticIconComponent } from './static-icon.component';

describe('StaticIconComponent', () => {
  let component: StaticIconComponent;
  let fixture: ComponentFixture<StaticIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
