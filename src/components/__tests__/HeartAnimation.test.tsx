import React from 'react'
import { render } from '@testing-library/react'
import { HeartAnimation } from '../HeartAnimation'

describe('HeartAnimation', () => {
  it('renderiza corretamente', () => {
    const { container } = render(<HeartAnimation />)
    expect(container.firstChild).toHaveClass('heart-animation')
  })

  it('aplica classes adicionais quando fornecidas', () => {
    const { container } = render(<HeartAnimation className="custom-class" />)
    const heartElement = container.firstChild as HTMLElement
    expect(heartElement).toHaveClass('heart-animation')
    expect(heartElement).toHaveClass('custom-class')
  })
})