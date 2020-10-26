import { TestBed, inject } from '@angular/core/testing';

import { GameDefinitionEditMediatorService } from './game-definition-edit-mediator.service';

describe('GameDefinitionEditMediatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameDefinitionEditMediatorService]
    });
  });

  it('should be created', inject([GameDefinitionEditMediatorService], (service: GameDefinitionEditMediatorService) => {
    expect(service).toBeTruthy();
  }));
});
