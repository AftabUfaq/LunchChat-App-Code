import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Icon, List, ListItem, Text } from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';
import React, { FC, useState } from 'react';
import {
  ImageProps,
  ListRenderItem,
  StyleSheet,
  View,
  ViewProps,
  TouchableOpacity,
} from 'react-native';
import AlertModal from '../../components/AlertModal';
import ScreenContainer from '../../components/ScreenContainer';
import Spacer from '../../components/Spacer';
import UserAvatar from '../../components/UserAvatar';
import useLoading from '../../hooks/useLoading';
import useNotifications from '../../hooks/useNotifications';
import { MainNavParamList } from '../../navigation/MainNavigator';
import {
  acceptEventParticipant,
  removeEventParticipant,
} from '../../services/event';
import {
  NotificationModel,
  NotificationTypes,
} from '../../store/types/notificationTypes';
import { fromNow } from '../../utils/date';

type Props = {
  navigation: StackNavigationProp<MainNavParamList>;
};

const NotificationScreen: FC<Props> = ({ navigation }: Props) => {
  const { notifications, notificationsLoading, loadNotifications } =
    useNotifications();
  const { asyncLoading } = useLoading();
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>();
  const [selectedUserId, setSelectedUserId] = useState<string>();

  const handleAvatarPress = (userId: string) =>
    navigation.navigate('ViewProfile', { userId });

  const handleAcceptUserEvent = async (eventId: string, userId: string) =>
    asyncLoading(async () => {
      await acceptEventParticipant(eventId, userId);
      return loadNotifications();
    });

  const handleConfirmRejectUser = async () =>
    asyncLoading(async () => {
      if (!selectedEventId || !selectedUserId) {
        return;
      }
      await removeEventParticipant(selectedEventId, selectedUserId);
      return loadNotifications();
    });

  const handleRejectUserEvent = (eventId: string, userId: string) => {
    setShowModal(true);
    setSelectedEventId(eventId);
    setSelectedUserId(userId);
  };

  const renderItem: ListRenderItem<NotificationModel> = ({ item }) => {
    let accessoryLeft: RenderProp<Partial<ImageProps>> | undefined;
    let accessoryRight: RenderProp<ViewProps> = function accessoryRight() {
      return (
        <View
          style={{
            justifyContent: 'flex-end',
          }}
        >
          <Text category="c2" appearance="hint">
            {fromNow(item.createdAt)}
          </Text>
        </View>
      );
    };
    const onPress = () =>
      navigation.navigate('Event', { eventId: item.data.eventId });
    switch (item.type) {
      case NotificationTypes.JOIN_EVENT:
        accessoryLeft = function accessoryLeft() {
          return (
            <TouchableOpacity
              onPress={() => handleAvatarPress(item.data.user.id)}
            >
              <UserAvatar userId={item.data.user.id} size="large" />
            </TouchableOpacity>
          );
        };
        break;
      case NotificationTypes.REQUEST_EVENT:
        accessoryLeft = function accessoryLeft() {
          return (
            <TouchableOpacity
              onPress={() => handleAvatarPress(item.data.user.id)}
            >
              <UserAvatar userId={item.data.user.id} size="large" />
            </TouchableOpacity>
          );
        };
        accessoryRight = function accessoryRight() {
          return (
            <View style={{ flexDirection: 'row' }}>
              <Text
                category="c2"
                appearance="hint"
                style={{ alignSelf: 'flex-end' }}
              >
                {fromNow(item.createdAt)}
              </Text>
              <Spacer />
              <Button
                size="small"
                status="success"
                accessoryLeft={() => (
                  <Icon
                    style={{ height: 20, width: 20 }}
                    name="checkmark-circle-2"
                    fill="white"
                  />
                )}
                onPress={() =>
                  handleAcceptUserEvent(item.data.eventId, item.data.user.id)
                }
              />
              <Spacer />
              <Button
                size="small"
                status="danger"
                accessoryLeft={() => (
                  <Icon
                    style={{ height: 20, width: 20 }}
                    name="close-circle"
                    fill={'white'}
                  />
                )}
                onPress={() =>
                  handleRejectUserEvent(item.data.eventId, item.data.user.id)
                }
              />
            </View>
          );
        };

        break;
      case NotificationTypes.STARTING_EVENT:
        accessoryLeft = function accessoryLeft() {
          return (
            <Icon style={styles.icon} name="calendar-outline" fill="#8F9BB3" />
          );
        };
        break;
      case NotificationTypes.REJECT_EVENT:
        accessoryLeft = function accessoryLeft() {
          return (
            <Icon style={styles.icon} name="calendar-outline" fill="#8F9BB3" />
          );
        };
        break;
      case NotificationTypes.ACCEPT_EVENT:
        accessoryLeft = function accessoryLeft() {
          return (
            <Icon style={styles.icon} name="calendar-outline" fill="#8F9BB3" />
          );
        };
        break;
      default:
        accessoryLeft = function accessoryLeft() {
          return (
            <Icon
              style={styles.icon}
              name="alert-circle-outline"
              fill="#8F9BB3"
            />
          );
        };
    }
    return (
      <ListItem
        title={item.title}
        description={item.message}
        accessoryLeft={accessoryLeft}
        accessoryRight={accessoryRight}
        onPress={onPress}
      />
    );
  };

  return (
    <ScreenContainer headerTitle="Notifications">
      <List
        style={styles.container}
        refreshing={notificationsLoading}
        onRefresh={loadNotifications}
        data={notifications}
        renderItem={renderItem}
      />
      <AlertModal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        status="Delete"
        title={`Reject event participant`}
        text={`Are you sure you want to reject user from event?`}
        buttonText="Remove"
        onPress={handleConfirmRejectUser}
      />
    </ScreenContainer>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: { height: 50, width: 50 },
});
