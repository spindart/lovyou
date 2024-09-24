import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const stripeSecretKey = process.env.NODE_ENV === 'production'
  ? process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_TEST_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  const body = await req.json();
  const { plan, lang, coupleNames, startDate, startTime, message } = body;

  // Gerar um hash único para o casal
  const uniqueHash = uuidv4();

  // Simplificando a função getPriceId para usar apenas o preço básico em inglês
  const getPriceId = () => process.env.STRIPE_BASIC_PRICE_ID_EN;

  const priceId = getPriceId();

  if (!priceId) {
    return NextResponse.json({ error: 'Preço não configurado' }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      metadata: {
        plan,
        lang,
        coupleNames,
        startDate,
        startTime,
        message,
        uniqueHash,
      },
    });

    return NextResponse.json({ sessionId: session.id, uniqueHash });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao criar sessão de checkout' }, { status: 500 });
  }
}