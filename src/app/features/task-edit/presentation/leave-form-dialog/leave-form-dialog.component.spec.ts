import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveFormDialogComponent } from './leave-form-dialog.component';

describe('LeaveFormDialogComponent', () => {
  let component: LeaveFormDialogComponent;
  let fixture: ComponentFixture<LeaveFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LeaveFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
