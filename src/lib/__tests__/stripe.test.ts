import * as stripeModule from '../stripe';
import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

jest.mock('stripe');
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    redirectToCheckout: jest.fn(() => Promise.resolve({ error: null }))
  }))
}));

jest.mock('../stripe', () => {
  const originalModule = jest.requireActual('../stripe');
  return {
    ...originalModule,
    stripePromise: Promise.resolve({
      redirectToCheckout: jest.fn(() => Promise.resolve({ error: null }))
    })
  };
});

global.fetch = jest.fn();

describe('Stripe functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    process.env.STRIPE_SECRET_KEY = 'test_secret_key';
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'test_publishable_key';
  });

  it('should initialize Stripe instance', () => {
    const stripe = stripeModule.getStripe();
    expect(stripe).toBeInstanceOf(Stripe);
    expect(Stripe).toHaveBeenCalledWith('test_secret_key', {
      apiVersion: '2024-06-20',
    });
  });

  it('should export stripePromise', () => {
    expect(stripeModule.stripePromise).toBeDefined();
    expect(loadStripe).toHaveBeenCalledWith('test_publishable_key');
  });

  it('should export webhookUrl', () => {
    expect(stripeModule.webhookUrl).toBe('/api/confirm-payment');
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sessionId: 'test_session_id' }),
      });

      const sessionId = await stripeModule.createCheckoutSession('price_123', 'site_123', 'custom-url', 'test@example.com');
      expect(sessionId).toBe('test_session_id');
      expect(global.fetch).toHaveBeenCalledWith('/api/create-checkout-session', expect.any(Object));
    });

    it('should throw an error if the API call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'API error' }),
      });

      await expect(stripeModule.createCheckoutSession('price_123', 'site_123', 'custom-url', 'test@example.com'))
        .rejects.toThrow('Erro ao criar a sessão de checkout: {"error":"API error"}');

      expect(console.error).toHaveBeenCalledWith('Erro ao criar a sessão de checkout:', expect.any(Error));
    });
  });

  describe('redirectToCheckout', () => {
    it('should redirect to checkout', async () => {
      await expect(stripeModule.redirectToCheckout('test_session_id')).resolves.not.toThrow();
    });

    it('should throw an error if redirectToCheckout fails', async () => {
      const mockRedirectToCheckout = jest.fn(() => Promise.reject(new Error('Erro ao redirecionar para o checkout')));
      (stripeModule.stripePromise as any) = Promise.resolve({
        redirectToCheckout: mockRedirectToCheckout
      });

      await expect(stripeModule.redirectToCheckout('test_session_id'))
        .rejects.toThrow('Erro ao redirecionar para o checkout');
      expect(mockRedirectToCheckout).toHaveBeenCalledWith({ sessionId: 'test_session_id' });
    });
  });
});