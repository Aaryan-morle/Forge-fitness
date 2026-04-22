import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfigProps from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigProps.apiKey,
  authDomain: firebaseConfigProps.authDomain,
  projectId: firebaseConfigProps.projectId,
  storageBucket: firebaseConfigProps.storageBucket,
  messagingSenderId: firebaseConfigProps.messagingSenderId,
  appId: firebaseConfigProps.appId,
  measurementId: firebaseConfigProps.measurementId
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfigProps.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();
