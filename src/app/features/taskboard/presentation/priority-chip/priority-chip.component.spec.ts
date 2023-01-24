import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityChipComponent } from './priority-chip.component';

describe('PriorityChipComponent', () => {
  let component: PriorityChipComponent;
  let fixture: ComponentFixture<PriorityChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PriorityChipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
