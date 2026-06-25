import admin from 'firebase-admin';

if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'placeholder') {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID
  });
} else {
  console.warn('Firebase Admin is NOT initialized properly for token verification. Using mock authentication for development.');
}

export const firebaseAdmin = admin;
