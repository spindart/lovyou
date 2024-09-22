import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

// Inicialize o Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

function validateData(data: any) {
  if (!data.coupleNames || !data.startDate || !data.message) {
    throw new Error('Dados inválidos');
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    validateData(data);
    
    // Gere uma URL personalizada baseada no nome do casal
    const customUrl = generateCustomUrl(data.coupleNames);
    
    // Upload das imagens para o Firebase Storage
    const imageUrls = await uploadImages(customUrl, data.imageUrls);
    
    // Prepare os dados para salvar
    const siteData = {
      ...data,
      imageUrls,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    // Salve os dados no Firestore
    await saveSiteData(customUrl, siteData);
    
    // Retorne o URL do novo site
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.json({ url: `${baseUrl}/${customUrl}` });
  } catch (error) {
    console.error('Erro ao criar o site:', error);
    return NextResponse.json({ error: 'Falha ao criar o site' }, { status: 500 });
  }
}

function generateCustomUrl(coupleNames: string): string {
  return coupleNames
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function uploadImages(customUrl: string, imageUrls: string[]): Promise<string[]> {
  const uploadedUrls = [];
  
  for (let i = 0; i < imageUrls.length; i++) {
    const imageData = imageUrls[i].replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(imageData, 'base64');
    const filename = `${customUrl}/image-${i + 1}.jpg`;
    
    const file = bucket.file(filename);
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
    });
    
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Define uma data de expiração distante
    });
    
    uploadedUrls.push(url);
  }
  
  return uploadedUrls;
}

async function saveSiteData(customUrl: string, data: any) {
  await db.collection('sites').doc(customUrl).set(data);
}

function extractYoutubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}