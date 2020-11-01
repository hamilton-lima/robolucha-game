import { TestBed, inject } from '@angular/core/testing';

import { GameComponentBuildService } from './game-component-build.service';

describe('GameComponentBuildService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameComponentBuildService]
    });
  });

  it('should be created', inject([GameComponentBuildService], (service: GameComponentBuildService) => {
    expect(service).toBeTruthy();
  }));
});
