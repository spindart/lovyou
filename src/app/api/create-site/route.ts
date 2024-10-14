import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import crypto from 'crypto';

const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export async function POST(req: Request) {
  try {
    const siteData = await req.json();
    console.log('Dados recebidos na API:', siteData);
    
    if (!siteData.coupleNames) {
      return NextResponse.json({ error: 'Nome do casal não fornecido' }, { status: 400 });
    }

    const customUrl = generateCustomUrl(siteData.coupleNames);
    devLog('Custom URL gerada:', customUrl);
    
    const uniqueHash = crypto.randomBytes(16).toString('hex');
    
    const docRef = db.collection('sites').doc(customUrl);
    await docRef.set({
      ...siteData,
      customUrl,
      uniqueHash,
      createdAt: new Date(),
      isUnlocked: false // Adicionando o campo isUnlocked como false
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