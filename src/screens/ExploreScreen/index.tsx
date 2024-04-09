import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { List } from '@ui-kitten/components';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import EventActions from '../../components/EventActions';
import EventCard from '../../components/EventCard';
import FAB from '../../components/FAB';
import ScreenContainer from '../../components/ScreenContainer';
// import useEvent from '../../hooks/useEvent';
// import useUser from '../../hooks/useUser';
import { MainNavParamList } from '../../navigation/MainNavigator';
import { TabNavParamList } from '../../navigation/TabNavigator';
import { fetchCurrentLocationAsync, fetchFeedAsync } from '../../store/actions';
import { ApplicationState } from '../../store/reducers';
import { EventModel, EventPrivacy } from '../../store/types';

type Props = {
  navigation: CompositeNavigationProp<
    StackNavigationProp<MainNavParamList>,
    BottomTabNavigationProp<TabNavParamList, 'Explore'>
  >;
};

const ExploreScreen: FC<Props> = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const eventFeed = useSelector(
    (state: ApplicationState) => state.eventReducer.eventFeed
  );
  const feedLoading = useSelector(
    (state: ApplicationState) => state.eventReducer.feedLoading
  );
  // const { joinEvent, leaveEvent } = useEvent();
  // const { myInfo } = useUser();

  const handleAddEvent = () => {
    navigation.navigate('AddEvent');
  };

  const handleViewEvent = (eventId: string) => {
    navigation.navigate('Event', { eventId });
  };

  const handleFetchEvents = async () => {
    await dispatch(fetchCurrentLocationAsync());
    await dispatch(fetchFeedAsync());
  };

  // const handleJoinEvent = async (eventId: string) => joinEvent(eventId);

  // const handleLeaveEvent = async (eventId: string) => leaveEvent(eventId);

  const handleUserPress = (userId?: string) =>
    userId && navigation.navigate('ViewProfile', { userId });

  useEffect(() => {
    handleFetchEvents();
  }, []);

  const renderItem = ({ item }: { item: EventModel }) => {
    // const isHost = item.host?.userId === myInfo?.id;
    // const status = item.participants?.find((user) => user.userId === myInfo?.id)
    //   ?.status;

    const onUserPress = () => handleUserPress(item.host?.userId);

    return (
      <EventCard
        title={item.title}
        description={item.description}
        onCardPress={() => item.id && handleViewEvent(item.id)}
        startDate={item.startDate}
        endDate={item.endDate}
        isPrivate={item.privacy === EventPrivacy.Closed}
        userName={item.host?.name}
        userId={item.host?.userId}
        distance={item.distance}
        // footerComponent={(props) => (
        //   <EventActions
        //     {...props}
        //     style={{ padding: 10 }}
        //     status={status}
        //     isHost={isHost}
        //     onJoinPress={() => item.id && handleJoinEvent(item.id)}
        //     onLeavePress={() => item.id && handleLeaveEvent(item.id)}
        //     endDate={item.endDate}
        //   />
        // )}
        onUserPress={onUserPress}
      />
    );
  };

  return (
    <ScreenContainer headerTitle="Explore" canGoBack={false}>
      <List
        data={eventFeed}
        keyExtractor={(item, index) => item.id || `event-${index}`} // Updated keyExtractor
        renderItem={renderItem}
        refreshing={feedLoading}
        onRefresh={handleFetchEvents}
      />
      <FAB onPress={handleAddEvent} />
    </ScreenContainer>
  );
};

export default ExploreScreen;
