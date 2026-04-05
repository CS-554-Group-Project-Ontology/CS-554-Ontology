import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import dotenv from 'dotenv';
dotenv.config()

const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if(!privateKey){
  throw new Error("Missing Keys for Firebase Connection");
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}

export async function verifyFirebaseToken(token: string) {
    return await getAuth().verifyIdToken(token);
}