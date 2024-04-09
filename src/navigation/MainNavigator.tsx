import { createStackNavigator } from '@react-navigation/stack';
import React, { FC } from 'react';
import useNotifications from '../hooks/useNotifications';
import useUser from '../hooks/useUser';
import AddEventScreen from '../screens/AddEventScreen';
import BlockUserScreen from '../screens/BlockUserScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EventUserScreen from '../screens/EventParticipantsScreen';
import EventScreen from '../screens/EventScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ViewProfileScreen from '../screens/ViewProfileScreen';
import { TabNavigator } from './TabNavigator';

const Stack = createStackNavigator<MainNavParamList>();

export type MainNavParamList = {
  Tab: undefined;
  AddEvent: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Event: { eventId: string };
  Chat: { eventId: string };
  ChangePassword: undefined;
  BlockUser: undefined;
  EventParticipants: { eventId: string };
  ViewProfile: { userId: string };
  Notifications: undefined;
};

export const MainNavigator: FC = () => {
  useNotifications(true);
  useUser();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tab" component={TabNavigator} />
      <Stack.Screen name="AddEvent" component={AddEventScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Event" component={EventScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="BlockUser" component={BlockUserScreen} />
      <Stack.Screen name="EventParticipants" component={EventUserScreen} />
      <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
    </Stack.Navigator>
  );
};
