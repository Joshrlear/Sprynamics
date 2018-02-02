import { TestBed, inject } from '@angular/core/testing';

import { ObjectFactoryService } from './object-factory.service';

describe('ObjectFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectFactoryService]
    });
  });

  it('should be created', inject([ObjectFactoryService], (service: ObjectFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
