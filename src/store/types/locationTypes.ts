export type Location = {
  longitude: number;
  latitude: number;
};

/* -------------------------------------------------------------------------- */
/*                                   REDUCER                                  */
/* -------------------------------------------------------------------------- */

export type LocationState = {
  current?: Location;
};

/* -------------------------------------------------------------------------- */
/*                                   ACTIONS                                  */
/* -------------------------------------------------------------------------- */

export const FETCH_CURRENT_LOCATION = 'FETCH_CURRENT_LOCATION';

/* -------------------------------------------------------------------------- */
/*                               ACTION CREATORS                              */
/* -------------------------------------------------------------------------- */

export type FetchCurrentLocationAction = {
  readonly type: typeof FETCH_CURRENT_LOCATION;
  payload: Location;
};

export type LocationAction = FetchCurrentLocationAction;
