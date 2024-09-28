import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    const stripeSecretKey = process.env.NODE_ENV === 'production'
      ? process.env.STRIPE_SECRET_KEY ?? ''
      : process.env.STRIPE_TEST_SECRET_KEY ?? 'test_secret_key';

    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    });
  }
  return stripeInstance;
};

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

export const stripePromise = typeof window !== 'undefined' ? loadStripe(stripePublishableKey) : null;

export const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/confirm-payment`;

// A função createCheckoutSession foi removida daqui

export async function createCheckoutSession(priceId: string, siteId: string, customUrl: string, email: string) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, siteId, customUrl, email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro ao criar a sessão de checkout: ${JSON.stringify(errorData)}`);
    }

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Erro ao criar a sessão de checkout:', error);
    throw error;
  }
}

export async function redirectToCheckout(sessionId: string) {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe não inicializado');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Erro ao redirecionar para o checkout:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao redirecionar para o checkout:', error);
    throw error;
  }
}