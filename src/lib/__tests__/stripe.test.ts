import { createCheckoutSession } from '../stripe'

jest.mock('../stripe', () => ({
  createCheckoutSession: jest.fn()
}))

describe('Stripe functions', () => {
  it('cria uma sessão de checkout', async () => {
    (createCheckoutSession as jest.Mock).mockResolvedValue({ id: 'session_123' })

    const result = await createCheckoutSession({
      priceId: 'price_123',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel'
    })

    expect(result).toEqual({ id: 'session_123' })
    expect(createCheckoutSession).toHaveBeenCalledWith({
      priceId: 'price_123',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel'
    })
  })

  it('lida com erros ao criar a sessão de checkout', async () => {
    (createCheckoutSession as jest.Mock).mockRejectedValue(new Error('Erro de teste'))

    await expect(createCheckoutSession({
      priceId: 'price_123',
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel'
    })).rejects.toThrow('Erro de teste')
  })
})