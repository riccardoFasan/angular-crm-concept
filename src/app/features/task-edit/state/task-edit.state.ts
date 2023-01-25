import { Task } from 'src/app/shared/models';

export interface TaskEditState {
  loading: boolean;
  formData: Partial<Task>;
  task?: Task;
}
