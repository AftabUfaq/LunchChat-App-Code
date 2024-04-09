import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  DocumentSnapshot,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './Firebase'; // Adjust according to your Firebase config initialization
import { PartialUserModel, UserModel } from '../store/types';

const auth = getAuth(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);

export const convertPartialUser = (
  partialUserDoc: DocumentSnapshot
): PartialUserModel | undefined => {
  const userData = partialUserDoc.data();
  if (!userData) return undefined; // Return undefined if userData is not found

  // Ensure 'name' is a property of userData before attempting to access it
  if ('name' in userData) {
    return {
      id: partialUserDoc.id,
      name: userData.name,
    };
  }
  return undefined;
};

export const getMyInfo = async (): Promise<UserModel | undefined> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const userDocRef = doc(firestore, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) throw new Error('User document does not exist');
  return { id: user.uid, ...userDocSnap.data() } as UserModel;
};

export const getUserInfo = async (
  userId: string
): Promise<UserModel | undefined> => {
  const userDocRef = doc(firestore, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) throw new Error('User document does not exist');
  return { id: userId, ...userDocSnap.data() } as UserModel;
};

export const postUserBio = async (bio: string): Promise<void> => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  const userId = auth.currentUser.uid;
  const userDocRef = doc(firestore, 'users', userId);
  await updateDoc(userDocRef, { bio });
};

export const postBlockUser = async (userId: string): Promise<void> => {
  const blockUserFunc = httpsCallable(functions, 'blockUser');
  await blockUserFunc({ userId });
};

export const postUnblockUser = async (userId: string): Promise<void> => {
  const unblockUserFunc = httpsCallable(functions, 'unblockUser');
  await unblockUserFunc({ userId });
};

export const getBlockers = async (): Promise<PartialUserModel[]> => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  const userId = auth.currentUser.uid;
  const blockersColRef = collection(firestore, 'users', userId, 'blockers');
  const blockersSnap = await getDocs(blockersColRef);
  const blockers = blockersSnap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as PartialUserModel[];
  return blockers;
};

export const getBlockees = async (): Promise<PartialUserModel[]> => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  const userId = auth.currentUser.uid;
  const blockeesColRef = collection(firestore, 'users', userId, 'blockees');
  const blockeesSnap = await getDocs(blockeesColRef);
  const blockees = blockeesSnap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as PartialUserModel[];
  return blockees;
};
