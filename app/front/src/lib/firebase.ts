import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDUsjdnS8TFSqKa1Y8YXnExlLfGtYKKXpc",
  authDomain: "lucasandrade-5246f.firebaseapp.com",
  projectId: "lucasandrade-5246f",
  storageBucket: "lucasandrade-5246f.firebasestorage.app",
  messagingSenderId: "738775959240",
  appId: "1:738775959240:web:f30fbd874a0f78335c07fd",
};

const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app, "us-central1");
export const db = getFirestore(app);

// if (import.meta.env.MODE === "development") {
//   connectFunctionsEmulator(functions, "localhost", 5001);
// }
