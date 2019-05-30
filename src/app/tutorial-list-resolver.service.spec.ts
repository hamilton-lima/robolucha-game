import { TestBed, inject } from '@angular/core/testing';

import { TutorialListResolverService } from './tutorial-list-resolver.service';

describe('TutorialListResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TutorialListResolverService]
    });
  });

  it('should be created', inject([TutorialListResolverService], (service: TutorialListResolverService) => {
    expect(service).toBeTruthy();
  }));
});
