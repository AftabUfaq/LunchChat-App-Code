import {
  createEvent,
  getEvent,
  getEventParticipants,
  getFeed,
  getMyPastEvents,
  getMyPendingEvents,
  getMyUpcomingEvents,
  getUserPastEvents,
  getUserUpcomingEvents,
} from '../../services/event';
import { ApplicationState } from '../reducers';
import { AppDispatch } from '../store';
import {
  ClearEventsAction,
  CLEAR_EVENTS,
  EventModel,
  EventParticipantModel,
  FetchEventAction,
  FetchFeedAction,
  FetchMyPastEventAction,
  FetchMyPendingEventAction,
  FetchMyUpcomingEventAction,
  FetchUserPastEventAction,
  FetchUserUpcomingEventAction,
  FETCH_EVENT,
  FETCH_FEED,
  FETCH_MY_PAST_EVENT,
  FETCH_MY_PENDING_EVENT,
  FETCH_MY_UPCOMING_EVENT,
  FETCH_USER_PAST_EVENT,
  FETCH_USER_UPCOMING_EVENT,
  StartLoadingEventAction,
  StartLoadingFeedAction,
  StartLoadingMyPastEventAction,
  StartLoadingMyPendingEventAction,
  StartLoadingMyUpcomingEventAction,
  StartLoadingUserPastEventAction,
  StartLoadingUserUpcomingEventAction,
  START_LOADING_EVENT,
  START_LOADING_FEED,
  START_LOADING_MY_PAST_EVENT,
  START_LOADING_MY_PENDING_EVENT,
  START_LOADING_MY_UPCOMING_EVENT,
  START_LOADING_USER_PAST_EVENT,
  START_LOADING_USER_UPCOMING_EVENT,
  StopLoadingEventAction,
  StopLoadingFeedAction,
  StopLoadingMyPastEventAction,
  StopLoadingMyPendingEventAction,
  StopLoadingMyUpcomingEventAction,
  StopLoadingUserPastEventAction,
  StopLoadingUserUpcomingEventAction,
  STOP_LOADING_EVENT,
  STOP_LOADING_FEED,
  STOP_LOADING_MY_PAST_EVENT,
  STOP_LOADING_MY_PENDING_EVENT,
  STOP_LOADING_MY_UPCOMING_EVENT,
  STOP_LOADING_USER_PAST_EVENT,
  STOP_LOADING_USER_UPCOMING_EVENT,
  UpdateEventParticipantsAction,
  UPDATE_EVENT_PARTICIPANTS,
  UserEventModel,
} from '../types';
import { asyncLoading } from './utilActions';
import { getBlockUserIds } from '../../utils/blockUser';

/* ------------------------------ Create Event ------------------------------ */

export const createEventAsync =
  (event: EventModel) =>
  async (
    dispatch: AppDispatch,
    getState: () => ApplicationState
  ): Promise<void> => {
    const user = getState().userReducer.me;

    if (!user) {
      throw new Error('User not authenticated');
    }
    // Set user as host
    event.host = {
      userId: user.id,
      name: user.name,
    };

    await asyncLoading(dispatch, async () => createEvent(event));
  };

/* ------------------------------- Fetch Feed ------------------------------- */

export const fetchFeed = (events: EventModel[]): FetchFeedAction => ({
  type: FETCH_FEED,
  payload: events,
});

export const startLoadingFeed = (): StartLoadingFeedAction => ({
  type: START_LOADING_FEED,
});

export const stopLoadingFeed = (): StopLoadingFeedAction => ({
  type: STOP_LOADING_FEED,
});

export const fetchFeedAsync =
  () =>
  async (
    dispatch: AppDispatch,
    getState: () => ApplicationState
  ): Promise<void> => {
    dispatch(startLoadingFeed());
    const state = getState();
    const userIds = getBlockUserIds(state);
    const currentLocation = state.locationReducer.current;

    const events = await getFeed(userIds, currentLocation);
    dispatch(fetchFeed(events));
    dispatch(stopLoadingFeed());
  };

/* ------------------------------- Fetch Event ------------------------------ */

