import { createStackNavigator } from '@react-navigation/stack';
import React, { FC } from 'react';

import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createStackNavigator<AuthNavParamList>();

export const AuthNavigator: FC = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Signin" component={SigninScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

export type AuthNavParamList = {
  Signin: undefined;
  Signup: undefined;
};
