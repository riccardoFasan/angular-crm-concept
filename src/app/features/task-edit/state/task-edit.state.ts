import { Task, TaskFormData } from 'src/app/shared/models';

export interface TaskEditState {
  formData: TaskFormData;
  task?: Task;
  loading: boolean;
}
