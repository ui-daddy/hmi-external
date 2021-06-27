import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownExternal } from './dropdown-external.component';

describe('DropdownExternal', () => {
  let component: DropdownExternal;
  let fixture: ComponentFixture<DropdownExternal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownExternal ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownExternal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
