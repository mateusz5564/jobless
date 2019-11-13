import firebase from 'firebase'
import firestore from 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyAz26QhtW30pEu3Fv4i7uUb03HKHw7E-Xo",
  authDomain: "jobless-3f4a0.firebaseapp.com",
  databaseURL: "https://jobless-3f4a0.firebaseio.com",
  projectId: "jobless-3f4a0",
  storageBucket: "jobless-3f4a0.appspot.com",
  messagingSenderId: "108606365598",
  appId: "1:108606365598:web:9621e35e32bebe8887408f"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore()