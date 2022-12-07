// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqe_rzGPRn1jZ9V_8g3QTUahgnbhhXbx0",
  authDomain: "enotourism-415f3.firebaseapp.com",
  projectId: "enotourism-415f3",
  storageBucket: "enotourism-415f3.appspot.com",
  messagingSenderId: "469395794929",
  appId: "1:469395794929:web:701b7997d39ccfdd3df250"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
