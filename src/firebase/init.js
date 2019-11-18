import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC3h5WLuxYTanRcoTBrFki75kK8J-CMaM8",
  authDomain: "jobless-f4e79.firebaseapp.com",
  databaseURL: "https://jobless-f4e79.firebaseio.com",
  projectId: "jobless-f4e79",
  storageBucket: "jobless-f4e79.appspot.com",
  messagingSenderId: "995600503486",
  appId: "1:995600503486:web:20833e510bc35b165544ef"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)


export default firebaseApp.firestore()