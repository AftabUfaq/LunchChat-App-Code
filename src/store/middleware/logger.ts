/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Middleware } from 'redux';

export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  // console.groupCollapsed(action.type);
  // console.info('dispatching', action);
  const result = next(action);
  // console.groupCollapsed('next state', store.getState());
  // console.groupEnd();
  return result;
};
