import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditContainerComponent } from './task-edit-container.component';

describe('TaskEditContainerComponent', () => {
  let component: TaskEditContainerComponent;
  let fixture: ComponentFixture<TaskEditContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaskEditContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEditContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
