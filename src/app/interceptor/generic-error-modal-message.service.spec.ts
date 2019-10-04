import { TestBed, inject } from '@angular/core/testing';

import { GenericErrorModalMessageService } from './generic-error-modal-message.service';

describe('GenericErrorModalMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenericErrorModalMessageService]
    });
  });

  it('should be created', inject([GenericErrorModalMessageService], (service: GenericErrorModalMessageService) => {
    expect(service).toBeTruthy();
  }));
});
