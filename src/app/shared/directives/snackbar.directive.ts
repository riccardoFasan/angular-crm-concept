import {
  Directive,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Subject, takeUntil, tap } from 'rxjs';

@Directive({
  selector: 'app-snackbar',
  standalone: true,
  providers: [MatSnackBar],
})
export class SnackbarDirective implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  @Input() set message(message: string) {
    const snackBarRef: MatSnackBarRef<TextOnlySnackBar> = this.snackbar.open(
      message,
      'OK'
    );

    snackBarRef
      .onAction()
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.dismissed.emit();
          snackBarRef.dismiss();
        })
      )
      .subscribe();
  }

  @Output() dismissed: EventEmitter<void> = new EventEmitter<void>();

  private readonly snackbar: MatSnackBar = inject(MatSnackBar);

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
