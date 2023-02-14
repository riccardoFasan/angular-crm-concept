import { TestBed } from '@angular/core/testing';

import { SidebarStoreService } from './sidebar-store.service';

describe('SidebarStoreService', () => {
  let service: SidebarStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
