import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input } from '@ui-kitten/components';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import EditableAvatar from '../../components/EditableAvatar';
import ScreenContainer from '../../components/ScreenContainer';
import Spacer from '../../components/Spacer';
import useImagePicker from '../../hooks/useImagePicker';
import useUser from '../../hooks/useUser';
import { MainNavParamList } from '../../navigation/MainNavigator';
import { getUserAvatarUrl } from '../../services/images';

type Props = {
  navigation: StackNavigationProp<MainNavParamList>;
};

const EditProfileScreen: FC<Props> = ({ navigation }: Props) => {
  const { myInfo, updateBio, uploadMyAvatar, reloadEvents, reloadMyInfo } =
    useUser();
  const [bio, setBio] = useState(myInfo?.bio);
  const { pickImage, pickedImageUri } = useImagePicker();
  const hasChange = bio !== myInfo?.bio || pickedImageUri;

  const handleSubmit = async () => {
    if (!bio && !pickedImageUri) {
      return;
    }

    if (bio) {
      await updateBio(bio);
    }
    if (pickedImageUri) {
      await uploadMyAvatar(pickedImageUri);
      reloadMyInfo();
      reloadEvents();
    }
    // Show success
    Toast.show({
      type: 'success',
      text1: 'Profile updated',
      text2: 'Your new profile information has been successfully updated',
      topOffset: 40,
    });
    navigation.popToTop();
  };

  const handleImagePick = async () => await pickImage();

  useEffect(() => {
    getUserAvatarUrl('10');
  });

  return (
    <ScreenContainer headerTitle="Edit Profile" style={styles.container}>
      <EditableAvatar
        style={styles.avatar}
        url={pickedImageUri}
        userId={myInfo?.id}
        onPressEdit={handleImagePick}
      />
      <Spacer />
      <Input
        label="Bio"
        value={bio}
        onChangeText={setBio}
        multiline={true}
        textStyle={{ minHeight: 64 }}
      />
      <Spacer />
      <Button
        style={styles.saveButton}
        onPress={handleSubmit}
        disabled={!hasChange}
      >
        Save
      </Button>
    </ScreenContainer>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
  saveButton: {
    marginTop: 'auto',
  },
  avatar: { height: 100, width: 100 },
});
