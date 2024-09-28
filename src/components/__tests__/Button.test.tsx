import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from "@/components/ui/button"

describe('Button', () => {
  it('renderiza o botão com o texto correto', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('chama a função onClick quando clicado', async () => {
    const mockOnClick = jest.fn()
    render(<Button onClick={mockOnClick}>Click me</Button>)
    await userEvent.click(screen.getByText('Click me'))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('aplica classes personalizadas', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    expect(screen.getByText('Custom Button')).toHaveClass('custom-class')
  })

  it('renderiza como um link quando asChild é usado com um elemento <a>', () => {
    render(<Button asChild><a href="/test">Link Button</a></Button>)
    const linkButton = screen.getByText('Link Button')
    expect(linkButton.tagName).toBe('A')
    expect(linkButton).toHaveAttribute('href', '/test')
  })

  it('aplica variantes corretamente', () => {
    render(<Button variant="outline">Outline Button</Button>)
    expect(screen.getByText('Outline Button')).toHaveClass('border', 'border-input')
  })

  it('desabilita o botão corretamente', () => {
    render(<Button disabled>Disabled Button</Button>)
    expect(screen.getByText('Disabled Button')).toBeDisabled()
  })
})