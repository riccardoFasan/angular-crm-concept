import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { AssignmentRole, EmployeeRole } from 'src/app/core/enums';

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

  static cannotBeAReviewerIfIsAProjectManager(
    form: FormGroup
  ): ValidationErrors | null {
    const roleControl: FormControl = <FormControl>form.get('employee.roles');
    const roleValues: [EmployeeRole, EmployeeRole | undefined] =
      roleControl.value || [];

    const isProjectManager: boolean = roleValues.includes(
      EmployeeRole.ProjectManager
    );
    if (!isProjectManager) return null;

    const assignmentsControl: FormArray = <FormArray>form.get('assignments');
    const assignmentControls: FormGroup[] = <FormGroup[]>(
      assignmentsControl.controls
    );
    if (assignmentControls.length === 0) return null;

    const error: ValidationErrors = {
      cannotBeAReviewerIfIsAProjectManager: true,
    };

    let hasError: boolean = false;
    assignmentControls.forEach((control: FormGroup) => {
      const assignmentRoleControl: FormControl = <FormControl>(
        control.get('role')
      );
      const isReviewer: boolean =
        assignmentRoleControl.value === AssignmentRole.Reviewer;
      if (!isReviewer) return;
      hasError = true;
      assignmentRoleControl.setErrors(error);
    });

    return hasError ? error : null;
  }
}
