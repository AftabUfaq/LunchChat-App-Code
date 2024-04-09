export const SIGNIN = 'SIGNIN';
export const SIGNOUT = 'SIGNOUT';
export const FETCH_MY_INFO = 'FETCH_MY_INFO';
export const FETCH_USER_INFO = 'FETCH_USER_INFO';
export const START_LOADING_USER = 'START_LOADING_USER';
export const STOP_LOADING_USER = 'STOP_LOADING_USER';
export const FETCH_BLOCKERS = 'FETCH_BLOCKERS';
export const FETCH_BLOCKEES = 'FETCH_BLOCKEES';

export type UserModel = {
  id?: string;
  name: string;
  email: string;
  bio?: string;
};

export type PartialUserModel = {
  id: string;
  name: string;
};

export type UserState = {
  me: UserModel | undefined;
  users: UserModel[];
  signedIn: boolean;
  userLoading: boolean;
  blockers: PartialUserModel[];
  blockees: PartialUserModel[];
  v: number;
};

export type SigninAction = {
  readonly type: typeof SIGNIN;
};

export type SignoutAction = {
  readonly type: typeof SIGNOUT;
};

export type FetchMyInfoAction = {
  readonly type: typeof FETCH_MY_INFO;
  payload: UserModel;
};

export type FetchUserInfoAction = {
  readonly type: typeof FETCH_USER_INFO;
  payload: UserModel;
};

export type StartLoadingUserAction = {
  readonly type: typeof START_LOADING_USER;
};

export type StopLoadingUserAction = {
  readonly type: typeof STOP_LOADING_USER;
};

export type FetchBlockersAction = {
  readonly type: typeof FETCH_BLOCKERS;
  payload: PartialUserModel[];
};

export type FetchBlockeesAction = {
  readonly type: typeof FETCH_BLOCKEES;
  payload: PartialUserModel[];
};

export type UserAction =
  | SigninAction
  | SignoutAction
  | FetchMyInfoAction
  | FetchUserInfoAction
  | StartLoadingUserAction
  | StopLoadingUserAction
  | FetchBlockersAction
  | FetchBlockeesAction;
