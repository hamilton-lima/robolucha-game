import { TestBed, inject } from '@angular/core/testing';

import { EndTutorialGuardService } from './end-tutorial-guard.service';

describe('EndTutorialGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EndTutorialGuardService]
    });
  });

  it('should be created', inject([EndTutorialGuardService], (service: EndTutorialGuardService) => {
    expect(service).toBeTruthy();
  }));
});
