import { TestBed, inject } from '@angular/core/testing';

import { SceneComponentBuilderService } from './scene-component-builder.service';

describe('SceneComponentBuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneComponentBuilderService]
    });
  });

  it('should be created', inject([SceneComponentBuilderService], (service: SceneComponentBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
