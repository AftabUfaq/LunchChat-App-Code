import { upsertArrayItemById } from '../../utils/arrays';
import {
  FETCH_BLOCKEES,
  FETCH_BLOCKERS,
  FETCH_MY_INFO,
  FETCH_USER_INFO,
  SIGNIN,
  SIGNOUT,
  START_LOADING_USER,
  STOP_LOADING_USER,
  UserAction,
  UserState,
} from '../types';

const initialState: UserState = {
  me: undefined,
  signedIn: false,
  users: [],
  userLoading: false,
  blockees: [],
  blockers: [],
  v: 0,
};

const UserReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case SIGNIN:
      return {
        ...state,
        signedIn: true,
      };
    case SIGNOUT:
      return {
        ...state,
        me: undefined,
        signedIn: false,
      };
    case FETCH_MY_INFO:
      return {
        ...state,
        me: action.payload,
        v: state.v + 1,
      };
    case FETCH_USER_INFO:
      if (!action.payload.id) {
        return state;
      }
      return {
        ...state,
        users: upsertArrayItemById(
          action.payload.id,
          state.users,
          action.payload
        ),
      };
    case START_LOADING_USER:
      return {
        ...state,
        userLoading: true,
      };
    case STOP_LOADING_USER:
      return {
        ...state,
        userLoading: false,
      };
    case FETCH_BLOCKERS:
      return {
        ...state,
        blockers: action.payload,
      };
    case FETCH_BLOCKEES:
      return {
        ...state,
        blockees: action.payload,
      };
    default:
      return state;
  }
};

export { UserReducer };
