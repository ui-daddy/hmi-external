import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackblitzEditorComponent } from './stackblitz-editor.component';

describe('StackblitzEditorComponent', () => {
  let component: StackblitzEditorComponent;
  let fixture: ComponentFixture<StackblitzEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StackblitzEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackblitzEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
