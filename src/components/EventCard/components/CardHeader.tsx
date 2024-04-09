import { CardProps, Text } from '@ui-kitten/components';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { UserEventStates } from '../../../store/types';
import Spacer from '../../Spacer';
import UserAvatar from '../../UserAvatar';

type Props = {
  title: string;
  acceptanceState?: UserEventStates;
  userId?: string;
  onPress?: () => void;
} & CardProps;

const CardHeader: FC<Props> = ({
  title,
  userId,
  acceptanceState,
  onPress,
  ...props
}: Props) => {
  const states = {
    accepted: 'success',
    finished: 'info',
    pending: 'warning',
  };
  return (
    <View {...props}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.container} onPress={onPress}>
          <UserAvatar userId={userId} />
          <Spacer />
          <Text category="s1">{title}</Text>
        </TouchableOpacity>
        {acceptanceState && (
          <Text style={styles.acceptanceText} status={states[acceptanceState]}>
            {acceptanceState}
          </Text>
        )}
      </View>
    </View>
  );
};

export default CardHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptanceText: {
    marginLeft: 'auto',
    textTransform: 'capitalize',
  },
});
