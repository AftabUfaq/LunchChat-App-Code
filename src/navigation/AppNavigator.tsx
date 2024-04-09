import { NavigationContainer } from '@react-navigation/native';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../store/reducers';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export const AppNavigator: FC = () => {
  const signedIn = useSelector(
    (state: ApplicationState) => !!state.userReducer.signedIn
  );
  return (
    <NavigationContainer>
      {signedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
