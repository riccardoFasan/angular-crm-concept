import { TestBed } from '@angular/core/testing';

import { LoadingStoreService } from './loading-store.service';

describe('LoadingStoreService', () => {
  let service: LoadingStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
