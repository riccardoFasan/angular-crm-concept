import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersContainerComponent } from './filters-container.component';

describe('FiltersContainerComponent', () => {
  let component: FiltersContainerComponent;
  let fixture: ComponentFixture<FiltersContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FiltersContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
