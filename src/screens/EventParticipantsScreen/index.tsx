import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  Icon,
  Layout,
  List,
  ListItem,
  Popover,
  Text,
  useTheme,
} from '@ui-kitten/components';
import React, { FC, useState } from 'react';
import { ListRenderItem, StyleSheet, View } from 'react-native';
import AlertModal from '../../components/AlertModal';
import ScreenContainer from '../../components/ScreenContainer';
import Spacer from '../../components/Spacer';
import UserAvatar from '../../components/UserAvatar';
import useEvent from '../../hooks/useEvent';
import useLoading from '../../hooks/useLoading';
import useUser from '../../hooks/useUser';
import { MainNavParamList } from '../../navigation/MainNavigator';
import {
  acceptEventParticipant,
  removeEventParticipant,
} from '../../services/event';
import { EventParticipantModel, UserEventStates } from '../../store/types';

type Props = {
  navigation: StackNavigationProp<MainNavParamList>;
  route: RouteProp<MainNavParamList, 'EventParticipants'>;
};

const EventParticipantsScreen: FC<Props> = ({ navigation, route }: Props) => {
  const { eventId } = route.params;

  const [popoverVisibleIndex, setPopoverVisibleIndex] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [isReject, setIsReject] = useState<boolean>();
  const theme = useTheme();
  const { asyncLoading } = useLoading();
  const { myInfo } = useUser();
  const { event, isHost, updateParticipants, isLoading } = useEvent(eventId);

  const handleUserPress = (userId: string) =>
    navigation.navigate('ViewProfile', { userId });

  const handleAcceptUser = async (userId: string) => {
    return asyncLoading(async () => {
      await acceptEventParticipant(eventId, userId);
      updateParticipants();
    });
  };

  const handleConfirmRemoveUser = async () => {
    return asyncLoading(async () => {
      if (!selectedUserId) {
        return;
      }
      await removeEventParticipant(eventId, selectedUserId);
      updateParticipants();
    });
  };

  const handleRemoveUser = (userId: string, reject: boolean) => {
    setIsReject(reject);
    setShowModal(true);
    setPopoverVisibleIndex(-1);
    setSelectedUserId(userId);
  };

  const renderItemIcon = (userId: string) => <UserAvatar userId={userId} />;

  const renderUserStatus = (status: UserEventStates, userId: string) => {
    if (userId === event?.host?.userId) {
      return <Text>Host</Text>;
    }
    if (status === UserEventStates.Accepted) {
      return (
        <Icon
          style={styles.icon}
          name="checkmark-circle-2"
          fill={theme['color-success-default']}
        />
      );
    }
    return (
      <Icon
        style={styles.icon}
        name="clock"
        fill={theme['color-warning-default']}
      />
    );
  };

  const renderToggleButton = (index: number) => (
    <Button
      onPress={() => setPopoverVisibleIndex(index)}
      size="small"
      style={{ width: 10 }}
      accessoryLeft={(props) => (
        <Icon {...props} name="more-vertical-outline" />
      )}
    />
  );

  const renderUserActions = (
    itemIndex: number,
    currentStatus: UserEventStates,
    userId: string
  ) => {
    const popoverVisible = popoverVisibleIndex === itemIndex;

    // Is Me
    if (userId === myInfo?.id) {
      return <Text appearance="hint">You</Text>;
    }

    if (currentStatus === UserEventStates.Pending) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {renderUserStatus(currentStatus, userId)}
          <Spacer />
          <Button
            size="small"
            status="success"
            onPress={() => handleAcceptUser(userId)}
            accessoryLeft={() => (
              <Icon
                style={{ height: 20, width: 20 }}
                name="checkmark-circle-2"
                fill="white"
              />
            )}
          />
          <Spacer />
          <Button
            size="small"
            status="danger"
            onPress={() => handleRemoveUser(userId, true)}
            accessoryLeft={() => (
              <Icon
                style={{ height: 20, width: 20 }}
                name="close-circle"
                fill={'white'}
              />
            )}
          />
        </View>
      );
    }

    const renderAnchor = () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {renderUserStatus(currentStatus, userId)}
        <Spacer />
        {renderToggleButton(itemIndex)}
      </View>
    );

    return (
      <Popover
        visible={popoverVisible}
        anchor={renderAnchor}
        onBackdropPress={() => setPopoverVisibleIndex(-1)}
      >
        <Layout style={{ padding: 10 }}>
          <Button
            status="danger"
            size="small"
            onPress={() => handleRemoveUser(userId, false)}
          >
            Remove
          </Button>
        </Layout>
      </Popover>
    );
  };

  const renderItem: ListRenderItem<EventParticipantModel> = ({
    item,
    index,
  }) => {
    const onPress = () => handleUserPress(item.userId);

    if (isHost) {
      return (
        <ListItem
          title={item.name}
          key={item.userId}
          accessoryLeft={() => renderItemIcon(item.userId)}
          accessoryRight={() =>
            renderUserActions(index, item.status, item.userId)
          }
          onPress={onPress}
        />
      );
    }

    return (
      <ListItem
        title={item.name}
        key={item.userId}
        accessoryLeft={() => renderItemIcon(item.userId)}
        accessoryRight={() => renderUserStatus(item.status, item.userId)}
        onPress={onPress}
      />
    );
  };

  return (
    <ScreenContainer headerTitle="Event Participants">
      <List
        data={event?.participants}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId}
        onRefresh={updateParticipants}
        refreshing={isLoading}
      />
      <AlertModal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        status="Delete"
        title={`${isReject ? 'Reject' : 'Remove'} event participant`}
        text={`Are you sure you want to ${
          isReject ? 'reject' : 'remove'
        } user from event?`}
        buttonText="Remove"
        onPress={handleConfirmRemoveUser}
      />
    </ScreenContainer>
  );
};

export default EventParticipantsScreen;

const styles = StyleSheet.create({
  icon: {
    height: 25,
    width: 25,
  },
});
