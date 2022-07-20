import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAwlFScBu7V0t65fZCRSj8DL5tsXtwVrKA",
  authDomain: "glass-a6c85.firebaseapp.com",
  databaseURL: "https://glass-a6c85-default-rtdb.firebaseio.com",
  projectId: "glass-a6c85",
  storageBucket: "glass-a6c85.appspot.com",
  messagingSenderId: "17149055405",
  appId: "1:17149055405:web:7eeb78b68da1f293005124",
  measurementId: "G-LYPPT3D25G"
};
const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);