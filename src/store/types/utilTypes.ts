export type UtilState = {
  loading: boolean;
  error: string | undefined;
};

export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';

export type StartLoadingAction = {
  readonly type: typeof START_LOADING;
};

export type StopLoadingAction = {
  readonly type: typeof STOP_LOADING;
};

export type ShowErrorAction = {
  readonly type: typeof SHOW_ERROR;
  payload: string;
};

export type HideErrorAction = {
  readonly type: typeof HIDE_ERROR;
};

export type UtilAction =
  | StartLoadingAction
  | StopLoadingAction
  | ShowErrorAction
  | HideErrorAction;
