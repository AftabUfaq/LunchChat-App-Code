import {
  getCurrentPositionAsync,
  LocationAccuracy,
  requestForegroundPermissionsAsync, // Updated import
} from 'expo-location';
import { LocationGeocodedAddress, reverseGeocodeAsync } from 'expo-location';
import { Location } from '../store/types';
import { getDistance, computeDestinationPoint } from 'geolib';

export const getLocationAddress = async (
  latitude: number,
  longitude: number
): Promise<LocationGeocodedAddress[]> =>
  reverseGeocodeAsync({ latitude, longitude });

export const getCurrentLocation = async (): Promise<Location | undefined> => {
  try {
    const { status } = await requestForegroundPermissionsAsync(); // Updated to use requestForegroundPermissionsAsync
    if (status !== 'granted') {
      //  console.error('Location permission not granted');
      return undefined; // Permission not granted
    }
    const {
      coords: { longitude, latitude },
    } = await getCurrentPositionAsync({
      accuracy: LocationAccuracy.BestForNavigation,
    });
    return {
      longitude,
      latitude,
    };
  } catch (error) {
    //console.error(error);
  }
};

// The rest of your code remains unchanged

const getHashCode = (str: string) => {
  let hash = 0;
  let char = 0;

  if (str.length == 0) return hash;

  for (let i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;

    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
};

export const getApproximateLocation = (
  location: Location,
  id: string,
  maxDistance = 250
): Location => {
  const hash = Math.abs(getHashCode(id));
  const distance = hash % maxDistance;
  // Max 360
  const bearing = hash % 360;

  return computeDestinationPoint(location, distance, bearing);
};

export const getDistanceFromCurrentLocation = async (
  to: Location
): Promise<number | undefined> => {
  const from = await getCurrentLocation();
  if (from) {
    return getLocationDistance(from, to);
  }
};

export const getLocationDistance = getDistance;
