import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentLocationAsync,
  fetchMyPastEventsAsync,
  fetchMyPendingEventsAsync,
  fetchMyUpcomingEventsAsync,
} from '../store/actions';
import { ApplicationState } from '../store/reducers';
import { UserEventModel } from '../store/types';

type MyEventsHook = {
  pastEvents: UserEventModel[];
  pastLoading: boolean;
  pendingEvents: UserEventModel[];
  pendingLoading: boolean;
  upcomingEvents: UserEventModel[];
  upcomingLoading: boolean;
  fetchUpcoming: () => void;
  fetchPending: () => void;
  fetchPast: () => void;
};

const useMyEvents = (): MyEventsHook => {
  const dispatch = useDispatch();
  const { events: pastEvents, loading: pastLoading } = useSelector(
    (state: ApplicationState) => state.eventReducer.myEvents.past
  );
  const { events: pendingEvents, loading: pendingLoading } = useSelector(
    (state: ApplicationState) => state.eventReducer.myEvents.pending
  );
  const { events: upcomingEvents, loading: upcomingLoading } = useSelector(
    (state: ApplicationState) => state.eventReducer.myEvents.upcoming
  );

  const fetchUpcoming = async () => {
    await dispatch(fetchCurrentLocationAsync());
    await dispatch(fetchMyUpcomingEventsAsync());
  };

  const fetchPending = async () => {
    await dispatch(fetchCurrentLocationAsync());
    await dispatch(fetchMyPendingEventsAsync());
  };

  const fetchPast = () => dispatch(fetchMyPastEventsAsync());

  useEffect(() => {
    upcomingEvents.length === 0 && fetchUpcoming();
    pendingEvents.length === 0 && fetchPending();
    pastEvents.length === 0 && fetchPast();
  }, []);

  return {
    pastEvents,
    pastLoading,
    pendingEvents,
    pendingLoading,
    upcomingEvents,
    upcomingLoading,
    fetchUpcoming,
    fetchPending,
    fetchPast,
  };
};

export default useMyEvents;