export const fetchEvent = (event: EventModel): FetchEventAction => ({
  type: FETCH_EVENT,
  payload: event,
});

export const clearEvents = (): ClearEventsAction => ({
  type: CLEAR_EVENTS,
});

export const updateEventParticipants = (
  eventId: string,
  participants: EventParticipantModel[]
): UpdateEventParticipantsAction => ({
  type: UPDATE_EVENT_PARTICIPANTS,
  payload: { eventId, participants },
});

export const startLoadingEvent = (): StartLoadingEventAction => ({
  type: START_LOADING_EVENT,
});

export const stopLoadingEvent = (): StopLoadingEventAction => ({
  type: STOP_LOADING_EVENT,
});

export const fetchEventAsync =
  (eventId: string) =>
  async (
    dispatch: AppDispatch,
    getState: () => ApplicationState
  ): Promise<void> => {
    dispatch(startLoadingEvent());
    const state = getState();
    const blockerIds = getBlockUserIds(state);
    const location = state.locationReducer.current;
    const event = await getEvent(eventId, location);
    event.participants = await getEventParticipants(eventId, blockerIds);
    dispatch(fetchEvent(event));
    dispatch(stopLoadingEvent());
  };

export const updateEventParticipantsAsync =
  (eventId: string) =>
  async (
    dispatch: AppDispatch,
    getState: () => ApplicationState
  ): Promise<void> => {
    dispatch(startLoadingEvent());
    const state = getState();
    const blockerIds = getBlockUserIds(state);
    const participants = await getEventParticipants(eventId, blockerIds);
    dispatch(updateEventParticipants(eventId, participants));
    dispatch(stopLoadingEvent());
  };

/* -------------------------------------------------------------------------- */
/*                                  MY EVENTS                                 */
/* -------------------------------------------------------------------------- */

/* --------------------------- My Upcoming Events --------------------------- */

export const fetchMyUpcomingEvents = (
  events: UserEventModel[]
): FetchMyUpcomingEventAction => ({
  type: FETCH_MY_UPCOMING_EVENT,
  payload: events,
});

export const startLoadingMyUpcomingEvent =
  (): StartLoadingMyUpcomingEventAction => ({
    type: START_LOADING_MY_UPCOMING_EVENT,
  });

export const stopLoadingMyUpcomingEvent =
  (): StopLoadingMyUpcomingEventAction => ({
    type: STOP_LOADING_MY_UPCOMING_EVENT,
  });

// Adjust the function to correctly pass the current user's ID and location.
export const fetchMyUpcomingEventsAsync =
  () =>
  async (
    dispatch: AppDispatch,
    getState: () => ApplicationState
  ): Promise<void> => {
    dispatch(startLoadingMyUpcomingEvent());
    const state = getState();

    // Accessing the current user's ID through the 'userReducer'
    const currentUserId = state.userReducer.me?.id; // Adjusted from state.user.me?.id to state.userReducer.me?.id
    if (!currentUserId) {
      //console.error("Current user ID not found.");
      return;
    }

    const blockerIds = getBlockUserIds(state); // Assuming this function correctly handles getting an array of IDs to block
    const location = state.locationReducer.current;

    // Now calling getMyUpcomingEvents with the correct current user's ID and the array of blockerIds
    const events = await getMyUpcomingEvents(
      currentUserId,
      blockerIds,
      location
    );
    dispatch(fetchMyUpcomingEvents(events));
    dispatch(stopLoadingMyUpcomingEvent());
  };

/* ---------------------------- My Pending Events --------------------------- */

export const fetchMyPendingEvents = (
  events: UserEventModel[]
): FetchMyPendingEventAction => ({
  type: FETCH_MY_PENDING_EVENT,
  payload: events,
});

export const startLoadingMyPendingEvent =
  (): StartLoadingMyPendingEventAction => ({
    type: START_LOADING_MY_PENDING_EVENT,
  });

export const stopLoadingMyPendingEvent =
  (): StopLoadingMyPendingEventAction => ({
    type: STOP_LOADING_MY_PENDING_EVENT,
  });

