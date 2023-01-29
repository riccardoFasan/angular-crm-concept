import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskEditStoreService } from '../store/task-edit-store.service';
import { MatCardModule } from '@angular/material/card';
import { filter, map, Observable, tap } from 'rxjs';
import { Task } from 'src/app/shared/models';
import { EditingMode } from 'src/app/shared/enums';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskFormComponent } from '../presentation';

@Component({
  selector: 'app-task-edit-container',
  standalone: true,
  imports: [CommonModule, MatCardModule, TaskFormComponent],
  providers: [TaskEditStoreService],
  template: `
    <mat-card
      *ngIf="{
        formData: formData$ | async,
        task: task$ | async,
        loading: loading$ | async,
        synchronized: synchronized$ | async,
        editingMode: editingMode$ | async,
        taskId: taskId$ | async
      } as vm"
    >
      <app-task-form
        [loading]="vm.loading!"
        [formData]="vm.formData!"
        [task]="vm.task!"
        [synchronized]="vm.synchronized!"
        [editingMode]="vm.editingMode!"
        (formDataChange)="onFormDataChanged($event)"
      ></app-task-form>
    </mat-card>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEditContainerComponent implements AfterViewInit {
  private readonly store: TaskEditStoreService = inject(TaskEditStoreService);

  protected readonly formData$: Observable<Partial<Task>> =
    this.store.formData$;
  protected readonly task$: Observable<Task | undefined> = this.store.task$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;
  protected readonly synchronized$: Observable<boolean> =
    this.store.synchronized$;
  protected readonly editingMode$: Observable<EditingMode> =
    this.store.editingMode$;

  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  protected readonly taskId$: Observable<string | null> =
    this.activatedRoute.params.pipe(
      map((params: Params) => params['id']),
      filter((id: string) => Boolean(id) && id !== 'new'),
      tap((id: string) => this.store.getTask(id))
    );

  ngAfterViewInit(): void {
    this.store.syncTask(this.formData$);
  }

  protected onFormDataChanged(formData: Partial<Task>): void {
    this.store.updateFormData(formData);
  }
}
