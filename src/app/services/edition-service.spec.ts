import { TestBed } from '@angular/core/testing';

import { EditionService } from './edition-service';

describe('EditionServiceService', () => {
  let service: EditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
