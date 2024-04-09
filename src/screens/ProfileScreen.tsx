import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon, TopNavigationAction } from '@ui-kitten/components';
import React, { FC } from 'react';
import ProfileContainer from '../components/ProfileContainer';
import ScreenContainer from '../components/ScreenContainer';
import useMyEvents from '../hooks/useMyEvents';
import useUser from '../hooks/useUser';
import { MainNavParamList } from '../navigation/MainNavigator';
import { TabNavParamList } from '../navigation/TabNavigator';

type Props = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<MainNavParamList>,
    BottomTabNavigationProp<TabNavParamList, 'Profile'>
  >;
};

const ProfileScreen: FC<Props> = ({ navigation }: Props) => {
  const { myInfo, version } = useUser();
  const {
    pastEvents,
    pastLoading,
    upcomingEvents,
    upcomingLoading,
    fetchUpcoming,
    fetchPast,
  } = useMyEvents();

  const handleViewEvent = (eventId: string) => {
    navigation.navigate('Event', { eventId });
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const headerAccessoryRight = () => (
    <TopNavigationAction
      icon={(props) => <Icon name="settings-outline" {...props} />}
      onPress={handleSettingsPress}
    />
  );

  return (
    <ScreenContainer
      headerTitle="My Profile"
      canGoBack={false}
      accessoryRight={headerAccessoryRight}
    >
      <ProfileContainer
        userId={myInfo?.id}
        userName={myInfo?.name}
        userBio={myInfo?.bio}
        onViewEventPress={handleViewEvent}
        upcomingEvents={upcomingEvents}
        upcomingLoading={upcomingLoading}
        onLoadUpcoming={fetchUpcoming}
        pastEvents={pastEvents}
        pastLoading={pastLoading}
        onLoadPast={fetchPast}
        version={version}
      />
    </ScreenContainer>
  );
};

export default ProfileScreen;
