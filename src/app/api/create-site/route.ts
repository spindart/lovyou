import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Inicialize o Firebase Admin se ainda não estiver inicializado
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = getFirestore();
const storage = getStorage();

export async function POST(req: Request) {
  try {
    const { coupleNames, startDate, startTime, message, lang, plan, email, images } = await req.json();

    // Gerar um slug único para o site
    const slug = await generateUniqueSlug(coupleNames);

    // Processar e salvar as imagens
    const imageUrls = await Promise.all(images.map(async (imageDataUrl: string, index: number) => {
      const buffer = Buffer.from(imageDataUrl.split(',')[1], 'base64');
      const imagePath = `sites/${slug}/image-${index + 1}.jpg`;
      const file = storage.bucket().file(imagePath);
      
      await file.save(buffer, {
        metadata: {
          contentType: 'image/jpeg',
        },
      });

      // Gerar URL assinada com longa expiração
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: '3000-01-01', // Data de expiração bem no futuro
      });

      return signedUrl;
    }));

    // Criar o documento do site no Firestore
    const siteDoc = {
      coupleNames,
      startDate,
      startTime,
      message,
      lang,
      plan,
      email,
      imageUrls,
      isUnlocked: false,
      uniqueHash: generateUniqueHash(),
      createdAt: new Date(),
    };

    await db.collection('sites').doc(slug).set(siteDoc);

    return NextResponse.json({ 
      success: true, 
      siteUrl: `https://lovyou.xyz/${slug}`,
      uniqueHash: siteDoc.uniqueHash
    });
  } catch (error) {
    console.error('Erro ao criar site:', error);
    return NextResponse.json({ error: 'Falha ao criar site' }, { status: 500 });
  }
}

async function generateUniqueSlug(coupleNames: string): Promise<string> {
  let baseSlug = coupleNames.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const docRef = db.collection('sites').doc(slug);
    const doc = await docRef.get();

    if (!doc.exists) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

function generateUniqueHash(): string {
  return Math.random().toString(36).substring(2, 15);
}