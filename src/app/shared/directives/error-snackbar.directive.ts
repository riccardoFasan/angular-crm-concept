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
  selector: 'app-error-snackbar',
  standalone: true,
  providers: [MatSnackBar],
})
export class ErrorSnackbarDirective implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() set message(message: string) {
    const snackBarRef: MatSnackBarRef<TextOnlySnackBar> = this.snackbar.open(
      message,
      'Reload'
    );
    snackBarRef
      .onAction()
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.dismissed.emit();
          snackBarRef.dismiss();
          this.reload();
        })
      )
      .subscribe();
  }

  @Output() dismissed: EventEmitter<void> = new EventEmitter<void>();

  private readonly snackbar: MatSnackBar = inject(MatSnackBar);

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private reload(): void {
    location.reload();
  }
}
