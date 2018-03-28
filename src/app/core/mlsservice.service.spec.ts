import { TestBed, inject } from '@angular/core/testing';

import { MlsserviceService } from './mlsservice.service';

describe('MlsserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MlsserviceService]
    });
  });

  it('should be created', inject([MlsserviceService], (service: MlsserviceService) => {
    expect(service).toBeTruthy();
  }));
});
