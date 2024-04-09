import { ApplicationState } from '../store/reducers';

export const getBlockUserIds = (state: ApplicationState): string[] => {
  return [...state.userReducer.blockees, ...state.userReducer.blockers].map(
    (user) => user.id
  );
};

export const getBlockerIds = (state: ApplicationState): string[] => {
  return [...state.userReducer.blockers].map((user) => user.id);
};
