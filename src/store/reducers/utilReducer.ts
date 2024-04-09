import {
  UtilState,
  UtilAction,
  START_LOADING,
  STOP_LOADING,
  SHOW_ERROR,
  HIDE_ERROR,
} from '../types';

const initialState: UtilState = {
  loading: false,
  error: undefined,
};

const UtilReducer = (state = initialState, action: UtilAction): UtilState => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    case SHOW_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case HIDE_ERROR:
      return {
        ...state,
        error: undefined,
      };
    default:
      return state;
  }
};

export { UtilReducer };
