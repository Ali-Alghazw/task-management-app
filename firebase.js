import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDT0zbYc9yT_80O6ph-3VA-0pmpC-hPsVI',
  authDomain: 'taskemanagerapp.firebaseapp.com',
  projectId: 'taskemanagerapp',
  storageBucket: 'taskemanagerapp.firebasestorage.app',
  messagingSenderId: '491015667093',
  appId: '1:491015667093:web:13b45b0e262b439b98ca9c',
  measurementId: 'G-ZPTTT90K2Z',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
