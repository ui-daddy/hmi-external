import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableExternalComponent } from './table-external.component';

describe('PasswordExternalComponent', () => {
  let component: TableExternalComponent;
  let fixture: ComponentFixture<TableExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
