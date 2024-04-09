import {
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { app } from './Firebase'; // Adjust the import path as needed
import { uploadUserAvatar } from './images'; // Ensure this module is correctly implemented

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

export const signup = async (
  email: string,
  password: string,
  name: string,
  imageUri?: string
): Promise<void> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  // Add the user to the database
  await setDoc(doc(firestore, 'users', user.uid), {
    email,
    name,
  });
  if (imageUri) {
    await uploadUserAvatar(imageUri, user.uid);
  }
};

export const signin = async (
  email: string,
  password: string
): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signout = async (): Promise<void> => {
  await signOut(auth);
};

export const onAuthStateChangedHandler = (
  callback: (user: User | null) => void
): void => {
  onAuthStateChanged(auth, (user) => callback(user));
};

export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email)
    throw new Error('User not authenticated or has no email');

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};
