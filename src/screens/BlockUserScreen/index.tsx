import { Button, Divider, List, ListItem } from '@ui-kitten/components';
import React, { FC, useState } from 'react';
import { ListRenderItem, StyleSheet, useColorScheme, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import UserAvatar from '../../components/UserAvatar';
import useUser from '../../hooks/useUser';
import { PartialUserModel } from '../../store/types';

const BlockUserScreen: FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  // Show blockees - users that I block
  const { blockees, unblockUser } = useUser();

  const renderItemAccessory = (userId: string) => (
    <Button size="tiny" onPress={() => unblockUser(userId)}>
      Unblock
    </Button>
  );

  const renderItemIcon = (userId: string) => <UserAvatar userId={userId} />;

  const renderItem: ListRenderItem<PartialUserModel> = ({ item }) => (
    <ListItem
      title={item.name}
      accessoryLeft={() => renderItemIcon(item.id)}
      accessoryRight={() => renderItemAccessory(item.id)}
    />
  );

  return (
    <ScreenContainer headerTitle="Blocked Users">
      <View style={styles.container}>
        <List
          data={blockees}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
          refreshing={refreshing}
          style={[
            styles.container,
            { backgroundColor: colorScheme === 'dark' ? 'black' : 'white' },
          ]}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => setRefreshing(false), 500);
          }}
        />
      </View>
    </ScreenContainer>
  );
};

export default BlockUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
