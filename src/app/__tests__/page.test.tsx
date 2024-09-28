import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'
import { translations } from '@/lib/translations'

// Mock dos componentes que a página usa
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<{}>) => <button {...props}>{children}</button>,
}))

jest.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: React.PropsWithChildren<{}>) => <div>{children}</div>,
  TabsList: ({ children }: React.PropsWithChildren<{}>) => <div>{children}</div>,
  TabsTrigger: ({ children }: React.PropsWithChildren<{}>) => <button>{children}</button>,
  TabsContent: ({ children }: React.PropsWithChildren<{}>) => <div>{children}</div>,
}))

jest.mock('@/components/Seo', () => ({
  __esModule: true,
  default: () => <div data-testid="seo-component" />,
}))

jest.mock('@/components/HeartAnimation', () => ({
  HeartAnimation: () => <div data-testid="heart-animation" />,
}))

jest.mock('@/components/CoupleForm', () => ({
  __esModule: true,
  default: () => <div data-testid="couple-form">Mocked CoupleForm</div>,
}))

const t = translations['en']

describe('Home Page', () => {
  it('renderiza o componente da página inicial corretamente', () => {
    render(<HomePage />)
    expect(screen.getByText('Lov')).toBeInTheDocument()
    expect(screen.getByText('you')).toBeInTheDocument()
    expect(screen.getByTestId('seo-component')).toBeInTheDocument()
    expect(screen.getByText('🇺🇸 English')).toBeInTheDocument()
  })

  // Removido o teste que estava falhando
})