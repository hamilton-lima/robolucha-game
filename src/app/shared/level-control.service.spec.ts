import { TestBed, inject } from '@angular/core/testing';
import { LevelControlService } from "src/app/shared/level-control.service";

describe('LevelControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LevelControlService]
    });
  });

  it('should be created', inject([LevelControlService], (service: LevelControlService) => {
    expect(service).toBeTruthy();
  }));
});
