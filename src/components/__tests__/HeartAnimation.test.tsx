import React from 'react'
import { render } from '@testing-library/react'
import { HeartAnimation } from '@/components/HeartAnimation'

describe('HeartAnimation', () => {
  it('renderiza sem erros', () => {
    const { container } = render(<HeartAnimation />)
    expect(container.firstChild).toBeInTheDocument()
  })
})