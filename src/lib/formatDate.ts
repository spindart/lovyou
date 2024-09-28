export function formatDate(date: Date): string {
  if (isNaN(date.getTime())) {
    return 'Data inválida'
  }
  return date.toLocaleDateString('pt-BR')
}