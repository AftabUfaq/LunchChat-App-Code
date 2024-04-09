import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC27UFELuOsLqZO2ULoc4p8ir_MfOp-4sQ',
  authDomain: 'lunchapp11.firebaseapp.com',
  databaseURL: 'https://lunchapp11-default-rtdb.firebaseio.com',
  projectId: 'lunchapp11',
  storageBucket: 'lunchapp11.appspot.com',
  messagingSenderId: '457519122897',
  appId: '1:457519122897:web:0feaac75deb404f68cf8f0',
  measurementId: 'G-MNHDTC1S1J',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
const functions = getFunctions(app, 'europe-west2');
const storage = getStorage(app);

export { app, auth, firestore, functions, storage };
