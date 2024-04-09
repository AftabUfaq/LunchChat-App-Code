import { Button, Card, Modal, Text } from '@ui-kitten/components';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { hideError } from '../store/actions';
import { ApplicationState } from '../store/reducers';
import Spacer from './Spacer';

const ErrorModal: FC = () => {
  const error = useSelector(
    (state: ApplicationState) => state.utilReducer.error
  );
  const dispatch = useDispatch();

  const handleDismissError = () => {
    dispatch(hideError());
  };

  return (
    <Modal
      visible={!!error}
      backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <Card
        disabled
        style={styles.cardContainer}
        footer={(props) => (
          <View {...props}>
            <Button onPress={handleDismissError}>close</Button>
          </View>
        )}
      >
        <Text category="s1" status="danger">
          Error
        </Text>
        <Spacer />
        <Text>{error}</Text>
        <Spacer />
      </Card>
    </Modal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  cardContainer: {
    width: 200,
  },
});
