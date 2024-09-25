import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    const stripeSecretKey = process.env.NODE_ENV === 'production'
      ? process.env.STRIPE_SECRET_KEY
      : process.env.STRIPE_TEST_SECRET_KEY;

    if (!stripeSecretKey) {
      throw new Error('A chave secreta do Stripe não está definida nas variáveis de ambiente.');
    }

    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    });
  }
  return stripeInstance;
};

const stripePublishableKey = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  : process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY;

export const stripePromise = loadStripe(stripePublishableKey!);

export const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirm-payment`;