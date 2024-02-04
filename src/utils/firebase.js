// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: 'alpaago-assignmen.firebaseapp.com',
  projectId: 'alpaago-assignmen',
  storageBucket: 'alpaago-assignmen.appspot.com',
  messagingSenderId: '305748782144',
  appId: '1:305748782144:web:ff305b5ebc7bb636c9c3a5',
};
console.log('Firebase API Key: ', process.env.REACT_APP_FIREBASE_KEY);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
