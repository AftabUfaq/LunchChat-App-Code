import React, { FC } from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import Kernel from './Kernel';
import store from './src/store/store';
LogBox.ignoreLogs(['Setting a timer for a long period of time']);
import Constants from 'expo-constants';
const App: FC = () => {
  console.log(Constants.easConfig?.projectId, 'sdsds');

  return (
    <Provider store={store}>
      <Kernel />
    </Provider>
  );
};

export default App;
