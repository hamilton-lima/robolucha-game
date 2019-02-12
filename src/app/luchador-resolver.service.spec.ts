import { TestBed, inject } from '@angular/core/testing';

import { LuchadorResolverService } from './luchador-resolver.service';

describe('LuchadorResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LuchadorResolverService]
    });
  });

  it('should be created', inject([LuchadorResolverService], (service: LuchadorResolverService) => {
    expect(service).toBeTruthy();
  }));
});
