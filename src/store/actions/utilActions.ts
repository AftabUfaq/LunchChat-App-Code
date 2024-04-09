import { AppDispatch } from '../store';
import {
  START_LOADING,
  STOP_LOADING,
  StartLoadingAction,
  StopLoadingAction,
  ShowErrorAction,
  SHOW_ERROR,
  HideErrorAction,
  HIDE_ERROR,
} from '../types';

export const startLoading = (): StartLoadingAction => {
  return {
    type: START_LOADING,
  };
};

export const stopLoading = (): StopLoadingAction => {
  return {
    type: STOP_LOADING,
  };
};

export const showError = (error: string): ShowErrorAction => {
  return {
    type: SHOW_ERROR,
    payload: error,
  };
};

export const hideError = (): HideErrorAction => {
  return {
    type: HIDE_ERROR,
  };
};

export const asyncLoading = async (
  dispatch: AppDispatch,
  callback: () => Promise<void>
): Promise<void> => {
  try {
    dispatch(startLoading());
    await callback();
    dispatch(stopLoading());
  } catch (error) {
    // Type assertion to convert 'error' to an Error object
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    dispatch(showError(message));
  }
};
