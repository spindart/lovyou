import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: Request) {
  const { siteUrl } = await req.json();

  try {
    await deleteDoc(doc(db, "sites", siteUrl));
    return NextResponse.json({ message: 'Site excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir site:', error);
    return NextResponse.json({ error: 'Erro ao excluir site' }, { status: 500 });
  }
}