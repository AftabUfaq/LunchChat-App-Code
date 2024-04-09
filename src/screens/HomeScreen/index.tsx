import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Icon,
  List,
  Tab,
  TabView,
  TopNavigationAction,
} from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';
import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';
import EventCard from '../../components/EventCard';
import FAB from '../../components/FAB';
import ScreenContainer from '../../components/ScreenContainer';
import useMyEvents from '../../hooks/useMyEvents';
import { MainNavParamList } from '../../navigation/MainNavigator';
import { TabNavParamList } from '../../navigation/TabNavigator';
import { EventPrivacy, UserEventModel } from '../../store/types';

type Props = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<MainNavParamList>,
    BottomTabNavigationProp<TabNavParamList, 'Home'>
  >;
};

const HomeScreen: FC<Props> = ({ navigation }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {
    pastEvents,
    pastLoading,
    pendingEvents,
    pendingLoading,
    upcomingEvents,
    upcomingLoading,
    fetchUpcoming,
    fetchPending,
    fetchPast,
  } = useMyEvents();

  const handleOpenAddEvent = () => {
    navigation.navigate('AddEvent');
  };

  const handleViewEvent = (eventId: string) => {
    navigation.navigate('Event', { eventId });
  };

  const handleUserPress = (userId?: string) => {
    userId && navigation.navigate('ViewProfile', { userId });
  };

  const handleNotificationPress = () => navigation.navigate('Notifications');

  const renderItem = ({ item }: { item: UserEventModel }) => {
    const onUserPress = () => handleUserPress(item.host?.userId);
    return (
      <EventCard
        userName={item.host?.name}
        userId={item.host?.userId}
        title={item.title}
        description={item.description}
        startDate={item.startDate}
        endDate={item.endDate}
        isPrivate={item.privacy === EventPrivacy.Closed}
        distance={item.distance}
        onCardPress={() => item.id && handleViewEvent(item.id)}
        acceptanceState={item.status}
        onUserPress={onUserPress}
      />
    );
  };

  const NotificationIcon = () => (
    <TopNavigationAction
      icon={(props) => <Icon {...props} name="bell-outline" />}
      onPress={handleNotificationPress}
    />
  );

  return (
    <ScreenContainer
      headerTitle="My Lunch Chats"
      canGoBack={false}
      accessoryRight={NotificationIcon}
    >
      <TabView
        style={styles.container}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      >
        <Tab
          title="Upcoming"
          icon={(props) => <Icon name="play-circle-outline" {...props} />}
        >
          <List
            data={upcomingEvents}
            refreshing={upcomingLoading}
            onRefresh={fetchUpcoming}
            keyExtractor={(item, index) => item.id || `upcoming-${index}`} // Ensure a string is returned
            renderItem={renderItem}
          />
        </Tab>
        <Tab
          title="Pending"
          icon={(props) => <Icon name="clock-outline" {...props} />}
        >
          <List
            data={pendingEvents}
            refreshing={pendingLoading}
            onRefresh={fetchPending}
            keyExtractor={(item, index) => item.id || `pending-${index}`} // Ensure a string is returned
            renderItem={renderItem}
          />
        </Tab>
        <Tab
          title="Past"
          icon={(props) => (
            <Icon name="checkmark-circle-2-outline" {...props} />
          )}
        >
          <List
            data={pastEvents}
            refreshing={pastLoading}
            onRefresh={fetchPast}
            keyExtractor={(item, index) => item.id || `past-${index}`} // Ensure a string is returned
            renderItem={renderItem}
          />
        </Tab>
      </TabView>

      <FAB onPress={handleOpenAddEvent} />
    </ScreenContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
