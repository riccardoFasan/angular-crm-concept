import { TestBed } from '@angular/core/testing';

import { FiltersStoreService } from './filters-store.service';

describe('FiltersStoreService', () => {
  let service: FiltersStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltersStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
