export function getCustomUrl(names: string): string {
    if (!names) return 'your-custom-url'
    return names.toLowerCase().replace(/\s+/g, '-')
}