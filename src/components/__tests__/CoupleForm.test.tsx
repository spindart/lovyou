import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CoupleForm from '@/components/CoupleForm'

const mockFormData = {
  coupleNames: '',
  startDate: '',
  startTime: '',
  message: '',
  email: ''
}

const mockOnFormChange = jest.fn()

describe('CoupleForm', () => {
  it('renderiza todos os campos do formulário', () => {
    render(<CoupleForm lang="en" formData={mockFormData} onFormChange={mockOnFormChange} maxPhotos={3} />)

    expect(screen.getByLabelText(/Couple Names/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Start Time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Love Message/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
  })

  it('chama onFormChange quando os campos são alterados', () => {
    render(<CoupleForm lang="en" formData={mockFormData} onFormChange={mockOnFormChange} maxPhotos={3} />)

    fireEvent.change(screen.getByLabelText(/Couple Names/i), { target: { value: 'Alice and Bob' } })
    expect(mockOnFormChange).toHaveBeenCalledWith({ coupleNames: 'Alice and Bob' })

    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: '2023-01-01' } })
    expect(mockOnFormChange).toHaveBeenCalledWith({ startDate: '2023-01-01' })

    fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: '12:00' } })
    expect(mockOnFormChange).toHaveBeenCalledWith({ startTime: '12:00' })

    fireEvent.change(screen.getByLabelText(/Love Message/i), { target: { value: 'Our love story' } })
    expect(mockOnFormChange).toHaveBeenCalledWith({ message: 'Our love story' })

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
    expect(mockOnFormChange).toHaveBeenCalledWith({ email: 'test@example.com' })
  })
})