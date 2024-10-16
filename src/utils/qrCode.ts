import QRCode from 'qrcode';

export async function generateQRCode(customUrl: string): Promise<string> {

  const baseUrl = process.env.NODE_ENV === 'production'

    ? 'https://lovyou.vercel.app'  // Substitua pelo seu domínio de produção real

    : 'http://localhost:3000';


  const fullUrl = `${baseUrl}/${customUrl}`;

  try {

    const qrCodeDataUrl = await QRCode.toDataURL(fullUrl);

    return qrCodeDataUrl;

  } catch (error) {

    console.error('Erro ao gerar QR code:', error);

    return '';

  }

}


