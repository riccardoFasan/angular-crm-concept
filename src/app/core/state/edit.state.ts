export interface EditState<T> {
  formData: Partial<T>;
  item?: T;
  loading: boolean;
  error?: string;
}

export const INITIAL_EDIT_STATE: EditState<any> = {
  formData: {},
  item: undefined,
  loading: false,
};
