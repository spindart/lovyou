import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export async function POST(req: Request) {
  try {
    const { priceId, siteId, customUrl, email } = await req.json();
    devLog('Recebido priceId:', priceId, 'siteId:', siteId, 'customUrl:', customUrl, 'email:', email);

    if (!priceId || !siteId || !customUrl) {
      devLog('Dados obrigatórios não fornecidos');
      return NextResponse.json({ error: 'Dados obrigatórios não fornecidos' }, { status: 400 });
    }

    const stripe = getStripe();

    devLog('Criando sessão de checkout...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?siteId=${siteId}&customUrl=${customUrl}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      metadata: {
        siteId,
        customUrl,
        email
      }
    });

    // Atualizar o documento do site no Firestore com o e-mail
    await db.collection('sites').doc(customUrl).update({
      email: email
    });

    devLog('Sessão de checkout criada:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    devLog('Erro ao criar sessão de checkout:', err);
    return NextResponse.json({ error: err.message || 'Erro desconhecido' }, { status: 500 });
  }
}