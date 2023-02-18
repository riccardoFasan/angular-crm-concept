import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskEditStoreService } from '../../store';
import { MatCardModule } from '@angular/material/card';
import { Observable, filter, map, switchMap, take } from 'rxjs';
import { Task, TaskFormData } from 'src/app/shared/models';
import { EditingMode } from 'src/app/shared/enums';
import { TaskFormComponent } from '../../presentation';
import { CanLeave } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-task-edit-container',
  standalone: true,
  imports: [CommonModule, MatCardModule, TaskFormComponent],
  template: `
    <mat-card
      *ngIf="{
        formData: formData$ | async,
        task: task$ | async,
        loading: loading$ | async,
        synchronized: synchronized$ | async,
        editingMode: editingMode$ | async
      } as vm"
    >
      <app-task-form
        [loading]="vm.loading!"
        [formData]="vm.formData!"
        [task]="vm.task!"
        [synchronized]="vm.synchronized!"
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
  private readonly store: TaskEditStoreService = inject(TaskEditStoreService);

  readonly targetPath: string = '/taskboard';

  protected readonly formData$: Observable<TaskFormData> = this.store.formData$;
  protected readonly task$: Observable<Task | undefined> = this.store.task$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;
  protected readonly synchronized$: Observable<boolean> =
    this.store.synchronized$;
  protected readonly editingMode$: Observable<EditingMode> =
    this.store.editingMode$;

  readonly canLeave$: Observable<boolean> = this.store.synchronized$;

  beforeLeave(): Observable<TaskFormData> {
    return this.formData$.pipe(
      take(1),
      switchMap((formData: TaskFormData) => {
        this.onFormSaved(formData);
        return this.synchronized$.pipe(
          filter((synchronized: boolean) => synchronized === true),
          map(() => formData)
        );
      })
    );
  }

  protected onFormDataChanged(formData: TaskFormData): void {
    this.store.updateFormData(formData);
  }

  protected onFormSaved(formData: TaskFormData): void {
    this.store.saveTask(formData);
  }
}
