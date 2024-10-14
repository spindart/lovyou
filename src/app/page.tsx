"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CalendarIcon, ClockIcon, ImageIcon, Heart, Music } from 'lucide-react'
import { HeartAnimation } from './components/HeartAnimation'
import { useDropzone } from 'react-dropzone'
import CoupleForm from './components/CoupleForm'
import { translations, Lang } from '@/lib/translations'
import Seo from '@/components/Seo';
import { stripePromise } from '@/lib/stripe'

const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

interface PreviewProps {
  coupleNames: string
  startDate: string
  startTime: string
  message: string
  imageUrls: string[]
  youtubeUrl?: string
  t: typeof translations.en | typeof translations.pt
  onImageUpload: (files: File[]) => void
  maxPhotos: number
  lang: Lang
}

function Preview({ coupleNames, startDate, startTime, message, imageUrls, youtubeUrl, t, onImageUpload, maxPhotos, lang }: PreviewProps) {
  const [timeTogether, setTimeTogether] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const youtubePlayerRef = useRef<HTMLIFrameElement>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: onImageUpload,
    maxFiles: maxPhotos
  });

  useEffect(() => {
    if (youtubeUrl) {
      const videoId = extractYoutubeVideoId(youtubeUrl);
      setYoutubeVideoId(videoId);
    }
  }, [youtubeUrl]);

  useEffect(() => {
    if (youtubeVideoId && youtubePlayerRef.current) {
      const player = youtubePlayerRef.current;
      player.src = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&loop=1&playlist=${youtubeVideoId}`;
      player.addEventListener('load', () => {
        setIsPlaying(true);
      });
    }
  }, [youtubeVideoId]);

  useEffect(() => {
    if (imageUrls.length > 0) {
      const imageInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length)
      }, 5000)

      return () => clearInterval(imageInterval)
    }
  }, [imageUrls])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!startDate) {
        setTimeTogether(t.timeTogetherPlaceholder)
        return
      }

      const start = new Date(`${startDate}T${startTime || '00:00'}:00`)
      if (isNaN(start.getTime())) {
        setTimeTogether(t.timeTogetherPlaceholder)
        return
      }

      const now = new Date()
      const diff = now.getTime() - start.getTime()

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      const parts = lang === 'pt' ? [
        years > 0 ? `${years} ${years === 1 ? 'ano' : 'anos'}` : '',
        months > 0 ? `${months} ${months === 1 ? 'mês' : 'meses'}` : '',
        days > 0 ? `${days} ${days === 1 ? 'dia' : 'dias'}` : '',
        hours > 0 ? `${hours} ${hours === 1 ? 'hora' : 'horas'}` : '',
        minutes > 0 ? `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}` : '',
        `${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`
      ] : [
        years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '',
        months > 0 ? `${months} ${months === 1 ? 'month' : 'months'}` : '',
        days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '',
        hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '',
        minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : '',
        `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
      ]

      setTimeTogether(parts.filter(Boolean).join(', '))
    }, 1000)

    return () => clearInterval(interval)
  }, [startDate, startTime, t.timeTogetherPlaceholder, lang])

  const extractYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  const getCustomUrl = (names: string) => {
    if (!names) return t.defaultCustomUrl;
    return encodeURIComponent(names.toLowerCase().replace(/\s+/g, '-'));
  }

  const toggleAudio = () => {
    if (youtubePlayerRef.current) {
      const player = youtubePlayerRef.current;
      if (isPlaying) {
        player.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        player.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gray-100 p-2 flex items-center space-x-2">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-md py-1 px-3 flex items-center space-x-2 w-4/5 max-w-md">
            <div className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="text-sm text-gray-600 font-medium truncate flex-grow">
              lovyou.xyz/{getCustomUrl(coupleNames)}
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex-grow overflow-hidden bg-gradient-to-br from-pink-200/30 via-purple-30/20 to-blue-200/10">
        {imageUrls.length > 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={imageUrls[currentImageIndex]}
              alt={coupleNames ? `${coupleNames} together` : 'Couple'}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute inset-0">
              <HeartAnimation />
            </div>
          </div>
        ) : (
          <div {...getRootProps()} className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4">
            <input {...getInputProps()} />
            <ImageIcon className="w-16 h-16 mb-4 text-pink-500" />
            {isDragActive ? (
              <p className="text-lg font-semibold text-pink-600">{t.dropPhotosHere.replace('{max}', maxPhotos.toString())}</p>
            ) : (
              <>
                <p className="text-lg font-semibold mb-2 text-pink-600">{t.dropPhotosHere.replace('{max}', maxPhotos.toString())}</p>
                <p className="text-sm font-medium text-pink-500">{t.orClickToSelect}</p>
              </>
            )}
          </div>
        )}
      </div>
      <div className="p-2 bg-white">
        <h2 className="text-lg font-bold mb-1 text-pink-600">
          {coupleNames || t.placeholderCoupleNames}
        </h2>
        <p className="text-xs mb-1 font-medium text-gray-700">
          {lang === 'pt' ? `${t.together} ` : ''}
        </p>
        <p className="text-xs mb-1 font-medium text-gray-700">
          {timeTogether || t.timeTogetherPlaceholder}
        </p>
        <p className="italic text-gray-600 text-xs truncate">
          &quot;{message || t.yourLoveMessage}&quot;
        </p>
        {youtubeVideoId && (
          <div className="mt-4 flex items-center text-pink-500">
            <Music className="w-6 h-6 mr-2" />
            <span>{lang === 'pt' ? 'Tocando nossa música' : 'Playing our song'}</span>
          </div>
        )}
      </div>
      {youtubeVideoId && (
        <iframe
          ref={youtubePlayerRef}
          style={{ display: 'none' }}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  )
}

export default function Component() {
  const [lang, setLang] = useState<Lang>('en')
  const t = translations[lang]
  const [formData, setFormData] = useState({
    coupleNames: '',
    startDate: '',
    startTime: '',
    message: '',
    plan: 'basic',
    imageUrls: [] as string[],
    youtubeUrl: '',
    email: ''
  })

  const handleFormChange = (changes: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...changes }))
  }

  const handleImageUpload = (files: File[]) => {
    const maxPhotos = formData.plan === 'basic' ? 3 : 7
    const newImageUrls: string[] = []
    files.slice(0, maxPhotos).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newImageUrls.push(reader.result as string)
        if (newImageUrls.length === Math.min(files.length, maxPhotos)) {
          handleFormChange({ imageUrls: [...formData.imageUrls, ...newImageUrls].slice(0, maxPhotos) })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleCreateSite = async () => {
    try {
      devLog('Iniciando criação do site...');
      devLog('Dados do formulário:', formData);
      devLog('Modo Stripe:', process.env.NODE_ENV === 'production' ? 'Produção' : 'Teste');
      
      const siteResponse = await fetch('/api/create-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coupleNames: formData.coupleNames,
          startDate: formData.startDate,
          startTime: formData.startTime,
          message: formData.message,
          imageUrls: formData.imageUrls,
          youtubeUrl: formData.youtubeUrl,
          email: formData.email,
          plan: formData.plan,
          language: lang
        }),
      });

      if (!siteResponse.ok) {
        const errorData = await siteResponse.json();
        devLog('Erro ao criar o site:', errorData);
        throw new Error(`Erro ao criar o site: ${JSON.stringify(errorData)}`);
      }

      const { siteId, customUrl } = await siteResponse.json();
      devLog('Site criado com sucesso. ID:', siteId, 'URL:', customUrl);

      // Agora, vamos criar a sessão de checkout
      const priceId = getPriceId(formData.plan, lang);
      devLog('PriceId:', priceId);
      devLog('Ambiente:', process.env.NODE_ENV);

      if (!priceId) {
        throw new Error('PriceId não encontrado');
      }

      const checkoutResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, siteId, customUrl, email: formData.email }),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        devLog('Erro na resposta do checkout:', errorData);
        throw new Error(`HTTP error! status: ${checkoutResponse.status}`);
      }

      const { sessionId } = await checkoutResponse.json();
      devLog('SessionId recebido:', sessionId);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe não inicializado');
      }

      devLog('Redirecionando para o checkout...');
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        devLog('Erro ao redirecionar para o checkout:', error);
        throw error;
      }
    } catch (error) {
      devLog('Erro detalhado:', error);
      alert('Ocorreu um erro ao criar o site ou redirecionar para o checkout. Por favor, tente novamente.');
    }
  };

  const getPriceId = (plan: string, lang: Lang) => {
    const priceMap: Record<string, Record<Lang, string>> = {
      basic: {
        en: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID_EN || '',
        pt: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID_PT || '',
      },
      premium: {
        en: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID_EN || '',
        pt: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID_PT || '',
      },
    };

    const priceId = priceMap[plan][lang];
    devLog('PriceId selecionado:', priceId);
    return priceId;
  };

  return (
    <>
      <Seo
        title="LovYou - Celebrate Your Love"
        description="Create your personalized love counter and celebrate your relationship."
        path="/"  // Adicione esta linha
      />
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-4 flex flex-col">
        <div className="container mx-auto max-w-7xl flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="w-24"> {/* Espaço vazio à esquerda para balancear o layout */}
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-bold text-pink-600">Lov</span>
              <div className="bg-pink-600 rounded-full p-1">
                <Heart className="text-white" size={16} />
              </div>
              <span className="text-2xl font-bold text-pink-600">you</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={lang === 'en' ? "default" : "outline"}
                size="sm"
                onClick={() => setLang('en')}
                className={lang === 'en' ? "bg-pink-600 text-white" : "text-pink-600 border-pink-600"}
              >
                🇺🇸 English
              </Button>
              <Button
                variant={lang === 'pt' ? "default" : "outline"}
                size="sm"
                onClick={() => setLang('pt')}
                className={lang === 'pt' ? "bg-pink-600 text-white" : "text-pink-600 border-pink-600"}
              >
                🇧🇷 Português
              </Button>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-pink-700">{t.title}</h1>
          <p className="text-center mb-8 text-gray-800">{t.subtitle}</p>

          <div className="grid md:grid-cols-2 gap-6 flex-grow">
            <div className="bg-white rounded-xl shadow-xl p-6">
              <Tabs value={formData.plan} onValueChange={(value) => handleFormChange({ plan: value })} className="mb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">{t.basicPlan}</TabsTrigger>
                  <TabsTrigger value="premium">{t.premiumPlan}</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <CoupleForm
                    lang={lang}
                    formData={formData}
                    onFormChange={handleFormChange}
                    maxPhotos={3}
                  />
                </TabsContent>
                <TabsContent value="premium">
                  <CoupleForm
                    lang={lang}
                    formData={formData}
                    onFormChange={handleFormChange}
                    maxPhotos={7}
                  />
                  <div className="mt-4">
                    <Label htmlFor="youtubeMusic" className="text-gray-700">{t.youtubeMusic}</Label>
                    <Input
                      id="youtubeMusic"
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => handleFormChange({ youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="border-pink-300 focus:border-pink-500 placeholder-pink-400 text-pink-700"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex flex-col h-full">
              <div className="bg-white rounded-xl shadow-xl p-4 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold mb-4 text-pink-700">{t.preview}</h2>
                <div className="flex-grow relative overflow-hidden">
                  <Preview
                    coupleNames={formData.coupleNames}
                    startDate={formData.startDate}
                    startTime={formData.startTime}
                    message={formData.message}
                    imageUrls={formData.imageUrls}
                    youtubeUrl={formData.youtubeUrl}
                    t={t}
                    onImageUpload={handleImageUpload}
                    maxPhotos={formData.plan === 'basic' ? 3 : 7}
                    lang={lang}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleCreateSite}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-200 hover:scale-105"
                >
                  {t.createSite}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}