import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  Divider,
  Icon,
  Input,
  useStyleSheet,
  useTheme,
} from '@ui-kitten/components';
import React, { FC, useState } from 'react';
import { ImageStyle, StatusBar, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import EditableAvatar from '../components/EditableAvatar';
import ImageOverlay from '../components/ImageOverlay';
import useImagePicker from '../hooks/useImagePicker';
import useLoading from '../hooks/useLoading';
import { AuthNavParamList } from '../navigation/AuthNavigator';
import { signup } from '../services/auth';
import { validateEmail } from '../utils/inputValidation';

type Props = {
  navigation: StackNavigationProp<AuthNavParamList, 'Signin'>;
};

const SignupScreen: FC<Props> = ({ navigation }: Props) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { pickImage, pickedImageUri } = useImagePicker();

  const { asyncLoading } = useLoading();
  const isPasswordMatch =
    passwordConfirm.length === 0 || password === passwordConfirm;
  const saveDisable =
    !isPasswordMatch ||
    password.length < 6 ||
    passwordConfirm.length < 6 ||
    !validateEmail(email) ||
    name.length === 0;

  const styles = useStyleSheet(themedStyles);

  const onSignInButtonPress = (): void => {
    navigation && navigation.goBack();
  };

  const onSignUpButtonPress = (): void => {
    asyncLoading(async () => {
      if (passwordConfirm !== password) {
        throw new Error("Passwords don't match");
      }
      await signup(email, password, name, pickedImageUri);
    });
  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePickImage = () => {
    pickImage();
  };

  return (
    <ImageOverlay
      style={styles.container as any}
      source={require('../assets/images/eating-together.jpg')}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <EditableAvatar
          url={pickedImageUri}
          onPressEdit={handlePickImage}
          style={styles.profileAvatar as ImageStyle}
        />
      </View>
      <View style={styles.formContainer}>
        <Input
          status="control"
          style={styles.inputField}
          placeholder="Name"
          // accessoryRight={(style) => <Icon {...style} name="person" />}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <Input
          status="control"
          placeholder="Email"
          style={styles.inputField}
          // accessoryRight={(style) => <Icon {...style} name="email" />}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <Input
          style={styles.passwordInput}
          status="control"
          placeholder="Password"
          accessoryRight={(style) => (
            <TouchableOpacity onPress={onPasswordIconPress}>
              <Icon {...style} name={passwordVisible ? 'eye' : 'eye-off'} />
            </TouchableOpacity>
          )}
          value={password}
          secureTextEntry={!passwordVisible}
          onChangeText={setPassword}
          caption="Minimum 6 characters"
        />
        <Input
          style={styles.passwordInput}
          placeholder="Confirm Password"
          accessoryRight={(style) => (
            <TouchableOpacity onPress={onPasswordIconPress}>
              <Icon {...style} name={passwordVisible ? 'eye' : 'eye-off'} />
            </TouchableOpacity>
          )}
          value={passwordConfirm}
          secureTextEntry={!passwordVisible}
          onChangeText={setPasswordConfirm}
          caption={!isPasswordMatch ? "Passwords don't match" : undefined}
          status={!isPasswordMatch ? 'danger' : 'control'}
        />
      </View>

      <Button
        style={[
          styles.signInButton,
          saveDisable && {
            backgroundColor: theme['color-basic-100'],
            opacity: 0.7,
          },
        ]}
        status="control"
        size="giant"
        disabled={saveDisable}
        onPress={onSignUpButtonPress}
      >
        SIGN UP
      </Button>
      <Divider style={{ marginHorizontal: 60, marginVertical: 20 }} />
      {/* <View style={styles.socialAuthContainer}>
        <Text style={styles.socialAuthHintText} status="control">
          OR SIGN UP WITH
        </Text>
        <View style={styles.socialAuthButtonsContainer}>
          <Button
            appearance="ghost"
            status="control"
            size="giant"
            accessoryLeft={(style) => <Icon {...style} name="google" />}
          />
          <Button
            appearance="ghost"
            status="control"
            size="giant"
            accessoryLeft={(style) => <Icon {...style} name="facebook" />}
          />
          <Button
            appearance="ghost"
            status="control"
            size="giant"
            accessoryLeft={(style) => (
              <Image
                {...style}
                source={require('../assets/images/white-warwick.png')}
              />
            )}
          />
        </View>
      </View> */}
      <Button
        style={styles.signUpButton}
        appearance="ghost"
        status="control"
        onPress={onSignInButtonPress}
      >
        Have an account? Sign In
      </Button>
    </ImageOverlay>
  );
};

export default SignupScreen;

const themedStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  formContainer: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  signInLabel: {
    marginTop: 16,
  },
  signInButton: {
    marginHorizontal: 16,
  },
  warwickSignButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  passwordInput: {
    marginTop: 16,
  },
  inputField: {
    marginTop: 16,
  },
  socialAuthContainer: {},
  socialAuthButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignSelf: 'center',
    //backgroundColor: 'background-basic-color-1',
    //tintColor: 'text-hint-color',
  },
  editAvatarButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
