import React from 'react'
import { render, screen } from '@testing-library/react'
import CoupleForm from '../CoupleForm'

describe('CoupleForm', () => {
  const mockProps = {
    onFormChange: jest.fn(),
    isPremium: false,
    lang: 'en',
    formData: {
      coupleNames: '',
      startDate: '',
      startTime: '',
      message: '',
      email: '',
      youtubeMusic: ''
    },
    maxPhotos: 5
  }

  it('renderiza o componente sem erros', () => {
    expect(() => render(<CoupleForm {...mockProps} />)).not.toThrow()
  })

})