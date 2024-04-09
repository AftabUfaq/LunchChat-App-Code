import { getArrayItemIndex, upsertArrayItemById } from '../../utils/arrays';
import {
  CLEAR_EVENTS,
  EventAction,
  EventModel,
  EventState,
  FETCH_EVENT,
  FETCH_FEED,
  FETCH_MY_PAST_EVENT,
  FETCH_MY_PENDING_EVENT,
  FETCH_MY_UPCOMING_EVENT,
  FETCH_USER_PAST_EVENT,
  FETCH_USER_UPCOMING_EVENT,
  MyEventsModel,
  START_LOADING_EVENT,
  START_LOADING_FEED,
  START_LOADING_MY_PAST_EVENT,
  START_LOADING_MY_PENDING_EVENT,
  START_LOADING_MY_UPCOMING_EVENT,
  START_LOADING_USER_PAST_EVENT,
  START_LOADING_USER_UPCOMING_EVENT,
  STOP_LOADING_EVENT,
  STOP_LOADING_FEED,
  STOP_LOADING_MY_PAST_EVENT,
  STOP_LOADING_MY_PENDING_EVENT,
  STOP_LOADING_MY_UPCOMING_EVENT,
  STOP_LOADING_USER_PAST_EVENT,
  STOP_LOADING_USER_UPCOMING_EVENT,
  UPDATE_EVENT_PARTICIPANTS,
  UserEventModel,
  UserEventsModel,
} from '../types';

const initialUserEventState: MyEventsModel = {
  upcoming: {
    events: [] as UserEventModel[],
    loading: false,
  },
  pending: {
    events: [] as UserEventModel[],
    loading: false,
  },
  past: {
    events: [] as UserEventModel[],
    loading: false,
  },
};

const initialState: EventState = {
  eventFeed: [] as EventModel[],
  events: [] as EventModel[],
  feedLoading: false,
  eventLoading: false,
  myEvents: initialUserEventState,
  userEvents: [] as UserEventsModel[],
};

