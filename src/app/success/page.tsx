"use client"

import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Pagamento bem-sucedido!</h1>
        <p className="mt-2 text-lg text-gray-600">
          Obrigado por sua compra. Por favor, verifique seu e-mail para mais informações.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}