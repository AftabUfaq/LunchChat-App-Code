import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';
import { app } from '../services/Firebase';
import { NotificationModel } from '../store/types/notificationTypes';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { convertTimestamp } from './date';
import Constants from 'expo-constants';

const firestore = getFirestore();
/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */

const convertTimestampToDesiredFormat = (timestamp: Timestamp): any => {
  // Example conversion, adapt according to your convertTimestamp implementation
  return new Date(timestamp.seconds * 1000);
};

const convertNotifications = (
  notificationCol: QueryDocumentSnapshot<DocumentData>[]
): NotificationModel[] => {
  return notificationCol.map((notificationDoc) => {
    const data = notificationDoc.data();
    return {
      id: notificationDoc.id,
      title: data.title,
      message: data.message,
      read: data.read,
      type: data.type,
      createdAt: convertTimestampToDesiredFormat(data.createdAt), // Assuming data.createdAt is a Timestamp
      data: data.data,
    } as NotificationModel;
  });
};

export const getNotifications = async (): Promise<
  NotificationModel[] | undefined
> => {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const userId = auth.currentUser?.uid;

  if (!userId) {
    return;
  }

  const notificationsQuery = query(
    collection(firestore, `users/${userId}/notifications`),
    orderBy('createdAt', 'desc')
  );
  const notificationSnapshots = await getDocs(notificationsQuery);
  const notifications = convertNotifications(
    notificationSnapshots.docs as QueryDocumentSnapshot<DocumentData>[]
  );

  return notifications;
};

export const submitExpoToken = async (expoToken: string): Promise<void> => {
  const functions = getFunctions(app);
  const registerPushNotificationsCallable = httpsCallable(
    functions,
    'registerPushNotifications'
  );
  await registerPushNotificationsCallable({ expoToken });
};

/* -------------------------------------------------------------------------- */
/*                             EXPO NOTIFICATIONS                             */
/* -------------------------------------------------------------------------- */

export const getExpoToken = async (): Promise<Notifications.ExpoPushToken> =>
  Notifications.getExpoPushTokenAsync({
    projectId: Constants.easConfig?.projectId,
  });

export const getPermissions =
  async (): Promise<Notifications.PermissionResponse> => {
    return await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
  };

export const clearLocalNotifications = async (): Promise<void> => {
  await Notifications.dismissAllNotificationsAsync();
  await updateNotificationBadges();
};

export const updateNotificationBadges = async (): Promise<void> => {
  const notifications = await Notifications.getPresentedNotificationsAsync();
  await Notifications.setBadgeCountAsync(notifications.length);
};

export const registerPushNotificationsAsync = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const { status } = await getPermissions();

  if (status !== 'granted') {
    return;
  }

  const token = await getExpoToken();

  submitExpoToken(token.data);

  await updateNotificationBadges();
};

export const registerNotificationInteraction = (
  onReceiveNotification: (notification: Notifications.Notification) => void,
  onTapNotification: (notification: Notifications.NotificationResponse) => void
): (() => void) => {
  // Handle Notification Received
  const unsubscribeNotification = Notifications.addNotificationReceivedListener(
    (notification) => onReceiveNotification(notification)
  );

  // Handle Notification Tapped/Interacted
  const unsubscribeNotificationResponse =
    Notifications.addNotificationResponseReceivedListener((notification) =>
      onTapNotification(notification)
    );

  // Unsubscribe function
  return () => {
    unsubscribeNotification.remove();
    unsubscribeNotificationResponse.remove();
  };
};
