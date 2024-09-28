import { formatDate } from '@/lib/formatDate'

describe('formatDate', () => {
  it('formata a data corretamente', () => {
    const date = new Date('2023-04-01T12:00:00Z')
    expect(formatDate(date)).toBe('01/04/2023')
  })

  it('lida com datas inválidas', () => {
    const invalidDate = new Date('invalid')
    expect(formatDate(invalidDate)).toBe('Data inválida')
  })

  it('formata datas de um dígito corretamente', () => {
    const date = new Date('2023-01-05T12:00:00Z')
    expect(formatDate(date)).toBe('05/01/2023')
  })
  
})