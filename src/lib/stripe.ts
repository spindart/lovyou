import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  : process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY;

export const stripePromise = loadStripe(stripePublishableKey!);