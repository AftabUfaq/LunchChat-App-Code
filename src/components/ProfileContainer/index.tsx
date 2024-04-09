import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon, Layout, List, Tab, TabView, Text } from '@ui-kitten/components';
import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';
import { MainNavParamList } from '../../navigation/MainNavigator';
import { EventPrivacy, UserEventModel } from '../../store/types';
import EventCard from '../EventCard';
import UserAvatar from '../UserAvatar';

const DEFAULT_BIO = 'Space to add your beautiful bio';

type Props = {
  userId?: string;
  userName?: string;
  userBio?: string;
  onViewEventPress: (itemId: string) => void;
  upcomingEvents: UserEventModel[];
  upcomingLoading: boolean;
  onLoadUpcoming: () => void;
  pastEvents: UserEventModel[];
  pastLoading: boolean;
  onLoadPast: () => void;
  isLoading?: boolean;
  version?: number;
};

const index: FC<Props> = ({
  userId,
  userName,
  userBio = DEFAULT_BIO,
  onViewEventPress,
  upcomingEvents,
  upcomingLoading,
  onLoadUpcoming,
  pastEvents,
  pastLoading,
  onLoadPast,
  version,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigation = useNavigation<StackNavigationProp<MainNavParamList>>();

  const keyExtractor = (item: UserEventModel, index: number) =>
    item.id || index.toString();

  const handleUserPress = (userId?: string) =>
    userId && navigation.navigate('ViewProfile', { userId });

  const renderItem = ({ item }: { item: UserEventModel }) => {
    const onUserPress = () => handleUserPress(item.host?.userId);

    return (
      <EventCard
        userName={item.host?.name}
        userId={item.host?.userId}
        title={item.title}
        description={item.description}
        startDate={item?.startDate}
        endDate={item.endDate}
        isPrivate={item.privacy === EventPrivacy.Closed}
        distance={item.distance}
        onCardPress={() => item.id && onViewEventPress(item.id)}
        acceptanceState={item.status}
        onUserPress={onUserPress}
      />
    );
  };

  return (
    <Layout style={{ flex: 1 }}>
      <Layout style={{ padding: 10 }}>
        <Layout style={styles.userProfileContainer}>
          <UserAvatar
            shape="round"
            userId={userId}
            size="giant"
            version={version}
          />

          <Layout style={styles.userTitleContainer}>
            <Text style={styles.name}>{userName}</Text>
          </Layout>
        </Layout>

        <Text style={styles.bio}>{userBio}</Text>
      </Layout>
      <Layout style={{ flex: 1 }} level="2">
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
              onRefresh={onLoadUpcoming}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
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
              onRefresh={onLoadPast}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </Tab>
        </TabView>
      </Layout>
    </Layout>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  userTitleContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  name: {
    fontSize: 26,
  },
  bio: {
    margin: 20,
  },
});
