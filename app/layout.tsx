import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'LovYou - Contador de amor',
    description: 'Um contador de amor para casais apaixonados',
    manifest: '/manifest.json',
    robots: "index, follow",
  icons: {
        apple: '/icon.png',
    },
    themeColor: '#ffffff',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    applicationName: 'LovYou',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'LovYou',
    },
}

// ... resto do código do layout