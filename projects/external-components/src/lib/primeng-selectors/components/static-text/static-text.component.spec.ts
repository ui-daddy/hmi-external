import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticTextComponent } from './static-text.component';

describe('StaticTextComponent', () => {
  let component: StaticTextComponent;
  let fixture: ComponentFixture<StaticTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
