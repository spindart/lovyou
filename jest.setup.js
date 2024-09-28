import '@testing-library/jest-dom'

process.env.NODE_ENV = 'test';
process.env.STRIPE_SECRET_KEY = 'sk_live_test_key';
process.env.STRIPE_TEST_SECRET_KEY = 'sk_test_456';
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_live_test_key';
process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY = 'pk_test_012';