import { TestBed, inject } from '@angular/core/testing';

import { ArenaMouseService } from './arena-mouse.service';

describe('ArenaMouseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArenaMouseService]
    });
  });

  it('should be created', inject([ArenaMouseService], (service: ArenaMouseService) => {
    expect(service).toBeTruthy();
  }));
});
