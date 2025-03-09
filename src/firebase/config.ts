import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBihzJi5jO7f1gFqnE-Cf4o3Sgt-D9_VBk",
    authDomain: "hecm-calendar.firebaseapp.com",
    projectId: "hecm-calendar",
    storageBucket: "hecm-calendar.firebasestorage.app",
    messagingSenderId: "1032007320629",
    appId: "1:1032007320629:web:99c52da6f0c9071b085d7c",
    measurementId: "G-6Z8QX6CKHP"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);