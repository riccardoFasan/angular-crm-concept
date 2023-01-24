import { TestBed } from '@angular/core/testing';

import { TaskboardStoreService } from './taskboard-store.service';

describe('TaskboardStoreService', () => {
  let service: TaskboardStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskboardStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
