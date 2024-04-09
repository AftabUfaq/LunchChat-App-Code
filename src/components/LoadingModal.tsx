import { Card, Modal, Spinner } from '@ui-kitten/components';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../store/reducers';

const LoadingModal: FC = () => {
  const isLoading = useSelector(
    (state: ApplicationState) => state.utilReducer.loading
  );
  return (
    <Modal
      visible={isLoading}
      backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <Card disabled>
        <Spinner size="giant" />
      </Card>
    </Modal>
  );
};

export default LoadingModal;
