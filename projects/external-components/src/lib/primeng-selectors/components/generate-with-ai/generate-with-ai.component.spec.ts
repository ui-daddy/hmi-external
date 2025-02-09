import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateWithAiComponent } from './generate-with-ai.component';

describe('GenerateWithAiComponent', () => {
  let component: GenerateWithAiComponent;
  let fixture: ComponentFixture<GenerateWithAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateWithAiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateWithAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
