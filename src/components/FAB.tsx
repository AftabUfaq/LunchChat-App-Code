import { Button, Icon } from '@ui-kitten/components';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  onPress?: () => void;
};

const FAB: FC<Props> = ({ onPress }: Props) => {
  return (
    <Button
      style={styles.button}
      accessoryRight={(props) => <Icon name="plus-outline" {...props} />}
      onPress={onPress}
    />
  );
};

export default FAB;

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});
