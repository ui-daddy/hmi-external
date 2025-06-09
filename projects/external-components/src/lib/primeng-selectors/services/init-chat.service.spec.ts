import { TestBed } from '@angular/core/testing';

import { InitChatService } from './init-chat.service';

describe('InitChatService', () => {
  let service: InitChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
