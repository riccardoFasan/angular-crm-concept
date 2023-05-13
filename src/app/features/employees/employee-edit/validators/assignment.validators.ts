import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { AssignmentRole } from 'src/app/core/enums';

export class AssignmentValidators {
  static cannotBeAWorkerIfTaskIsFinished(
    form: FormGroup
  ): ValidationErrors | null {
    const roleControl: FormControl = <FormControl>form.get('role');
    const isWorker: boolean = roleControl.value === AssignmentRole.Worker;
    if (!isWorker) return null;
    const taskControl: FormControl = <FormControl>form.get('task');
    const isFinished: boolean =
      taskControl.value.status === 'COMPLETED' ||
      taskControl.value.status === 'IN_REVIEW';
    const error: ValidationErrors | null = isFinished
      ? {
          cannotBeAWorkerIfTaskIsFinished: true,
        }
      : null;
    roleControl.setErrors(error);
    return error;
  }
}
