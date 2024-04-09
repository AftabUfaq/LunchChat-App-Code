import {
  NotificationState,
  NotificationAction,
  FETCH_NOTIFICATIONS,
  START_LOADING_NOTIFICATIONS,
  STOP_LOADING_NOTIFICATIONS,
} from '../types/notificationTypes';

const initialState: NotificationState = {
  notifications: [],
  notificationsLoading: false,
};

const NotificationReducer = (
  state = initialState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      return { ...state, notifications: action.payload };
    case START_LOADING_NOTIFICATIONS:
      return { ...state, notificationsLoading: true };
    case STOP_LOADING_NOTIFICATIONS:
      return { ...state, notificationsLoading: false };
    default:
      return state;
  }
};

export { NotificationReducer };
