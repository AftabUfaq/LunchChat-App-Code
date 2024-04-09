import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Icon, Input } from '@ui-kitten/components';
import React, { FC, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import ScreenContainer from '../../components/ScreenContainer';
import Spacer from '../../components/Spacer';
import useLoading from '../../hooks/useLoading';
import { MainNavParamList } from '../../navigation/MainNavigator';
import { updateUserPassword } from '../../services/auth';

type Props = {
  navigation: StackNavigationProp<MainNavParamList>;
  route: RouteProp<MainNavParamList, 'ChangePassword'>;
};

const ChangePasswordScreen: FC<Props> = ({ navigation }: Props) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const { asyncLoading } = useLoading();
  const isPasswordMatch =
    confirmPassword.length === 0 || newPassword === confirmPassword;
  const saveDisable =
    !isPasswordMatch ||
    newPassword.length < 6 ||
    confirmPassword.length < 6 ||
    oldPassword.length === 0;

  const handlePasswordVisiblePress = () => {
    setNewPasswordVisible((state) => !state);
  };

  const handleSave = async () => {
    await asyncLoading(async () => {
      await updateUserPassword(oldPassword, newPassword);
      navigation.popToTop();
      Toast.show({
        type: 'success',
        text1: 'Password Updated',
        text2: 'Your new password has been set successfully',
        topOffset: 40,
      });
    });
  };

  return (
    <ScreenContainer headerTitle="Change Password">
      <View style={styles.container}>
        <Input
          label="Old Password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <Spacer />
        <Input
          label="New Password"
          secureTextEntry={!newPasswordVisible}
          value={newPassword}
          onChangeText={setNewPassword}
          accessoryRight={(style) => (
            <TouchableOpacity onPress={handlePasswordVisiblePress}>
              <Icon {...style} name={newPasswordVisible ? 'eye' : 'eye-off'} />
            </TouchableOpacity>
          )}
          caption="Minimum 6 characters"
        />
        <Spacer />
        <Input
          label="Confirm Password"
          secureTextEntry={!newPasswordVisible}
          accessoryRight={(style) => (
            <TouchableOpacity onPress={handlePasswordVisiblePress}>
              <Icon {...style} name={newPasswordVisible ? 'eye' : 'eye-off'} />
            </TouchableOpacity>
          )}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          caption={!isPasswordMatch ? "Passwords don't match" : undefined}
          status={!isPasswordMatch ? 'danger' : undefined}
        />
        <Spacer margin={15} />
        <Button disabled={saveDisable} onPress={handleSave}>
          Save
        </Button>
      </View>
    </ScreenContainer>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
