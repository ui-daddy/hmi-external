import { TestBed } from '@angular/core/testing';

import { ExternalComponentsService } from './external-components.service';

describe('ExternalComponentsService', () => {
  let service: ExternalComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
