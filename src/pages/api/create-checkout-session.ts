import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_KEY! : process.env.STRIPE_TEST_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { priceId, siteId, customUrl, email } = req.body;
      console.log('Dados recebidos para criar sessão:', { priceId, siteId, customUrl, email });
      console.log('Modo Stripe:', process.env.NODE_ENV === 'production' ? 'Produção' : 'Teste');

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
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        customer_email: email,
        metadata: {
          siteId,
          customUrl,
        },
      });

      console.log('Sessão criada:', session.id);
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      res.status(500).json({ error: 'Erro ao criar sessão de checkout', details: error });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}