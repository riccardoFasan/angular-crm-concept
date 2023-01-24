import { TestBed } from '@angular/core/testing';

import { TaskEditStoreService } from './task-edit-store.service';

describe('TaskEditStoreService', () => {
  let service: TaskEditStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskEditStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
