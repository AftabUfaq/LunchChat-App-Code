import { Button, Card, Modal, Text } from '@ui-kitten/components';
import React, { FC } from 'react';
import { View } from 'react-native';
import Spacer from './Spacer';

type Status = 'Confirm' | 'Delete';

type Props = {
  visible: boolean;
  status?: Status;
  title?: string;
  text: string;
  buttonText?: string;
  onDismiss: () => void;
  onPress: () => void;
};

const AlertModal: FC<Props> = ({
  visible,
  status = 'Confirm',
  title = 'Alert',
  text,
  onDismiss,
  onPress,
  buttonText,
}: Props) => {
  const handlePress = async () => {
    await onPress();
    onDismiss();
  };
  return (
    <Modal
      visible={visible}
      backdropStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onBackdropPress={onDismiss}
    >
      <Card
        disabled
        header={(props) => (
          <View {...props}>
            <Text category="h4">{title}</Text>
          </View>
        )}
        footer={(props) => (
          <View {...props}>
            <View style={{ flexDirection: 'row' }}>
              <Button onPress={onDismiss} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Spacer />
              <Button
                onPress={handlePress}
                status={status === 'Confirm' ? 'success' : 'danger'}
                style={{ flex: 1 }}
              >
                {buttonText || status}
              </Button>
            </View>
          </View>
        )}
      >
        <Text>{text}</Text>
      </Card>
    </Modal>
  );
};

export default AlertModal;
