import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { uploadUserAvatar } from '../services/images';
import { postBlockUser, postUnblockUser } from '../services/user';
import {
  fetchBlockeesAsync,
  fetchBlockersAsync,
  fetchMyPastEventsAsync,
  fetchMyPendingEventsAsync,
  fetchUserInfoAsync,
  fetchFeedAsync,
  fetchUserPastEventsAsync,
  fetchUserUpcomingEventsAsync,
  clearEvents,
  updateUserBioAsync,
  fetchMyInfoAsync,
  fetchMyUpcomingEventsAsync,
} from '../store/actions';
import { ApplicationState } from '../store/reducers';
import { PartialUserModel, UserEventModel, UserModel } from '../store/types';
import { getArrayItemById } from '../utils/arrays';
import useLoading from './useLoading';

type UserHook = {
  myInfo?: UserModel;
  userInfo?: UserModel;
  isUserLoading: boolean;
  userUpcomingEvents?: UserEventModel[];
  isUserUpcomingEventsLoading: boolean;
  loadUserUpcomingEvents: () => void;
  userPastEvents?: UserEventModel[];
  isUserPastEventsLoading: boolean;
  loadUserPastEvents: () => void;
  blockUser: (blockeeId?: string) => void;
  unblockUser: (blockeeId?: string) => void;
  isSelf: boolean;
  blockees: PartialUserModel[];
  blockers: PartialUserModel[];
  updateBio: (bio: string) => Promise<void>;
  uploadMyAvatar: (uri: string) => Promise<string | undefined>;
  reloadEvents: () => Promise<void>;
  reloadMyInfo: () => Promise<void>;
  version: number;
};

const useUser = (userId?: string): UserHook => {
  const dispatch = useDispatch();
  const { asyncLoading } = useLoading();
  const myInfo = useSelector((state: ApplicationState) => state.userReducer.me);
  const userInfo = userId
    ? useSelector((state: ApplicationState) =>
        getArrayItemById(userId, state.userReducer.users)
      )
    : undefined;
  const isUserLoading = useSelector(
    (state: ApplicationState) => state.userReducer.userLoading
  );
  const version = useSelector((state: ApplicationState) => state.userReducer.v);

  const userUpcoming = useSelector((state: ApplicationState) =>
    userId
      ? getArrayItemById(userId, state.eventReducer.userEvents)?.upcoming
      : undefined
  );
  const userUpcomingEvents = userUpcoming?.events;
  const isUserUpcomingEventsLoading = userUpcoming?.loading || false;
  const loadUserUpcomingEvents = () =>
    userId && dispatch(fetchUserUpcomingEventsAsync(userId));

  const userPast = userId
    ? useSelector(
        (state: ApplicationState) =>
          getArrayItemById(userId, state.eventReducer.userEvents)?.past
      )
    : undefined;
  const userPastEvents = userPast?.events;
  const isUserPastEventsLoading = userPast?.loading || false;

  const isSelf = myInfo?.id === userId;

  const blockers = useSelector(
    (state: ApplicationState) => state.userReducer.blockers
  );
  const blockees = useSelector(
    (state: ApplicationState) => state.userReducer.blockees
  );

  const loadUserPastEvents = () =>
    userId && dispatch(fetchUserPastEventsAsync(userId));

  const loadBlockers = async () => dispatch(fetchBlockersAsync());

  const loadBlockees = async () => dispatch(fetchBlockeesAsync());

  const reloadEvents = async () => {
    dispatch(clearEvents());
    dispatch(fetchMyUpcomingEventsAsync());
    dispatch(fetchMyPendingEventsAsync());
    dispatch(fetchMyPastEventsAsync());
    dispatch(fetchFeedAsync());
  };

  const updateBio = async (bio: string) => {
    await dispatch(updateUserBioAsync(bio));
    await dispatch(fetchMyInfoAsync());
  };

  const blockUser = async (blockeeId?: string) =>
    asyncLoading(async () => {
      if (blockeeId) {
        await postBlockUser(blockeeId);
      } else if (userId) {
        await postBlockUser(userId);
      } else {
        return;
      }
      await loadBlockees();
      await reloadEvents();
      Toast.show({
        type: 'success',
        text1: 'User blocked',
        text2: `You have successfully blocked ${userInfo?.name}`,
        topOffset: 40,
      });
    });

  const unblockUser = (blockeeId?: string) =>
    asyncLoading(async () => {
      if (blockeeId) {
        await postUnblockUser(blockeeId);
      } else if (userId) {
        await postUnblockUser(userId);
      } else {
        return;
      }
      await loadBlockees();
      await reloadEvents();
      Toast.show({
        type: 'success',
        text1: 'User unblocked',
        text2: `You have successfully unblocked the user`,
        topOffset: 40,
      });
    });

  const uploadMyAvatar = async (uri: string) =>
    asyncLoading(async () => myInfo?.id && uploadUserAvatar(uri, myInfo?.id));

  const reloadMyInfo = async () => {
    await dispatch(fetchMyInfoAsync());
  };

  // Load up all the items that don't exist
  useEffect(() => {
    if (userId) {
      if (!userInfo) {
        dispatch(fetchUserInfoAsync(userId));
      }
      if (!userUpcoming) {
        loadUserUpcomingEvents();
      }
      if (!userPastEvents) {
        loadUserPastEvents();
      }
    }
  }, [userId]);

  useEffect(() => {
    loadBlockees();
    loadBlockers();
  }, []);

  return {
    myInfo,
    userInfo,
    isUserLoading,
    userUpcomingEvents,
    isUserUpcomingEventsLoading,
    loadUserUpcomingEvents,
    userPastEvents,
    isUserPastEventsLoading,
    loadUserPastEvents,
    blockUser,
    unblockUser,
    isSelf,
    blockees,
    blockers,
    updateBio,
    uploadMyAvatar,
    reloadEvents,
    reloadMyInfo,
    version,
  };
};

export default useUser;
