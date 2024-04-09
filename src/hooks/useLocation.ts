import {
  getCurrentPositionAsync,
  LocationAccuracy,
  LocationObject,
  requestForegroundPermissionsAsync, // Changed from requestPermissionsAsync
} from 'expo-location';

type LocationHook = {
  getCurrentLocation: () => Promise<LocationObject | undefined>;
};

export default (): LocationHook => {
  const getCurrentLocation = async () => {
    try {
      const { status } = await requestForegroundPermissionsAsync(); // Changed method
      if (status === 'granted') {
        return getCurrentPositionAsync({
          accuracy: LocationAccuracy.BestForNavigation,
        });
      } else {
        // Handle the case where permission is not granted
        console.log('Location permission not granted');
        return undefined;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      // console.error(error);
      return undefined;
    }
  };

  return { getCurrentLocation };
};
