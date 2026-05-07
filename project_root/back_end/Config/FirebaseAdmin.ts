import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { GraphQLError } from "graphql";
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

export async function requireAuth(context: { token: string }) {
  if (!context.token) {
    throw new GraphQLError('Unauthorized', {
      extensions: { code: 'INVALID_ACCESS' },
    });
  }
  try {
    return await getAuth().verifyIdToken(context.token);
  } catch {
    throw new GraphQLError('Unauthorized', {
      extensions: { code: 'INVALID_ACCESS' },
    });
  }
}
