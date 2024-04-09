import {
  createBottomTabNavigator,
  BottomTabBarProps,
  BottomTabBarOptions,
} from '@react-navigation/bottom-tabs';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  Layout,
} from '@ui-kitten/components';
import React, { FC } from 'react';
import { SafeAreaView } from 'react-native';

import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabNavParamList>();

export type TabNavParamList = {
  Home: undefined;
  Explore: undefined;
  Profile: undefined;
};

const BottomTabBar = ({
  navigation,
  state,
}: BottomTabBarProps<BottomTabBarOptions>) => (
  <Layout>
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <BottomNavigationTab
        title="Home"
        icon={(props) => <Icon {...props} name="calendar-outline" />}
      />
      <BottomNavigationTab
        title="Explore"
        icon={(props) => <Icon {...props} name="search-outline" />}
      />
      <BottomNavigationTab
        title="Profile"
        icon={(props) => <Icon {...props} name="person-outline" />}
      />
    </BottomNavigation>
    <SafeAreaView />
  </Layout>
);

export const TabNavigator: FC = () => (
  <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Explore" component={ExploreScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
