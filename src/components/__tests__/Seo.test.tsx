import React from 'react'
import { render } from '@testing-library/react'
import Seo from '@/components/Seo'

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

describe('Seo', () => {
  it('renderiza com as props corretas', () => {
    const { container } = render(<Seo title="Test Title" description="Test Description" />)
    expect(container.querySelector('title')?.textContent).toBe('Test Title')
    expect(container.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Test Description')
  })
})