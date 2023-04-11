import { Pipe, PipeTransform } from '@angular/core';
import { EmployeeRole } from 'src/app/core/enums';

@Pipe({
  name: 'employeeRole',
  standalone: true,
})
export class EmployeeRoleColorPipe implements PipeTransform {
  transform(role: EmployeeRole): { color: string | null; name: string } {
    if (role === EmployeeRole.ProjectManager)
      return { name: 'Project Manager', color: '#18BB99' };
    if (role === EmployeeRole.Designer)
      return { name: 'Designer', color: '#FF810A' };
    if (role === EmployeeRole.Developer)
      return { name: 'Developer', color: '#2994DB' };
    return { name: 'Tester', color: '#FF0000' };
  }
}
