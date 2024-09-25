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
    
    if (!siteData.coupleNames) {
      return NextResponse.json({ error: 'Nome do casal não fornecido' }, { status: 400 });
    }

    const customUrl = generateCustomUrl(siteData.coupleNames);
    console.log('Custom URL gerada:', customUrl);
    
    // Gerar uniqueHash
    const uniqueHash = crypto.randomBytes(16).toString('hex');
    
    // Adicionar o documento ao Firestore usando o customUrl como ID do documento
    const docRef = db.collection('sites').doc(customUrl);
    await docRef.set({
      ...siteData,
      customUrl,
      uniqueHash,
      createdAt: new Date(),
      paid: false
    });
    console.log('Site criado com sucesso. ID:', customUrl);

    return NextResponse.json({ siteId: customUrl, customUrl, uniqueHash });
  } catch (error) {
    console.error('Erro ao criar site:', error);
    return NextResponse.json({ error: 'Erro ao criar site' }, { status: 500 });
  }
}

function generateCustomUrl(coupleNames: string): string {
  return coupleNames
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 50); // Limitar o tamanho da URL
}