import { TestBed } from '@angular/core/testing';

import { GetIconServiceService } from './get-icon-service.service';

describe('GetIconServiceService', () => {
  let service: GetIconServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetIconServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
