import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalComponentsComponent } from './external-components.component';

describe('ExternalComponentsComponent', () => {
  let component: ExternalComponentsComponent;
  let fixture: ComponentFixture<ExternalComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
