import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavItemGroupComponent } from './nav-item-group.component';

describe('NavItemGroupComponent', () => {
  let component: NavItemGroupComponent;
  let fixture: ComponentFixture<NavItemGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavItemGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavItemGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
