import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import {
  joinEvent as joinEventAPI,
  removeEventParticipant,
  deleteEvent as deleteEventAPI,
} from '../services/event';
import {
  fetchCurrentLocationAsync,
  fetchEventAsync,
  fetchFeedAsync,
  fetchMyPendingEventsAsync,
  fetchMyUpcomingEventsAsync,
  updateEventParticipantsAsync,
} from '../store/actions';
import { ApplicationState } from '../store/reducers';
import { EventModel, EventPrivacy, UserEventStates } from '../store/types';
import useLoading from './useLoading';
import useUser from './useUser';

type EventHook = {
  isLoading: boolean;
  event?: EventModel;
  fetchEvent: () => void;
  updateParticipants: () => void;
  isHost: boolean;
  joinEvent: (id?: string) => void;
  leaveEvent: (id?: string) => void;
  deleteEvent: () => void;
  myStatus?: UserEventStates;
};

const useEvent = (eventId?: string): EventHook => {
  const events = useSelector(
    (state: ApplicationState) => state.eventReducer.events
  );
  const isLoading = useSelector(
    (state: ApplicationState) => state.eventReducer.eventLoading
  );
  const dispatch = useDispatch();
  const { myInfo } = useUser();
  const { asyncLoading } = useLoading();

  const event = events.find((event) => event.id === eventId);

  const updateParticipants = () =>
    eventId && dispatch(updateEventParticipantsAsync(eventId));

  const fetchEvent = async () => {
    if (eventId) {
      await dispatch(fetchCurrentLocationAsync());
      await dispatch(fetchEventAsync(eventId));
    }
  };

  const isHost = myInfo?.id === event?.host?.userId;

  const myStatus = event?.participants?.find(
    (event) => event.userId === myInfo?.id
  )?.status;

  const joinEvent = async () => {
    await asyncLoading(async () => joinEventAPI(eventId || ''));
    if (event?.privacy === EventPrivacy.Open) {
      Toast.show({
        type: 'success',
        text1: 'Joined event',
        text2: 'You have joined the event successfully',
        topOffset: 40,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Requested to join event',
        text2: 'A request has been sent to event host',
        topOffset: 40,
      });
    }

    fetchEvent();
    dispatch(fetchMyUpcomingEventsAsync());
    dispatch(fetchMyPendingEventsAsync());
    dispatch(fetchFeedAsync());
  };

  const leaveEvent = async (id?: string) => {
    await asyncLoading(async () =>
      removeEventParticipant(id || eventId || '', myInfo?.id || '')
    );
    Toast.show({
      type: 'success',
      text1: 'Left the event',
      text2: 'You have left the event successfully',
      topOffset: 40,
    });

    fetchEvent();
    dispatch(fetchMyUpcomingEventsAsync());
    dispatch(fetchMyPendingEventsAsync());
    dispatch(fetchFeedAsync());
  };

  const deleteEvent = async () => {
    if (!eventId) {
      return;
    }

    await asyncLoading(async () => deleteEventAPI(eventId));
    Toast.show({
      type: 'success',
      text1: 'Event deleted',
      text2: 'You have deleted the event successfully',
      topOffset: 40,
    });

    dispatch(fetchMyUpcomingEventsAsync());
    dispatch(fetchMyPendingEventsAsync());
    dispatch(fetchFeedAsync());
  };

  useEffect(() => {
    if (eventId && !event) {
      fetchEvent();
    }
  }, [eventId]);

  return {
    isLoading,
    event,
    fetchEvent,
    updateParticipants,
    isHost,
    joinEvent,
    leaveEvent,
    myStatus,
    deleteEvent,
  };
};

export default useEvent;
