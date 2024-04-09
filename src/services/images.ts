// Import Firebase v9+ modular functions
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

// Assuming app is your Firebase app initialization instance
import { app } from './Firebase';

const storage = getStorage(app);

// Helper function to convert URI to Blob
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

// Adjusted compressImage function for expo-image-manipulator
export const compressImage = async (uri: string): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [], // No manipulation actions needed for compression
    { compress: Platform.OS === 'ios' ? 0.1 : 0.7 } // Adjust compression as needed
  );
  return result.uri;
};

// Adjusted uploadImage function for Firebase v9+
// Adjusted uploadImage function for Firebase v9+
export const uploadImage = async (
  uri: string,
  storagePath: string
): Promise<string> => {
  const compressedImageUri = await compressImage(uri);
  const blob = await uriToBlob(compressedImageUri);

  const imageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(imageRef, blob);

  // Assuming blob.close() is not needed or not available, so it's removed
  // If you're using a specific Blob implementation that requires manual cleanup,
  // ensure you're correctly managing it according to that environment's docs.

  return await getDownloadURL(snapshot.ref);
};

// Adjusted uploadUserAvatar function
export const uploadUserAvatar = async (
  uri: string,
  userId: string
): Promise<string> => uploadImage(uri, `avatars/${userId}`);

/**
 * Get downloadable image URL for a user
 * @param userId The user's ID
 */
export const getUserAvatarUrl = async (
  userId: string
): Promise<string | undefined> => {
  try {
    const url = await getDownloadURL(ref(storage, `avatars/${userId}`));
    return url;
  } catch (error) {
    // Handle error or return a default avatar
    //console.error(error);
    return `https://example.com/default-avatar.png`;
  }
};
