import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskboardContainerComponent } from './taskboard-container.component';

describe('TaskboardContainerComponent', () => {
  let component: TaskboardContainerComponent;
  let fixture: ComponentFixture<TaskboardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskboardContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskboardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
