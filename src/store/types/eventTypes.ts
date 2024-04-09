// For Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, GeoPoint } from 'firebase/firestore';

// For Auth
import { getAuth } from 'firebase/auth';

// For other Firebase services, you follow a similar pattern.

/* -------------------------------------------------------------------------- */
/*                                    ENUMS                                   */
/* -------------------------------------------------------------------------- */

export enum EventPrivacy {
  Open = 'open',
  Closed = 'closed',
}

export enum UserEventStates {
  Accepted = 'accepted',
  Pending = 'pending',
}

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type EventHostModel = {
  userId?: string;
  name?: string;
};

export type EventModel = {
  id?: string;
  title?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  privacy?: EventPrivacy;
  host?: EventHostModel;
  participants?: EventParticipantModel[];
  location?: GeoPoint; // Here, GeoPoint is imported from 'firebase/firestore'
  distance?: number;
};
export type UserEventModel = EventModel & {
  status: UserEventStates;
};

export type EventParticipantModel = {
  id: string;
  name: string;
  userId: string;
  status: UserEventStates;
};

export type MyEventsModel = {
  upcoming: {
    loading: boolean;
    events: UserEventModel[];
  };
  pending: {
    loading: boolean;
    events: UserEventModel[];
  };
  past: {
    loading: boolean;
    events: UserEventModel[];
  };
};

export type UserEventsModel = {
  id: string;
} & MyEventsModel;

export type EventState = {
  eventFeed: EventModel[];
  events: EventModel[];
  feedLoading: boolean;
  eventLoading: boolean;
  myEvents: MyEventsModel;
  userEvents: UserEventsModel[];
};

/* -------------------------------------------------------------------------- */
/*                                   ACTIONS                                  */
/* -------------------------------------------------------------------------- */

export const FETCH_FEED = 'FETCH_FEED';
export const START_LOADING_FEED = 'START_LOADING_FEED';
export const STOP_LOADING_FEED = 'STOP_LOADING_FEED';

export const FETCH_EVENT = 'FETCH_EVENT';
export const CLEAR_EVENTS = 'CLEAR_EVENTS';
export const UPDATE_EVENT_PARTICIPANTS = 'UPDATE_EVENT_PARTICIPANTS';
export const START_LOADING_EVENT = 'START_LOADING_EVENT';
export const STOP_LOADING_EVENT = 'STOP_LOADING_EVENT';

export const FETCH_MY_UPCOMING_EVENT = 'FETCH_MY_UPCOMING_EVENT';
export const START_LOADING_MY_UPCOMING_EVENT =
  'START_LOADING_MY_UPCOMING_EVENT';
export const STOP_LOADING_MY_UPCOMING_EVENT = 'STOP_LOADING_MY_UPCOMING_EVENT';

export const FETCH_MY_PENDING_EVENT = 'FETCH_MY_PENDING_EVENT';
export const START_LOADING_MY_PENDING_EVENT = 'START_LOADING_MY_PENDING_EVENT';
export const STOP_LOADING_MY_PENDING_EVENT = 'STOP_LOADING_MY_PENDING_EVENT';

export const FETCH_MY_PAST_EVENT = 'FETCH_MY_PAST_EVENT';
export const START_LOADING_MY_PAST_EVENT = 'START_LOADING_MY_PAST_EVENT';
export const STOP_LOADING_MY_PAST_EVENT = 'STOP_LOADING_MY_PAST_EVENT';

export const FETCH_USER_UPCOMING_EVENT = 'FETCH_USER_UPCOMING_EVENT';
export const START_LOADING_USER_UPCOMING_EVENT =
  'START_LOADING_USER_UPCOMING_EVENT';
export const STOP_LOADING_USER_UPCOMING_EVENT =
  'STOP_LOADING_USER_UPCOMING_EVENT';

export const FETCH_USER_PENDING_EVENT = 'FETCH_USER_PENDING_EVENT';
export const START_LOADING_USER_PENDING_EVENT =
  'START_LOADING_USER_PENDING_EVENT';
export const STOP_LOADING_USER_PENDING_EVENT =
  'STOP_LOADING_USER_PENDING_EVENT';

export const FETCH_USER_PAST_EVENT = 'FETCH_USER_PAST_EVENT';
export const START_LOADING_USER_PAST_EVENT = 'START_LOADING_USER_PAST_EVENT';
export const STOP_LOADING_USER_PAST_EVENT = 'STOP_LOADING_USER_PAST_EVENT';

/* -------------------------------------------------------------------------- */
/*                               ACTION CREATORS                              */
/* -------------------------------------------------------------------------- */

export type FetchFeedAction = {
  readonly type: typeof FETCH_FEED;
  payload: EventModel[];
};

