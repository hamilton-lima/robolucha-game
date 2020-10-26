import { TestBed, inject } from '@angular/core/testing';

import { MatchStateBuilderService } from './match-state-builder.service';

describe('MatchStateBuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchStateBuilderService]
    });
  });

  it('should be created', inject([MatchStateBuilderService], (service: MatchStateBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
