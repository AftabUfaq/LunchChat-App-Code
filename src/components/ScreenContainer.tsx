import { useNavigation } from '@react-navigation/native';
import {
  Divider,
  Icon,
  Layout,
  Spinner,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import React, { FC, ReactElement } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ViewStyle } from 'react-native';

type Props = {
  headerTitle?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  canGoBack?: boolean;
  accessoryRight?: () => ReactElement; // This prop is either a function returning ReactElement or undefined
  style?: ViewStyle;
};

const ScreenContainer: FC<Props> = ({
  headerTitle,
  children,
  isLoading = false,
  canGoBack = true,
  accessoryRight,
  style,
}: Props) => {
  const navigation = useNavigation();

  const renderAccessoryLeft = () => (
    <TopNavigationAction
      icon={(props) => <Icon name="arrow-back-outline" {...props} />}
      onPress={() => navigation.goBack()}
    />
  );

  // Ensures accessoryRight prop matches the expected signature
  const renderAccessoryRight = accessoryRight
    ? () => accessoryRight() // Use accessoryRight if provided
    : undefined; // Explicitly pass undefined if accessoryRight is not provided

  return (
    <Layout style={styles.container}>
      <StatusBar />
      <SafeAreaView />
      <TopNavigation
        title={headerTitle}
        alignment="center"
        accessoryLeft={canGoBack ? renderAccessoryLeft : undefined}
        accessoryRight={renderAccessoryRight} // Updated to use the processed prop
      />
      <Divider />
      {isLoading ? (
        <Layout style={styles.loadingContainer}>
          <Spinner size="giant" />
        </Layout>
      ) : (
        <Layout style={[styles.container, style]}>{children}</Layout>
      )}
    </Layout>
  );
};

export default ScreenContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
