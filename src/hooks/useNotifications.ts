import * as Notifications from 'expo-notifications';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotificationsAsync } from '../store/actions/notificationActions';
import { ApplicationState } from '../store/reducers';
import { EventModel } from '../store/types';
import { NotificationModel } from '../store/types/notificationTypes';
import {
  registerNotificationInteraction,
  registerPushNotificationsAsync,
} from '../utils/notifications';

type NotificationHook = {
  notifications: NotificationModel[];
  notificationsLoading: boolean;
  loadNotifications: () => void;
};

const useNotifications = (setupPushNotifications = false): NotificationHook => {
  const { notifications, notificationsLoading } = useSelector(
    (state: ApplicationState) => state.notificationReducer
  );
  const { events: upcomingEvents } = useSelector(
    (state: ApplicationState) => state.eventReducer.myEvents.upcoming
  );
  const dispatch = useDispatch();

  const loadNotifications = () => {
    dispatch(fetchNotificationsAsync());
  };

  const handleReceiveNotification = () => {
    loadNotifications();
  };

  const handleTapNotificationResponse = () => {
    return;
  };

  const createEventNotification = async (event: EventModel) => {
    if (event.startDate) {
      Promise.all([
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Event starting',
            body: `${event.title} starting now`,
            data: { eventId: event.id },
          },
          trigger: event.startDate,
        }),
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Event starting soon',
            body: `${event.title} starting in 15 minutes`,
            data: { eventId: event.id },
          },
          trigger: moment(event.startDate).subtract(15, 'minutes').toDate(),
        }),
      ]);
    }
  };

  const setupEventReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Promise.all(
      upcomingEvents.map((event) => createEventNotification(event))
    );
  };

  useEffect(() => {
    loadNotifications();

    if (setupPushNotifications) {
      registerPushNotificationsAsync();
      registerNotificationInteraction(
        handleReceiveNotification,
        handleTapNotificationResponse
      );
    }
  }, []);

  useEffect(() => {
    setupEventReminders();
  }, [upcomingEvents]);

  return {
    notifications,
    notificationsLoading,
    loadNotifications,
  };
};

export default useNotifications;
