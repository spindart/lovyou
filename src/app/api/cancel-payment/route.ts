import { NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Suas configurações do Firebase aqui
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