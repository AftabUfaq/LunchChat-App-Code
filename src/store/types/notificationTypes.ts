export enum NotificationTypes {
  JOIN_EVENT = 'join_event',
  REQUEST_EVENT = 'request_event',
  STARTING_EVENT = 'starting_event',
  ACCEPT_EVENT = 'accept_event',
  REJECT_EVENT = 'reject_event',
}

export type UserData = {
  id: string;
  name: string;
};

export type NotificationBaseModel = {
  id: string;
  title: string;
  message: string;
  read?: boolean;
  type: NotificationTypes;
  createdAt: Date;
};

export type JoinEventNotification = {
  readonly type: typeof NotificationTypes.JOIN_EVENT;
  data: {
    eventId: string;
    user: UserData;
  };
} & NotificationBaseModel;

export type RequestEventNotification = {
  readonly type: typeof NotificationTypes.REQUEST_EVENT;
  data: {
    eventId: string;
    user: UserData;
  };
} & NotificationBaseModel;

export type StartingEventNotification = {
  readonly type: typeof NotificationTypes.STARTING_EVENT;
  data: {
    eventId: string;
  };
} & NotificationBaseModel;

export type AcceptEventNotification = {
  readonly type: typeof NotificationTypes.ACCEPT_EVENT;
  data: {
    eventId: string;
  };
} & NotificationBaseModel;

export type RejectEventNotification = {
  readonly type: typeof NotificationTypes.REJECT_EVENT;
  data: {
    eventId: string;
  };
} & NotificationBaseModel;

export type NotificationModel =
  | JoinEventNotification
  | RequestEventNotification
  | StartingEventNotification
  | AcceptEventNotification
  | RejectEventNotification;

/* -------------------------------------------------------------------------- */
/*                                   REDUCER                                  */
/* -------------------------------------------------------------------------- */

export type NotificationState = {
  notifications: NotificationModel[];
  notificationsLoading: boolean;
};

/* -------------------------------------------------------------------------- */
/*                                   ACTIONS                                  */
/* -------------------------------------------------------------------------- */

export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';
export const START_LOADING_NOTIFICATIONS = 'START_LOADING_NOTIFICATIONS';
export const STOP_LOADING_NOTIFICATIONS = 'STOP_LOADING_NOTIFICATIONS';

/* -------------------------------------------------------------------------- */
/*                               ACTION CREATORS                              */
/* -------------------------------------------------------------------------- */

export type FetchNotificationsAction = {
  readonly type: typeof FETCH_NOTIFICATIONS;
  payload: NotificationModel[];
};

export type StartLoadingNotificationsAction = {
  readonly type: typeof START_LOADING_NOTIFICATIONS;
};

export type StopLoadingNotificationsAction = {
  readonly type: typeof STOP_LOADING_NOTIFICATIONS;
};

export type NotificationAction =
  | FetchNotificationsAction
  | StartLoadingNotificationsAction
  | StopLoadingNotificationsAction;
