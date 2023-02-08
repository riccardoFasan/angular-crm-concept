import { Task, TaskFormData } from 'src/app/shared/models';

export interface TaskEditState {
  formData: TaskFormData;
  task?: Task;
  loading: boolean;
  error?: string;
}

export const INITIAL_TASK_EDIT_STATE: TaskEditState = {
  formData: {},
  task: undefined,
  loading: false,
};
