import { getNotifications } from '../../utils/notifications';
import { AppDispatch } from '../store';
import {
  FetchNotificationsAction,
  FETCH_NOTIFICATIONS,
  NotificationModel,
  StartLoadingNotificationsAction,
  START_LOADING_NOTIFICATIONS,
  StopLoadingNotificationsAction,
  STOP_LOADING_NOTIFICATIONS,
} from '../types/notificationTypes';

export const fetchNotifications = (
  notifications: NotificationModel[]
): FetchNotificationsAction => ({
  type: FETCH_NOTIFICATIONS,
  payload: notifications,
});

export const startLoadingNotifications =
  (): StartLoadingNotificationsAction => ({
    type: START_LOADING_NOTIFICATIONS,
  });

export const stopLoadingNotifications = (): StopLoadingNotificationsAction => ({
  type: STOP_LOADING_NOTIFICATIONS,
});

export const fetchNotificationsAsync =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(startLoadingNotifications());

    const notifications = await getNotifications();

    notifications && dispatch(fetchNotifications(notifications));

    dispatch(stopLoadingNotifications());
  };
