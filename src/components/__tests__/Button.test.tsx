import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from "@/components/ui/button"

describe('Button', () => {
  it('renderiza corretamente', () => {
    render(<Button>Clique aqui</Button>)
    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
  })

  it('aplica classes personalizadas', () => {
    render(<Button className="custom-class">Botão</Button>)
    expect(screen.getByText('Botão')).toHaveClass('custom-class')
  })

  it('chama a função onClick quando clicado', () => {
    const mockOnClick = jest.fn()
    render(<Button onClick={mockOnClick}>Clique</Button>)
    fireEvent.click(screen.getByText('Clique'))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('renderiza como um link quando asChild é usado com um elemento <a>', () => {
    render(<Button asChild><a href="/test">Link</a></Button>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test')
  })

  it('aplica variante padrão quando nenhuma é especificada', () => {
    render(<Button>Botão Padrão</Button>)
    const button = screen.getByText('Botão Padrão')
    expect(button).toHaveClass('inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2')
  })
  
})