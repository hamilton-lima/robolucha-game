import { TestBed, inject } from '@angular/core/testing';

import { LevelGroupService } from './level-group.service';

describe('LevelGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LevelGroupService]
    });
  });

  it('should be created', inject([LevelGroupService], (service: LevelGroupService) => {
    expect(service).toBeTruthy();
  }));
});
