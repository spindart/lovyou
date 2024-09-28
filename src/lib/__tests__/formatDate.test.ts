import { formatDate } from '../formatDate'

describe('formatDate', () => {
  it('formata a data corretamente', () => {
    const date = new Date('2023-01-01T00:00:00Z')
    expect(formatDate(date)).toBe('31/12/2022')
  })

  it('lida com datas inválidas', () => {
    expect(formatDate(new Date('invalid date'))).toBe('Data inválida')
  })

  it('formata datas com mês e dia de um dígito', () => {
    const date = new Date('2023-02-03T00:00:00Z')
    expect(formatDate(date)).toBe('02/02/2023')
  })

  it('formata datas com mês e dia de dois dígitos', () => {
    const date = new Date('2023-12-31T00:00:00Z')
    expect(formatDate(date)).toBe('30/12/2023')
  })

  it('lida com anos bissextos', () => {
    const date = new Date('2024-02-29T00:00:00Z')
    expect(formatDate(date)).toBe('28/02/2024')
  })
})