import { TestBed, inject } from '@angular/core/testing';

import { ShepherdNewService } from './shepherd-new.service';

describe('ShepherdNewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShepherdNewService]
    });
  });

  it('should be created', inject([ShepherdNewService], (service: ShepherdNewService) => {
    expect(service).toBeTruthy();
  }));
});
