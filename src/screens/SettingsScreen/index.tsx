import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Divider, Icon, ListItem } from '@ui-kitten/components';
import React, { FC } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import useLoading from '../../hooks/useLoading';
import { MainNavParamList } from '../../navigation/MainNavigator';
import { signout } from '../../services/auth';

type Props = {
  navigation: StackNavigationProp<MainNavParamList>;
};

const SettingsScreen: FC<Props> = ({ navigation }: Props) => {
  const { asyncLoading } = useLoading();
  const handleLogout = () => {
    asyncLoading(signout);
  };

  const handleEditProfilePress = () => {
    navigation.navigate('EditProfile');
  };

  const handleBlockedPress = () => {
    navigation.navigate('BlockUser');
  };

  const handleChangePasswordPress = () => {
    navigation.navigate('ChangePassword');
  };

  return (
    <ScreenContainer headerTitle="Settings">
      <ScrollView style={styles.container}>
        <ListItem
          title="Edit Profile"
          accessoryRight={(props) => (
            <Icon name="arrow-ios-forward-outline" {...props} />
          )}
          onPress={handleEditProfilePress}
          style={styles.listItem}
          accessoryLeft={(props) => <Icon name="edit-outline" {...props} />}
        />
        <Divider />
        <ListItem
          title="Change Password"
          accessoryRight={(props) => (
            <Icon name="arrow-ios-forward-outline" {...props} />
          )}
          accessoryLeft={(props) => <Icon name="lock-outline" {...props} />}
          onPress={handleChangePasswordPress}
          style={styles.listItem}
        />
        <Divider />
        <ListItem
          title="Blocked users"
          accessoryRight={(props) => (
            <Icon name="arrow-ios-forward-outline" {...props} />
          )}
          accessoryLeft={(props) => (
            <Icon name="person-delete-outline" {...props} />
          )}
          onPress={handleBlockedPress}
          style={styles.listItem}
        />
        <Divider />
      </ScrollView>

      <Button onPress={handleLogout} style={styles.logoutButton}>
        Logout
      </Button>
      <SafeAreaView />
    </ScreenContainer>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  logoutButton: {
    marginTop: 'auto',
    margin: 10,
  },
  listItem: {
    marginVertical: 10,
  },
});
