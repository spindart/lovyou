"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/confirm-payment?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          if (data.url) {
            setSiteUrl(data.url);
          }
        })
        .catch(error => console.error('Erro ao confirmar pagamento:', error));
    }
  }, [sessionId]);

  return (
    <div>
      <h1>Pagamento bem-sucedido!</h1>
      {siteUrl ? (
        <p>Seu site está pronto: <a href={siteUrl}>{siteUrl}</a></p>
      ) : (
        <p>Processando seu site...</p>
      )}
    </div>
  );
}