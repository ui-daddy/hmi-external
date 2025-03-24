import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterGroupExternalComponent } from './filter-group-external.component';

describe('FilterGroupExternalComponent', () => {
  let component: FilterGroupExternalComponent;
  let fixture: ComponentFixture<FilterGroupExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterGroupExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterGroupExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
