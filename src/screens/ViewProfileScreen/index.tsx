import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  Icon,
  Layout,
  Popover,
  TopNavigationAction,
} from '@ui-kitten/components';
import React, { FC, useState } from 'react';
import AlertModal from '../../components/AlertModal';
import ProfileContainer from '../../components/ProfileContainer';
import ScreenContainer from '../../components/ScreenContainer';
import useUser from '../../hooks/useUser';
import { MainNavParamList } from '../../navigation/MainNavigator';

type Props = {
  navigation: StackNavigationProp<MainNavParamList>;
  route: RouteProp<MainNavParamList, 'ViewProfile'>;
};

const ViewProfile: FC<Props> = ({ navigation, route }: Props) => {
  const { userId } = route.params;

  const {
    userInfo,
    isUserLoading,
    userUpcomingEvents = [],
    isUserUpcomingEventsLoading,
    loadUserUpcomingEvents,
    userPastEvents = [],
    isUserPastEventsLoading,
    loadUserPastEvents,
    blockUser,
    isSelf,
  } = useUser(userId);
  const [showUserActions, setShowUserActions] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const toggleShowUserActions = () => setShowUserActions((show) => !show);

  const handleViewEvent = (eventId: string) => {
    navigation.navigate('Event', { eventId });
  };

  const handleConfirmBlock = async () => {
    await blockUser();
    navigation.popToTop();
  };

  const handleBlockUser = () => {
    setShowUserActions(false);
    setShowBlockModal(true);
  };

  const renderUserActions = () => {
    if (isSelf) {
      return <></>;
    }

    const renderAnchor = () => (
      <TopNavigationAction
        onPress={toggleShowUserActions}
        icon={(props) => <Icon {...props} name="more-vertical-outline" />}
      />
    );

    return (
      <Popover
        visible={showUserActions}
        anchor={renderAnchor}
        onBackdropPress={toggleShowUserActions}
      >
        <Layout style={{ padding: 10 }}>
          <Button status="danger" size="small" onPress={handleBlockUser}>
            Block
          </Button>
        </Layout>
      </Popover>
    );
  };

  return (
    <ScreenContainer
      headerTitle="View Profile"
      isLoading={isUserLoading}
      accessoryRight={renderUserActions}
    >
      <ProfileContainer
        userId={userId}
        userName={userInfo?.name}
        userBio={userInfo?.bio}
        onViewEventPress={handleViewEvent}
        upcomingEvents={userUpcomingEvents}
        upcomingLoading={isUserUpcomingEventsLoading}
        onLoadUpcoming={loadUserUpcomingEvents}
        pastEvents={userPastEvents}
        pastLoading={isUserPastEventsLoading}
        onLoadPast={loadUserPastEvents}
      />
      <AlertModal
        visible={showBlockModal}
        onDismiss={() => setShowBlockModal(false)}
        status="Delete"
        title="Block User"
        text="Are you sure you want to block the user?"
        onPress={handleConfirmBlock}
        buttonText="Block"
      />
    </ScreenContainer>
  );
};

export default ViewProfile;
