import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';

export const TaskTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => {
  const id: string | null = route.paramMap.get('id');
  if (!id || id === 'new') return 'Create task';
  return `Edit task`;
};
