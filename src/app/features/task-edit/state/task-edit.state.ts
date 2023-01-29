import { Task } from 'src/app/shared/models';

export interface TaskEditState {
  formData: Partial<Task>;
  task?: Task;
  loading: boolean;
}
