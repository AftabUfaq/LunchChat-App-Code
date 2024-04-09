import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  Divider,
  Icon,
  Input,
  Text,
  useTheme,
} from '@ui-kitten/components';
import React, { FC, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageOverlay from '../components/ImageOverlay';
import useLoading from '../hooks/useLoading';
import { AuthNavParamList } from '../navigation/AuthNavigator';
import { signin } from '../services/auth';
import { validateEmail } from '../utils/inputValidation';

type Props = {
  navigation: StackNavigationProp<AuthNavParamList, 'Signin'>;
};

const SigninScreen: FC<Props> = ({ navigation }: Props) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { asyncLoading } = useLoading();
  const saveDisable = password.length === 0 || !validateEmail(email);

  const onSignInButtonPress = (): void => {
    asyncLoading(async () => signin(email, password));
  };

  const onSignUpButtonPress = (): void => {
    navigation && navigation.navigate('Signup');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onForgotPasswordButtonPress = (): void => {
    //forgot password recovery process
    // navigation && navigation.navigate('ForgotPassword');
  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <ImageOverlay
      style={styles.container}
      resizeMode="cover"
      source={require('../assets/images/eating-together.jpg')}
    >
      <View style={styles.headerContainer}>
        <StatusBar barStyle="light-content" />
        <Text category="h1" status="control">
          Lunch Chat
        </Text>
        <Text style={styles.signInLabel} category="s1" status="control">
          Sign in to your account
        </Text>
      </View>
      <View style={styles.formContainer}>
        <Input
          status="control"
          placeholder="Email"
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
        />
        {/* <View style={styles.forgotPasswordContainer}>
          <Button
            style={styles.forgotPasswordButton}
            appearance="ghost"
            status="control"
            onPress={onForgotPasswordButtonPress}>
            Forgot your password?
          </Button>
        </View> */}
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
        onPress={onSignInButtonPress}
        disabled={saveDisable}
      >
        SIGN IN
      </Button>
      <Divider style={{ marginHorizontal: 60, marginVertical: 20 }} />
      {/* <View style={styles.socialAuthContainer}>
        <Text style={styles.socialAuthHintText} status="control">
          OR SIGN IN WITH
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
        onPress={onSignUpButtonPress}
      >
        {"Don't have an account? Sign Up"}
      </Button>
    </ImageOverlay>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
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
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  passwordInput: {
    marginTop: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
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
});
