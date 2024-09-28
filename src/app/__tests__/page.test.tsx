import React from 'react'
import { render, screen } from '@testing-library/react'
import Component from '@/app/page'
import { translations } from '@/lib/translations'
import { fireEvent } from '@testing-library/react'


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
  it('renderiza o componente da página inicial', () => {
    const { container } = render(<Component />)
    expect(screen.getByText('Lov', { exact: false, selector: 'span' })).toBeInTheDocument()
    expect(screen.getByText('you', { selector: 'span' })).toBeInTheDocument()
    expect(screen.getByTestId('seo-component')).toBeInTheDocument()
    expect(screen.getByText('🇺🇸 English')).toBeInTheDocument()
    expect(screen.getByText('🇧🇷 Português')).toBeInTheDocument()
    
    // Verifica se há algum elemento com a classe 'space-y-4', que é a classe do formulário
    expect(container.querySelector('.space-y-4')).toBeInTheDocument()
  })

  it('renderiza os botões de plano', () => {
    render(<Component />)
    expect(screen.getByText(/1 year, 3 photos & no song/)).toBeInTheDocument()
    expect(screen.getByText(/Forever, 7 photos & with song/)).toBeInTheDocument()
  })

  it('renderiza o botão de criar site', () => {
    render(<Component />)
    expect(screen.getByText(t.createSite)).toBeInTheDocument()
  })
  it('alterna entre inglês e português', () => {
    render(<Component />)
    const portugueseButton = screen.getByText('🇧🇷 Português')
    fireEvent.click(portugueseButton)
    expect(screen.getByText(translations['pt'].title)).toBeInTheDocument()
  })

  it('alterna entre planos básico e premium', () => {
    render(<Component />)
    const premiumButton = screen.getByText(/Forever, 7 photos & with song/)
    fireEvent.click(premiumButton)
    expect(screen.getByLabelText(/YouTube Music/)).toBeInTheDocument()
  })
})