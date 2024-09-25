import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();
    console.log('Recebido priceId:', priceId);

    if (!priceId) {
      console.error('priceId não fornecido');
      return NextResponse.json({ error: 'priceId é obrigatório' }, { status: 400 });
    }

    const stripe = getStripe();

    console.log('Criando sessão de checkout...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    console.log('Sessão de checkout criada:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Erro ao criar sessão de checkout:', err);
    return NextResponse.json({ error: err.message || 'Erro desconhecido' }, { status: 500 });
  }
}