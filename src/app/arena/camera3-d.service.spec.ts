import { TestBed, inject } from '@angular/core/testing';

import { Camera3DService } from './camera3-d.service';

describe('Camera3DService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Camera3DService]
    });
  });

  it('should be created', inject([Camera3DService], (service: Camera3DService) => {
    expect(service).toBeTruthy();
  }));
});
