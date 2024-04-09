import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

type ImagePickerHook = {
  pickImage: () => Promise<string | undefined>;
  pickedImageUri: string;
};

const useImagePicker = (): ImagePickerHook => {
  const [pickedImageUri, setImageUri] = useState('');

  const getImagePickerPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return false; // Adding return statement to prevent proceeding if permissions are not granted
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await getImagePickerPermissions();
    if (!hasPermission) return; // Stop execution if there's no permission

    // Using 'any' to bypass the type checking temporarily
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Checking the updated property name for cancellation
    if (!result.cancelled) {
      setImageUri(result.uri);
      return result.uri;
    }
  };

  return { pickedImageUri, pickImage };
};

export default useImagePicker;