export const fetchMyPendingEventsAsync =
  () =>
  async (
    dispatch: AppDispatch,
    getState: () => ApplicationState
  ): Promise<void> => {
    dispatch(startLoadingMyPendingEvent());
    const state = getState();
    const userIds = getBlockUserIds(state);
    const location = state.locationReducer.current;
    const events = await getMyPendingEvents(userIds, location);
    dispatch(fetchMyPendingEvents(events));
    dispatch(stopLoadingMyPendingEvent());
  };

/* ----------------------------- My Past Events ----------------------------- */

export const fetchMyPastEvents = (
  events: UserEventModel[]
): FetchMyPastEventAction => ({
  type: FETCH_MY_PAST_EVENT,
  payload: events,
});

export const startLoadingMyPastEvent = (): StartLoadingMyPastEventAction => ({
  type: START_LOADING_MY_PAST_EVENT,
});

export const stopLoadingMyPastEvent = (): StopLoadingMyPastEventAction => ({
  type: STOP_LOADING_MY_PAST_EVENT,
});

export const fetchMyPastEventsAsync =
  () =>
  async (
    dispatch: AppDispatch,
    getState: () => ApplicationState
  ): Promise<void> => {
    dispatch(startLoadingMyUpcomingEvent());
    const state = getState();
    const userIds = getBlockUserIds(state);
    const events = await getMyPastEvents(userIds);
    dispatch(fetchMyPastEvents(events));
    dispatch(stopLoadingMyUpcomingEvent());
  };

/* -------------------------------------------------------------------------- */
/*                                 USER EVENTS                                */
/* -------------------------------------------------------------------------- */

/* -------------------------- User Upcoming Events -------------------------- */

export const fetchUserUpcomingEvents = (
  userId: string,
  userEvents: UserEventModel[]
): FetchUserUpcomingEventAction => ({
  type: FETCH_USER_UPCOMING_EVENT,
  payload: { userId, userEvents },
});

export const startLoadingUserUpcomingEvent = (
  userId: string
): StartLoadingUserUpcomingEventAction => ({
  type: START_LOADING_USER_UPCOMING_EVENT,
  payload: { userId },
});

export const stopLoadingUserUpcomingEvent = (
  userId: string
): StopLoadingUserUpcomingEventAction => ({
  type: STOP_LOADING_USER_UPCOMING_EVENT,
  payload: { userId },
});

export const fetchUserUpcomingEventsAsync =
  (userId: string) =>
  async (
    dispatch: AppDispatch,
    getState: () => ApplicationState
  ): Promise<void> => {
    dispatch(startLoadingUserUpcomingEvent(userId));
    const state = getState();
    const blockedUserIds = getBlockUserIds(state);
    const location = state.locationReducer.current;
    const events = await getUserUpcomingEvents(
      userId,
      blockedUserIds,
      location
    );
    dispatch(fetchUserUpcomingEvents(userId, events));
    dispatch(stopLoadingUserUpcomingEvent(userId));
  };

/* ---------------------------- User Past Events ---------------------------- */

export const fetchUserPastEvents = (
  userId: string,
  userEvents: UserEventModel[]
): FetchUserPastEventAction => ({
  type: FETCH_USER_PAST_EVENT,
  payload: { userId, userEvents },
});

export const startLoadingUserPastEvent = (
  userId: string
): StartLoadingUserPastEventAction => ({
  type: START_LOADING_USER_PAST_EVENT,
  payload: { userId },
});

export const stopLoadingUserPastEvent = (
  userId: string
): StopLoadingUserPastEventAction => ({
  type: STOP_LOADING_USER_PAST_EVENT,
  payload: { userId },
});

export const fetchUserPastEventsAsync =
  (userId: string) =>
  async (
    dispatch: AppDispatch,
    getState: () => ApplicationState
  ): Promise<void> => {
    dispatch(startLoadingUserPastEvent(userId));
    const state = getState();
    const blockedUserIds = getBlockUserIds(state);
    const events = await getUserPastEvents(userId, blockedUserIds);
    dispatch(fetchUserPastEvents(userId, events));
    dispatch(stopLoadingUserPastEvent(userId));
  };
