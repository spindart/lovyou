import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      pathname: '/',
    }
  },
}))

describe('Header', () => {
  it('renderiza o logo', () => {
    render(<Header />)
    // Ajuste este teste para corresponder ao conteúdo real do seu Header
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renderiza links de navegação', () => {
    render(<Header />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })
})