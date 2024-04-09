import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { createLogger } from 'redux-logger';

const logger = createLogger();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type AppDispatch = typeof store.dispatch;
export default store;
