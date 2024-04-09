/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  Icon,
  Layout,
  Popover,
  Text,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';
import React, {
  FC,
  useCallback,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useColorScheme } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Circle, Marker } from 'react-native-maps';
import AlertModal from '../../components/AlertModal';
import EventActions from '../../components/EventActions';
import Map from '../../components/Map';
import ScreenContainer from '../../components/ScreenContainer';
import Spacer from '../../components/Spacer';
import UserAvatar from '../../components/UserAvatar';
import useEvent from '../../hooks/useEvent';
import { MainNavParamList } from '../../navigation/MainNavigator';
import {
  EventParticipantModel,
  EventPrivacy,
  UserEventStates,
} from '../../store/types';
import { formatEventDateString } from '../../utils/date';
import {
  getApproximateLocation,
  getDistanceFromCurrentLocation,
} from '../../utils/location';

type Props = {
  navigation: StackNavigationProp<MainNavParamList>;
  route: RouteProp<MainNavParamList, 'Event'>;
};

const EventScreen: FC<Props> = ({ navigation, route }: Props) => {
  const { eventId } = route.params;
  const {
    isLoading,
    event,
    fetchEvent,
    joinEvent,
    myStatus,
    leaveEvent,
    isHost,
    deleteEvent,
  } = useEvent(eventId);
  const [distance, setDistance] = useState<number | undefined>();
  const [showEventActions, setShowEventActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const toggleShowEventActions = () => setShowEventActions((show) => !show);
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const circleRef = useRef<typeof Circle | null>(null);

  // Chat only visible if accepted into the closed event
  // Open events anyone can see chat
  const detailsVisible =
    event?.privacy === EventPrivacy.Open ||
    myStatus === UserEventStates.Accepted;

  const markerCoords = event?.location && {
    longitude: event.location.longitude,
    latitude: event.location.latitude,
  };
  const approximateCoords =
    markerCoords && getApproximateLocation(markerCoords, eventId, 250);

  const loadDistance = useCallback(async () => {
    if (detailsVisible) {
      return setDistance(event?.distance);
    }
    if (approximateCoords) {
      const value = await getDistanceFromCurrentLocation(approximateCoords);
      return value && value >= 0 && setDistance(value);
    }
  }, [detailsVisible, event, approximateCoords]);

  const region = {
    longitude:
      (detailsVisible
        ? markerCoords?.longitude
        : approximateCoords?.longitude) || 0,
    latitude:
      (detailsVisible ? markerCoords?.latitude : approximateCoords?.latitude) ||
      0,
    longitudeDelta: 0.01,
    latitudeDelta: 0.01,
  };

  const handleParticipantsPress = () => {
    navigation.navigate('EventParticipants', {
      eventId,
    });
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('ViewProfile', { userId });
  };

  const handleJoinPress = () => joinEvent();

  const handleLeavePress = () => {
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = async () => leaveEvent();

  const handleDeleteEvent = () => {
    setShowEventActions(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    await deleteEvent();
    navigation.popToTop();
  };

  const renderItem = ({ item }: { item: EventParticipantModel }) => (
    <TouchableOpacity
      onPress={() => handleUserPress(item.userId)}
      style={styles.listItem}
    >
      <UserAvatar userId={item.userId} />
      <Spacer margin={1} />
      <Text style={styles.userName} category="c1" appearance="hint">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderEventActions = () => {
    if (!isHost) {
      return <></>;
    }

    const renderAnchor = () => (
      <TopNavigationAction
        onPress={toggleShowEventActions}
        icon={(props) => <Icon {...props} name="more-vertical-outline" />}
      />
    );

    return (
      <Popover
        visible={showEventActions}
        anchor={renderAnchor}
        onBackdropPress={toggleShowEventActions}
      >
        <Layout style={{ padding: 10 }}>
          <Button status="danger" size="small" onPress={handleDeleteEvent}>
            Delete Event
          </Button>
        </Layout>
      </Popover>
    );
  };

  useEffect(() => {
    loadDistance();
  }, [loadDistance]);

  useLayoutEffect(() => {
    if (circleRef?.current) {
      // @ts-ignore
      circleRef.current.setNativeProps({
        strokeColor: theme['color-primary-500'],
        fillColor: theme['color-primary-transparent-100'],
      });
    }
  }, [isLoading]);

  return (
    <ScreenContainer
      headerTitle="Lunch Chat"
      isLoading={isLoading}
      accessoryRight={renderEventActions}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchEvent}
            tintColor={colorScheme === 'dark' ? 'white' : 'black'}
          />
        }
      >
        <Text category="h2">{event?.title}</Text>
        <Spacer />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ textTransform: 'capitalize' }}>
            {`${
              event && formatEventDateString(event?.startDate, event.endDate)
            } | `}
          </Text>
          <Icon
            style={{ height: 15, width: 15, alignSelf: 'center' }}
            fill={colorScheme === 'dark' ? 'white' : 'black'}
            name={
              event?.privacy === EventPrivacy.Open ? 'globe' : 'lock-outline'
            }
          />
          <Text style={{ textTransform: 'capitalize' }}>
            {' '}
            {event?.privacy ?? 'Unknown'} event
          </Text>
        </View>

        {distance !== undefined ? (
          <>
            <Spacer />
            <Text>{distance}m away</Text>
          </>
        ) : null}
        <Spacer />
        <Text>{event?.description}</Text>
        <Spacer />
        {region && (
          <Map style={styles.map} initialRegion={region}>
            <>
              {detailsVisible
                ? markerCoords && <Marker coordinate={markerCoords} />
                : approximateCoords && (
                    <Circle
                      // @ts-ignore
                      ref={circleRef}
                      center={approximateCoords}
                      radius={250}
                    />
                  )}
            </>
          </Map>
        )}

        <Spacer />
        <TouchableOpacity onPress={handleParticipantsPress}>
          <Text category="s1">Participants</Text>
          <FlatList
            style={styles.flatList}
            horizontal
            data={event?.participants}
            contentContainerStyle={{ marginLeft: 15 }}
            keyExtractor={(item) => item.userId}
            renderItem={renderItem}
          />
        </TouchableOpacity>
        <EventActions
          onLeavePress={handleLeavePress}
          onJoinPress={handleJoinPress}
          onCancelPress={handleConfirmLeave}
          status={myStatus}
          isHost={isHost}
          endDate={event?.endDate}
        />
        <Spacer />
        {detailsVisible && (
          <Button
            onPress={() => navigation.navigate('Chat', { eventId })}
            accessoryLeft={(props) => (
              <Icon name="message-circle-outline" {...props} />
            )}
          >
            Chat
          </Button>
        )}
      </ScrollView>
      <AlertModal
        visible={showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        status="Delete"
        title="Delete Event"
        text="Are you sure you want to delete the event"
        onPress={handleConfirmDelete}
      />
      <AlertModal
        visible={showLeaveModal}
        onDismiss={() => setShowLeaveModal(false)}
        status="Delete"
        title="Leave Event"
        text={`Are you sure you want to leave ${event?.title}`}
        buttonText="Leave"
        onPress={handleConfirmLeave}
      />
    </ScreenContainer>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  map: {
    height: 300,
  },
  listItem: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  flatList: {
    marginHorizontal: -20,
  },
  userName: {
    textAlign: 'center',
  },
});
