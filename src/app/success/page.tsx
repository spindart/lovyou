"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getFirestore, doc, updateDoc } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { CheckCircleIcon, HeartIcon } from '@heroicons/react/24/solid'
import Seo from '@/components/Seo';

const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

initializeApp(firebaseConfig);

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isUnlocking, setIsUnlocking] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    devLog('SearchParams:', searchParams);
    if (searchParams) {
      const customUrl = searchParams.get('customUrl')
      devLog('CustomUrl:', customUrl);
      if (customUrl) {
        unlockSite(customUrl)
      } else {
        setError('URL personalizada não encontrada')
        setIsUnlocking(false)
      }
    } else {
      setError('Parâmetros de busca não disponíveis')
      setIsUnlocking(false)
    }
  }, [searchParams])

  const unlockSite = async (customUrl: string) => {
    devLog('Iniciando desbloqueio do site:', customUrl);
    const db = getFirestore()
    const siteRef = doc(db, 'sites', customUrl)

    try {
      await updateDoc(siteRef, {
        isUnlocked: true
      })
      devLog('Site desbloqueado com sucesso');
      router.push(`/${customUrl}`)
    } catch (error) {
      devLog('Erro ao desbloquear o site:', error)
      setError('Erro ao desbloquear o site. Por favor, tente novamente.')
      setIsUnlocking(false)
    }
  }

  if (isUnlocking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500">
        <div className="text-center">
          <HeartIcon className="mx-auto h-16 w-16 text-white animate-pulse" />
          <h2 className="mt-4 text-2xl font-semibold text-white">Desbloqueando seu site de amor...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        {error ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <CheckCircleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Oops! Algo deu errado</h1>
            <p className="mt-2 text-lg text-gray-600">{error}</p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Pagamento bem-sucedido!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Seu site de amor está pronto para ser visitado.
            </p>
          </>
        )}
        <div className="mt-8">
          <button
            onClick={() => {
              devLog('Redirecionando para a página inicial');
              router.push('/')}
            }
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-0.5 text-sm font-medium text-white hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-200"
          >
            <span className="relative rounded-full bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
              <HeartIcon className="mr-2 h-4 w-4 inline-block text-pink-600 group-hover:text-white" />
              <span className="text-pink-600 group-hover:text-white">Voltar para a página inicial</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}