export type ClearEventsAction = {
  readonly type: typeof CLEAR_EVENTS;
};

export type StartLoadingFeedAction = {
  readonly type: typeof START_LOADING_FEED;
};

export type StopLoadingFeedAction = {
  readonly type: typeof STOP_LOADING_FEED;
};

export type FetchEventAction = {
  readonly type: typeof FETCH_EVENT;
  payload: EventModel;
};

export type UpdateEventParticipantsAction = {
  readonly type: typeof UPDATE_EVENT_PARTICIPANTS;
  payload: { eventId: string; participants: EventParticipantModel[] };
};

export type StartLoadingEventAction = {
  readonly type: typeof START_LOADING_EVENT;
};

export type StopLoadingEventAction = {
  readonly type: typeof STOP_LOADING_EVENT;
};

export type FetchMyUpcomingEventAction = {
  readonly type: typeof FETCH_MY_UPCOMING_EVENT;
  payload: UserEventModel[];
};
export type StartLoadingMyUpcomingEventAction = {
  readonly type: typeof START_LOADING_MY_UPCOMING_EVENT;
};
export type StopLoadingMyUpcomingEventAction = {
  readonly type: typeof STOP_LOADING_MY_UPCOMING_EVENT;
};

export type FetchMyPendingEventAction = {
  readonly type: typeof FETCH_MY_PENDING_EVENT;
  payload: UserEventModel[];
};
export type StartLoadingMyPendingEventAction = {
  readonly type: typeof START_LOADING_MY_PENDING_EVENT;
};
export type StopLoadingMyPendingEventAction = {
  readonly type: typeof STOP_LOADING_MY_PENDING_EVENT;
};

export type FetchMyPastEventAction = {
  readonly type: typeof FETCH_MY_PAST_EVENT;
  payload: UserEventModel[];
};
export type StartLoadingMyPastEventAction = {
  readonly type: typeof START_LOADING_MY_PAST_EVENT;
};
export type StopLoadingMyPastEventAction = {
  readonly type: typeof STOP_LOADING_MY_PAST_EVENT;
};

export type FetchUserUpcomingEventAction = {
  readonly type: typeof FETCH_USER_UPCOMING_EVENT;
  payload: { userId: string; userEvents: UserEventModel[] };
};
export type StartLoadingUserUpcomingEventAction = {
  readonly type: typeof START_LOADING_USER_UPCOMING_EVENT;
  payload: { userId: string };
};
export type StopLoadingUserUpcomingEventAction = {
  readonly type: typeof STOP_LOADING_USER_UPCOMING_EVENT;
  payload: { userId: string };
};

export type FetchUserPendingEventAction = {
  readonly type: typeof FETCH_USER_PENDING_EVENT;
  payload: { userId: string; userEvents: UserEventModel[] };
};
export type StartLoadingUserPendingEventAction = {
  readonly type: typeof START_LOADING_USER_PENDING_EVENT;
  payload: { userId: string };
};
export type StopLoadingUserPendingEventAction = {
  readonly type: typeof STOP_LOADING_USER_PENDING_EVENT;
  payload: { userId: string };
};

export type FetchUserPastEventAction = {
  readonly type: typeof FETCH_USER_PAST_EVENT;
  payload: { userId: string; userEvents: UserEventModel[] };
};
export type StartLoadingUserPastEventAction = {
  readonly type: typeof START_LOADING_USER_PAST_EVENT;
  payload: { userId: string };
};
export type StopLoadingUserPastEventAction = {
  readonly type: typeof STOP_LOADING_USER_PAST_EVENT;
  payload: { userId: string };
};

export type EventAction =
  | FetchFeedAction
  | ClearEventsAction
  | StartLoadingFeedAction
  | StopLoadingFeedAction
  | FetchEventAction
  | UpdateEventParticipantsAction
  | StartLoadingEventAction
  | StopLoadingEventAction
  | FetchMyUpcomingEventAction
  | FetchMyPendingEventAction
  | FetchMyPastEventAction
  | StartLoadingMyUpcomingEventAction
  | StopLoadingMyUpcomingEventAction
  | StartLoadingMyPendingEventAction
  | StopLoadingMyPendingEventAction
  | StartLoadingMyPastEventAction
  | StopLoadingMyPastEventAction
  | FetchUserUpcomingEventAction
  | StartLoadingUserUpcomingEventAction
  | StopLoadingUserUpcomingEventAction
  | FetchUserPendingEventAction
  | StartLoadingUserPendingEventAction
  | StopLoadingUserPendingEventAction
  | FetchUserPastEventAction
  | StartLoadingUserPastEventAction
  | StopLoadingUserPastEventAction;
