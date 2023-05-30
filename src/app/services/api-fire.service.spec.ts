import { TestBed } from '@angular/core/testing';

import { ApiFireService } from './api-fire.service';

describe('ApiFireService', () => {
  let service: ApiFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
