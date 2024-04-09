import { Button } from '@ui-kitten/components';
import React, { FC } from 'react';
import {
  StyleSheet,
  GestureResponderEvent,
  View,
  ViewProps,
} from 'react-native';
import { UserEventStates } from '../store/types';
import moment from 'moment';

type Props = {
  onLeavePress?: (event: GestureResponderEvent) => void;
  onJoinPress?: (event: GestureResponderEvent) => void;
  onCancelPress?: (event: GestureResponderEvent) => void;
  status?: UserEventStates;
  isHost: boolean;
  endDate?: Date;
} & ViewProps;

const EventActions: FC<Props> = ({
  isHost,
  status,
  onLeavePress,
  onJoinPress,
  onCancelPress,
  endDate,
  ...props
}: Props) => {
  const isPastEvent = endDate ? moment(endDate).isBefore(moment()) : false;

  const Body = () => {
    if (isPastEvent) {
      if (isHost) {
        return (
          <Button style={styles.buttonContainer} status="basic">
            Hosted
          </Button>
        );
      }

      switch (status) {
        case UserEventStates.Accepted:
          return (
            <Button style={styles.buttonContainer} status="basic">
              Gone
            </Button>
          );
        default:
          return (
            <Button style={styles.buttonContainer} status="basic">
              Passed
            </Button>
          );
      }
    }

    if (isHost) {
      return (
        <Button style={styles.buttonContainer} status="basic">
          Hosting
        </Button>
      );
    }

    switch (status) {
      case UserEventStates.Accepted:
        return (
          <Button
            style={styles.buttonContainer}
            onPress={onLeavePress}
            status="danger"
          >
            Leave
          </Button>
        );
      case UserEventStates.Pending:
        return (
          <Button
            style={styles.buttonContainer}
            onPress={onCancelPress}
            status="warning"
          >
            Cancel Request
          </Button>
        );
      default:
        return (
          <Button
            style={styles.buttonContainer}
            onPress={onJoinPress}
            status="success"
          >
            Join
          </Button>
        );
    }
  };

  return (
    <View style={styles.container} {...props}>
      <Body />
    </View>
  );
};

export default EventActions;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
  },
});
