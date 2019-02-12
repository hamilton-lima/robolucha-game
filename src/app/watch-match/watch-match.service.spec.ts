import { TestBed, inject } from '@angular/core/testing';

import { WatchMatchService } from './watch-match.service';

describe('WatchMatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WatchMatchService]
    });
  });

  it('should be created', inject([WatchMatchService], (service: WatchMatchService) => {
    expect(service).toBeTruthy();
  }));
});
