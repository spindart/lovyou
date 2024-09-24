import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const stripeSecretKey = process.env.NODE_ENV === 'production'
  ? process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_TEST_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey!, {
  apiVersion: '2024-06-20',
});

// Configuração do Firebase
const firebaseConfig = {
  // Suas configurações do Firebase aqui
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID não fornecido' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const siteData = session.metadata;
      if (siteData && siteData.coupleNames && siteData.uniqueHash) {
        const siteUrl = `https://lovyou.xyz/${siteData.coupleNames.toLowerCase().replace(' ', '-')}`;
        
        // Salvar no Firebase
        await setDoc(doc(db, "couples", siteData.uniqueHash), {
          coupleNames: siteData.coupleNames,
          startDate: siteData.startDate,
          startTime: siteData.startTime,
          message: siteData.message,
          lang: siteData.lang,
          plan: siteData.plan,
          siteUrl: siteUrl,
          createdAt: new Date().toISOString()
        });

        return NextResponse.json({ url: siteUrl });
      } else {
        return NextResponse.json({ error: 'Dados do site não encontrados' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Pagamento não confirmado' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 });
  }
}