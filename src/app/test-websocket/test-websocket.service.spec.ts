import { TestBed, inject } from '@angular/core/testing';

import { TestWebsocketService } from './test-websocket.service';

describe('TestWebsocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestWebsocketService]
    });
  });

  it('should be created', inject([TestWebsocketService], (service: TestWebsocketService) => {
    expect(service).toBeTruthy();
  }));
});
