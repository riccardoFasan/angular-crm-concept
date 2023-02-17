import { TestBed } from '@angular/core/testing';

import { MobileObserverService } from './mobile-observer.service';

describe('MobileObserverService', () => {
  let service: MobileObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
