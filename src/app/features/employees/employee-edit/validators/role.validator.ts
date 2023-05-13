import { AbstractControl, ValidationErrors } from '@angular/forms';
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
}
