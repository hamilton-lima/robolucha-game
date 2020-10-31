import { TestBed, inject } from '@angular/core/testing';

import { WallPaperGeneratorService } from './wall-paper-generator.service';

describe('WallPaperGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WallPaperGeneratorService]
    });
  });

  it('should be created', inject([WallPaperGeneratorService], (service: WallPaperGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
