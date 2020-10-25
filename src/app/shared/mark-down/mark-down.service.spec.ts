import { TestBed, inject } from '@angular/core/testing';

import { MarkDownService } from './mark-down.service';

describe('MarkDownService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkDownService]
    });
  });

  it('should be created', inject([MarkDownService], (service: MarkDownService) => {
    expect(service).toBeTruthy();
  }));
});
