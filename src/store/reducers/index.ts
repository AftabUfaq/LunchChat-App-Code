import { combineReducers } from 'redux';

import { UserReducer } from './userReducer';
import { UtilReducer } from './utilReducer';
import { EventReducer } from './eventReducer';
import { ChatReducer } from './chatReducer';
import { NotificationReducer } from './notificationReducer';
import { LocationReducer } from './locationReducer';

const rootReducer = combineReducers({
  userReducer: UserReducer,
  utilReducer: UtilReducer,
  eventReducer: EventReducer,
  chatReducer: ChatReducer,
  notificationReducer: NotificationReducer,
  locationReducer: LocationReducer,
});

export type ApplicationState = ReturnType<typeof rootReducer>;

export { rootReducer };
