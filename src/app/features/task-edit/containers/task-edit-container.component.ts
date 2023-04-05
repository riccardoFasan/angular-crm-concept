import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskEditStoreService } from '../store';
import { MatCardModule } from '@angular/material/card';
import {
  EMPTY,
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  first,
  map,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Task, TaskFormData } from 'src/app/shared/models';
import { EditingMode } from 'src/app/shared/enums';
import { TaskFormComponent } from '../presentation';
import { provideComponentStore } from '@ngrx/component-store';
import { CanLeave } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-task-edit-container',
  standalone: true,
  imports: [CommonModule, MatCardModule, TaskFormComponent],
  providers: [provideComponentStore(TaskEditStoreService)],
  template: `
    <mat-card
      *ngIf="{
        formData: formData$ | async,
        task: task$ | async,
        loading: loading$ | async,
        saved: saved$ | async,
        editingMode: editingMode$ | async
      } as vm"
    >
      <app-task-form
        [loading]="vm.loading!"
        [formData]="vm.formData!"
        [task]="vm.task!"
        [saved]="vm.saved!"
        [editingMode]="vm.editingMode!"
        (formDataChange)="onFormDataChanged($event)"
        (onSave)="onFormSaved($event)"
      ></app-task-form>
    </mat-card>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEditContainerComponent implements CanLeave {
  @ViewChild(TaskFormComponent) private taskForm!: TaskFormComponent;

  private readonly store: TaskEditStoreService = inject(TaskEditStoreService);

  readonly targetPath: string = '/taskboard';

  protected readonly formData$: Observable<TaskFormData> = this.store.formData$;
  protected readonly task$: Observable<Task | undefined> = this.store.task$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;
  protected readonly saved$: Observable<boolean> = this.store.saved$;
  protected readonly editingMode$: Observable<EditingMode> =
    this.store.editingMode$;

  readonly canLeave$: Observable<boolean> = this.store.saved$;

  // combineLatest([
  //   this.saved$,
  //   this.loading$,
  // ]).pipe(
  //   map(([saved, loading]) => saved && !loading),
  //   distinctUntilChanged()
  // );

  beforeLeave(): Observable<any> {
    this.taskForm.save();
    return this.canLeave$.pipe(
      tap(console.log),
      skip(1),
      filter((canLeave: boolean) => canLeave === true),
      first(),
      tap(console.log)
    );
    // return this.formData$.pipe(
    //   take(1),
    //   switchMap((formData: TaskFormData) => {
    //     this.onFormSaved(formData);
    //     return this.saved$.pipe(
    //       filter((saved: boolean) => saved === true),
    //       map(() => formData)
    //     );
    //   })
    // );
  }

  protected onFormDataChanged(formData: TaskFormData): void {
    this.store.updateFormData(formData);
  }

  protected onFormSaved(formData: TaskFormData): void {
    this.store.saveTask(formData);
  }
}
