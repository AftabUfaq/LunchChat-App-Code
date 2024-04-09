import { Card } from '@ui-kitten/components';
import { RenderProp } from '@ui-kitten/components/devsupport';
import React, { FC } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { UserEventStates } from '../../store/types';
import CardBody from './components/CardBody';
import CardHeader from './components/CardHeader';

type Props = {
  acceptanceState?: UserEventStates;
  userName?: string;
  userId?: string;
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  distance?: number;
  isPrivate: boolean;
  onCardPress?: () => void;
  onJoinPress?: () => void;
  footerComponent?: RenderProp<ViewProps>;
  onUserPress?: () => void;
};

const EventCard: FC<Props> = ({
  acceptanceState,
  userName = 'Bruno Wu',
  userId,
  title = 'Lunch Today',
  description = 'this is the description',
  onCardPress,
  startDate,
  endDate,
  isPrivate,
  footerComponent,
  onUserPress,
  distance,
}: Props) => {
  return (
    <Card
      appearance="outline"
      header={(props) => (
        <CardHeader
          title={userName}
          userId={userId}
          acceptanceState={acceptanceState}
          onPress={onUserPress}
          {...props}
        />
      )}
      footer={footerComponent}
      style={styles.container}
      onPress={onCardPress}
    >
      <CardBody
        title={title}
        description={description}
        startDate={startDate}
        endDate={endDate}
        isPrivate={isPrivate}
        distance={distance}
      />
    </Card>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginVertical: 10 },
});
