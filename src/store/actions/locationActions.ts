import { getCurrentLocation } from '../../utils/location';
import { AppDispatch } from '../store';
import {
  FetchCurrentLocationAction,
  FETCH_CURRENT_LOCATION,
  Location,
} from '../types';

export const fetchCurrentLocation = (
  location: Location
): FetchCurrentLocationAction => ({
  type: FETCH_CURRENT_LOCATION,
  payload: location,
});

export const fetchCurrentLocationAsync =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    const location = await getCurrentLocation();
    if (location) {
      dispatch(fetchCurrentLocation(location));
    }
  };
