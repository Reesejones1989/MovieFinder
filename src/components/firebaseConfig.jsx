// src/components/firebaseConfig.jsx
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "moviefinder-auth.firebaseapp.com",
  projectId: "moviefinder-auth",
  storageBucket: "moviefinder-auth.firebasestorage.app",
  messagingSenderId: "341293131337",
  appId: "1:341293131337:web:8dd4ef1d8a580c2e4e4198",
  measurementId: "G-1QRC1HPX3Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);

export default app;
