import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item, List } from 'src/app/core/models';
import { Observable, map } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ITEM_ADAPTER } from 'src/app/core/tokens';
import { ItemAdapter } from 'src/app/core/interfaces';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-list-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-form-field
      *ngIf="{
        items: items$ | async,
      } as vm"
      appearance="outline"
    >
      <mat-label>{{ label }}</mat-label>
      <mat-select
        matInput
        placeholder="Choose an option"
        [attr.aria-label]="label"
        [formControl]="control"
        [compareWith]="compareWith"
      >
        <mat-option *ngFor="let item of vm.items" [value]="item">
          {{ $any(item).optionLabel }}
        </mat-option>
      </mat-select>
      <div *ngIf="!vm.items" class="spinner-wrapper">
        <mat-progress-spinner
          class="example-margin"
          [color]="'accent'"
          [mode]="'indeterminate'"
        >
        </mat-progress-spinner>
      </div>
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;

        mat-form-field {
          width: calc(100% - 1px);

          .spinner-wrapper {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            mat-progress-spinner {
              width: 22px !important;
              height: 22px !important;
            }
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListSelectComponent<T extends Item> {
  private readonly adapter: ItemAdapter<T> = inject(ITEM_ADAPTER);

  @Input() control: FormControl = new FormControl(undefined);
  @Input({ required: true }) label: string = '';

  protected readonly items$: Observable<T[]> = this.adapter
    .getItems({
      pagination: {
        pageSize: 100,
        pageIndex: 0,
      },
      filters: {},
    })
    .pipe(
      map((list: List<T>) =>
        list.items.map((item) => ({
          ...item,
          optionLabel: this.adapter.generateTitle(item),
        }))
      )
    );

  protected compareWith(item: T, value: T): boolean {
    return item.id === value.id;
  }

  protected display(item: T | null): string {
    // @ts-ignore
    return item?.optionLabel || '';
  }
}
