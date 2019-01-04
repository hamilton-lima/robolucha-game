import { TestBed, inject } from '@angular/core/testing';

import { SharedStateService } from './shared-state.service';

describe('SharedStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedStateService]
    });
  });

  it('should be created', inject([SharedStateService], (service: SharedStateService) => {
    expect(service).toBeTruthy();
  }));
});
