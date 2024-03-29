import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { EmployeeRole } from 'src/app/core/enums';

export class RoleValidators {
  static cannotBeBothDesignerAndTester(
    control: AbstractControl
  ): ValidationErrors | null {
    const values: [EmployeeRole, EmployeeRole | undefined] =
      control?.value || [];
    const isTester: boolean = values.includes(EmployeeRole.Tester);
    const isDesigner: boolean = values.includes(EmployeeRole.Designer);
    const isBoth: boolean = isTester && isDesigner;
    const error: ValidationErrors | null = isBoth
      ? { cannotBeBothDesignerAndTester: true }
      : null;
    return error;
  }

  static mustHaveAtLeastOneRole(form: FormGroup): ValidationErrors | null {
    const roleControl: FormControl = <FormControl>form.get('employee.roles');
    const assignmentsControl: FormArray = <FormArray>form.get('assignments');
    const values: [EmployeeRole, EmployeeRole | undefined] =
      roleControl?.value || [];
    const hasRoles: boolean = values.length > 0;
    const controls: FormGroup[] = <FormGroup[]>assignmentsControl.controls;
    if (!hasRoles && controls.length > 0) {
      controls.forEach((control: FormGroup) => {
        if (!control.enabled) return;
        control.disable();
      });
      const error: ValidationErrors = { mustHaveAtLeastOneRole: true };
      return error;
    }
    controls.forEach((control: FormGroup) => {
      if (control.enabled) return;
      control.enable();
    });
    return null;
  }
}
