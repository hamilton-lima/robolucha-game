import { TestBed, inject } from '@angular/core/testing';

import { NarrativeBuilderService } from './narrative-builder.service';

describe('NarrativeBuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NarrativeBuilderService]
    });
  });

  it('should be created', inject([NarrativeBuilderService], (service: NarrativeBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
