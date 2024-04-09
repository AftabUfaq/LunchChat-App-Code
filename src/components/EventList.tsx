import { List, ListItem, Button, Icon, Divider } from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';
import React, { useState, FC } from 'react';
import {
  StyleSheet,
  useColorScheme,
  ListRenderItem,
  ImageProps,
} from 'react-native';

const data = new Array(8).fill({
  title: 'Title for Item',
  description: 'Description for Item',
}) as [ListData];

type ListData = {
  title: string;
  description: string;
};

const EventList: FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  const renderItemAccessory = () => <Button size="tiny">JOIN</Button>;

  const renderItemIcon: RenderProp<Partial<ImageProps>> = (props) => (
    <Icon {...props} name="person" />
  );

  const renderItem: ListRenderItem<ListData> = ({ item, index }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  );

  return (
    <List
      data={data}
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
  );
};

export default EventList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
