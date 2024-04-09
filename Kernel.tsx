import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import React, { FC, useState, useEffect } from 'react';
import { LogBox, useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider, useDispatch } from 'react-redux';
import ErrorModal from './src/components/ErrorModal';
import LoadingModal from './src/components/LoadingModal';
import { AppNavigator } from './src/navigation/AppNavigator';
import { auth, firestore, functions, storage } from './src/services/Firebase'; // Adjust import according to your file structure
import { onAuthStateChanged } from 'firebase/auth';
import store from './src/store/store';
import { fetchMyInfoAsync, onSignin, onSignout } from './src/store/actions';
import { default as theme } from './src/styles/theme.json';
LogBox.ignoreLogs(['Setting a timer for a long period of time']);

const Kernel: FC = () => {
  const colorScheme = useColorScheme();
  const [appLoading, setAppLoading] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const cacheImages = async () => {
      const images = [
        require('./src/assets/images/eating-together.jpg'),
        require('./src/assets/images/white-warwick.png'),
      ];

      const cache = images.map((image) =>
        Asset.fromModule(image).downloadAsync()
      );
      return Promise.all(cache);
    };

    const handleAppLoading = async () => {
      await cacheImages();

      onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(onSignin());
          dispatch(fetchMyInfoAsync());
        } else {
          dispatch(onSignout());
        }
        setIsUserLoaded(true);
      });
    };

    handleAppLoading().catch(console.warn);
  }, [dispatch]);

  if (appLoading || !isUserLoaded) {
    return (
      <AppLoading
        startAsync={Promise.resolve}
        onFinish={() => setAppLoading(false)}
        onError={console.warn}
      />
    );
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{ ...eva[colorScheme || 'light'], ...theme }}
      >
        <AppNavigator />
        <LoadingModal />
        <Toast ref={(ref) => Toast.setRef(ref)} />
        <ErrorModal />
      </ApplicationProvider>
    </>
  );
};

export default Kernel;
