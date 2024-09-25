import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import crypto from 'crypto';

// Inicialize o Firebase Admin se ainda não estiver inicializado
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
  }
}

const db = getFirestore();

export async function POST(req: Request) {
  try {
    const siteData = await req.json();
    console.log('Dados recebidos:', siteData);
    
    const customUrl = generateCustomUrl(siteData.coupleNames);
    console.log('Custom URL gerada:', customUrl);
    
    const existingSite = await db.collection('sites').where('customUrl', '==', customUrl).get();
    if (!existingSite.empty) {
      console.log('URL personalizada já existe');
      return NextResponse.json({ error: 'URL personalizada já existe' }, { status: 400 });
    }
    
    // Gerar uniqueHash
    const uniqueHash = crypto.randomBytes(16).toString('hex');
    
    // Adicionar o documento ao Firestore
    const docRef = await db.collection('sites').add({
      ...siteData,
      customUrl,
      uniqueHash,
      createdAt: new Date(),
      paid: false
    });
    console.log('Site criado com sucesso. ID:', docRef.id);

    return NextResponse.json({ siteId: docRef.id, customUrl, uniqueHash });
  } catch (error) {
    console.error('Erro ao criar site:', error);
    return NextResponse.json({ error: 'Erro ao criar site' }, { status: 500 });
  }
}

function generateCustomUrl(coupleNames: string): string {
  return coupleNames
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 50); // Limitar o tamanho da URL
}