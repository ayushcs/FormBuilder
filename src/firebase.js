import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore, query, getDocs, where, collection, doc, updateDoc, getDoc, addDoc} from 'firebase/firestore'

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
})

const connect = getFirestore();
const db = collection(connect, 'forms');

export async function saveData(details) {
  return addDoc(db, details);
}


export async function updateFormResponse(fid, details) {
  const docRef = doc(connect, "forms", fid);
  return await updateDoc(docRef, details);
}

export async function retriveForm(fid) {
  const docRef = doc(connect, "forms", fid);
  return await getDoc(docRef);
}

export async function getListing(uid) {
  const queries = query(db, where("ouid", "==", uid));
  return await getDocs(queries);
}


export const auth = getAuth(app);
export default app