const EventReducer = (
  state = initialState,
  action: EventAction
): EventState => {
  let userEventsIndex;
  switch (action.type) {
    case FETCH_FEED:
      return { ...state, eventFeed: action.payload };
    case START_LOADING_FEED:
      return { ...state, feedLoading: true };
    case STOP_LOADING_FEED:
      return { ...state, feedLoading: false };
    case FETCH_EVENT:
      // Check if event has id
      if (!action.payload.id) {
        return state;
      }
      return {
        ...state,
        events: upsertArrayItemById(
          action.payload.id,
          state.events,
          action.payload
        ),
      };
    case CLEAR_EVENTS:
      return {
        ...state,
        events: [],
      };
    case UPDATE_EVENT_PARTICIPANTS:
      return {
        ...state,
        events: upsertArrayItemById(action.payload.eventId, state.events, {
          participants: action.payload.participants,
        }),
      };
    case START_LOADING_EVENT:
      return {
        ...state,
        eventLoading: true,
      };
    case STOP_LOADING_EVENT:
      return {
        ...state,
        eventLoading: false,
      };
    case FETCH_MY_UPCOMING_EVENT:
      return {
        ...state,
        myEvents: {
          ...state.myEvents,
          upcoming: {
            ...state.myEvents.upcoming,
            events: action.payload,
          },
        },
      };
    case START_LOADING_MY_UPCOMING_EVENT:
      return {
        ...state,
        myEvents: {
          ...state.myEvents,
          upcoming: {
            ...state.myEvents.upcoming,
            loading: true,
          },
        },
      };
    case STOP_LOADING_MY_UPCOMING_EVENT:
      return {
        ...state,
        myEvents: {
          ...state.myEvents,
          upcoming: {
            ...state.myEvents.upcoming,
            loading: false,
          },
        },
      };
    case FETCH_MY_PENDING_EVENT:
      return {
        ...state,
        myEvents: {
          ...state.myEvents,
          pending: {
            ...state.myEvents.pending,
            events: action.payload,
          },
        },
      };
    case START_LOADING_MY_PENDING_EVENT:
      return {
        ...state,
        myEvents: {
          ...state.myEvents,
          pending: {
            ...state.myEvents.pending,
            loading: true,
          },
        },
      };
    case STOP_LOADING_MY_PENDING_EVENT:
      return {
        ...state,
        myEvents: {
          ...state.myEvents,
          pending: {
            ...state.myEvents.pending,
            loading: false,
          },
        },
      };
    case FETCH_MY_PAST_EVENT:
      return {
        ...state,
        myEvents: {
          ...state.myEvents,
          past: {
            ...state.myEvents.past,
            events: action.payload,
          },
        },
      };
    case START_LOADING_MY_PAST_EVENT:
      return {
        ...state,
        myEvents: {
          ...state.myEvents,
          past: {
            ...state.myEvents.past,
            loading: true,
          },
        },
      };
    case STOP_LOADING_MY_PAST_EVENT:
      return {
        ...state,
        myEvents: {
          ...state.myEvents,
          past: {
            ...state.myEvents.past,
            loading: false,
          },
        },
      };
    case FETCH_USER_UPCOMING_EVENT:
      userEventsIndex = getArrayItemIndex(
        action.payload.userId,
        state.userEvents
      );
      if (userEventsIndex < 0) {
        // Create new one
        return {
          ...state,
          userEvents: [
            ...state.userEvents,
            {
              ...initialUserEventState,
              id: action.payload.userId,
              upcoming: {
                ...initialUserEventState.upcoming,
                events: action.payload.userEvents,
              },
            },
          ],
        };
      }
      return {
        ...state,
        userEvents: upsertArrayItemById(
          action.payload.userId,
          state.userEvents,
          {
            ...state.userEvents[userEventsIndex],
            upcoming: {
              ...state.userEvents[userEventsIndex].upcoming,
              events: action.payload.userEvents,
            },
          }
        ),
      };
    case START_LOADING_USER_UPCOMING_EVENT:
      userEventsIndex = getArrayItemIndex(
        action.payload.userId,
        state.userEvents
      );

      if (userEventsIndex < 0) {
        // Create new one
        return {
          ...state,
          userEvents: [
            ...state.userEvents,
            {
              ...initialUserEventState,
              id: action.payload.userId,
              upcoming: {
                ...initialUserEventState.upcoming,
                loading: true,
              },
            },
          ],
        };
      }

      return {
        ...state,
        userEvents: upsertArrayItemById(
          action.payload.userId,
          state.userEvents,
          {
            ...state.userEvents[userEventsIndex],
            upcoming: {
              ...state.userEvents[userEventsIndex].upcoming,
              loading: true,
            },
          }
        ),
      };
    case STOP_LOADING_USER_UPCOMING_EVENT:
      userEventsIndex = getArrayItemIndex(
        action.payload.userId,
        state.userEvents
      );

      if (userEventsIndex < 0) {
        // Create new one
        return {
          ...state,
          userEvents: [
            ...state.userEvents,
            {
              ...initialUserEventState,
              id: action.payload.userId,
              upcoming: {
                ...initialUserEventState.upcoming,
                loading: false,
              },
            },
          ],
        };
      }
      return {
        ...state,
        userEvents: upsertArrayItemById(
          action.payload.userId,
          state.userEvents,
          {
            ...state.userEvents[userEventsIndex],
            upcoming: {
              ...state.userEvents[userEventsIndex].upcoming,
              loading: false,
            },
          }
        ),
      };
    case FETCH_USER_PAST_EVENT:
      userEventsIndex = getArrayItemIndex(
        action.payload.userId,
        state.userEvents
      );
      if (userEventsIndex < 0) {
        // Create new one
        return {
          ...state,
          userEvents: [
            ...state.userEvents,
            {
              ...initialUserEventState,
              id: action.payload.userId,
              past: {
                ...initialUserEventState.past,
                events: action.payload.userEvents,
              },
            },
          ],
        };
      }
      return {
        ...state,
        userEvents: upsertArrayItemById(
          action.payload.userId,
          state.userEvents,
          {
            ...state.userEvents[userEventsIndex],
            past: {
              ...state.userEvents[userEventsIndex].past,
              events: action.payload.userEvents,
            },
          }
        ),
      };
    case START_LOADING_USER_PAST_EVENT:
      userEventsIndex = getArrayItemIndex(
        action.payload.userId,
        state.userEvents
      );

      if (userEventsIndex < 0) {
        // Create new one
        return {
          ...state,
          userEvents: [
            ...state.userEvents,
            {
              ...initialUserEventState,
              id: action.payload.userId,
              past: {
                ...initialUserEventState.past,
                loading: true,
              },
            },
          ],
        };
      }

      return {
        ...state,
        userEvents: upsertArrayItemById(
          action.payload.userId,
          state.userEvents,
          {
            ...state.userEvents[userEventsIndex],
            past: {
              ...state.userEvents[userEventsIndex].past,
              loading: true,
            },
          }
        ),
      };
    case STOP_LOADING_USER_PAST_EVENT:
      userEventsIndex = getArrayItemIndex(
        action.payload.userId,
        state.userEvents
      );

      if (userEventsIndex < 0) {
        // Create new one
        return {
          ...state,
          userEvents: [
            ...state.userEvents,
            {
              ...initialUserEventState,
              id: action.payload.userId,
              past: {
                ...initialUserEventState.past,
                loading: false,
              },
            },
          ],
        };
      }
      return {
        ...state,
        userEvents: upsertArrayItemById(
          action.payload.userId,
          state.userEvents,
          {
            ...state.userEvents[userEventsIndex],
            past: {
              ...state.userEvents[userEventsIndex].past,
              loading: false,
            },
          }
        ),
      };
    default:
      return state;
  }
};

export { EventReducer };
