import {
  FETCH_CURRENT_LOCATION,
  LocationAction,
  LocationState,
} from '../types';

const initialState: LocationState = {
  current: undefined,
};

const LocationReducer = (
  state = initialState,
  action: LocationAction
): LocationState => {
  switch (action.type) {
    case FETCH_CURRENT_LOCATION:
      return { ...state, current: action.payload };
    default:
      return state;
  }
};

export { LocationReducer };
