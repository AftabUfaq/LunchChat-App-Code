import {
  getBlockees,
  getBlockers,
  getMyInfo,
  getUserInfo,
  postUserBio,
} from '../../services/user';
import { AppDispatch } from '../store';
import {
  SIGNIN,
  SIGNOUT,
  UserAction,
  FETCH_MY_INFO,
  UserModel,
  FETCH_USER_INFO,
  START_LOADING_USER,
  STOP_LOADING_USER,
  PartialUserModel,
  FETCH_BLOCKERS,
  FETCH_BLOCKEES,
} from '../types';

export const onSignin = (): UserAction => ({
  type: SIGNIN,
});

export const onSignout = (): UserAction => ({
  type: SIGNOUT,
});

export const startLoadingUser = (): UserAction => ({
  type: START_LOADING_USER,
});

export const stopLoadingUser = (): UserAction => ({
  type: STOP_LOADING_USER,
});

export const fetchMyInfo = (user: UserModel): UserAction => ({
  type: FETCH_MY_INFO,
  payload: user,
});

export const fetchUserInfo = (user: UserModel): UserAction => ({
  type: FETCH_USER_INFO,
  payload: user,
});

export const fetchMyInfoAsync =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(startLoadingUser());
    const userInfo = await getMyInfo();
    dispatch(stopLoadingUser());
    if (userInfo) {
      dispatch(fetchMyInfo(userInfo));
    } else {
      // Handle the case where userInfo is undefined
      // For example, you could dispatch an error action, or a sign-out action, etc.
      // console.error('Failed to fetch my info');
      // dispatch(yourErrorHandlingActionHere());
    }
  };

export const fetchUserInfoAsync =
  (userId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(startLoadingUser());
    const userInfo = await getUserInfo(userId);
    dispatch(stopLoadingUser());
    if (userInfo) {
      dispatch(fetchUserInfo(userInfo));
    } else {
      // Handle the case where userInfo is undefined
      // For example, you could dispatch an error action
      // console.error(`Failed to fetch user info for userId: ${userId}`);
      // dispatch(yourErrorHandlingActionHere());
    }
  };

export const updateUserBioAsync =
  (bio: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(startLoadingUser());
    await postUserBio(bio);
    dispatch(stopLoadingUser());
  };

/* -------------------------------------------------------------------------- */
/*                                  BLOCKING                                  */
/* -------------------------------------------------------------------------- */

export const fetchBlockers = (blockers: PartialUserModel[]): UserAction => ({
  type: FETCH_BLOCKERS,
  payload: blockers,
});

export const fetchBlockersAsync =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    const blockers = await getBlockers();
    dispatch(fetchBlockers(blockers));
  };

export const fetchBlockees = (blockees: PartialUserModel[]): UserAction => ({
  type: FETCH_BLOCKEES,
  payload: blockees,
});

export const fetchBlockeesAsync =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    const blockees = await getBlockees();
    dispatch(fetchBlockees(blockees));
  };
