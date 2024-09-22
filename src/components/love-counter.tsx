"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CalendarIcon, ClockIcon, ImageIcon, Heart, Music } from 'lucide-react'
import { motion } from 'framer-motion'

const translations = {
  en: {
    title: "Surprise your loved one",
    subtitle: "Create a dynamic relationship time counter. Fill out the form and receive your personalized website + QR Code to share with your love 😊",
    basicPlan: "1 year, 3 photos & no song - $4.99",
    premiumPlan: "Forever, 7 photos & with song - $9.99",
    couplesName: "Couple's name:",
    startDate: "Relationship start date:",
    startTime: "Start time:",
    message: "Message:",
    choosePhotos: "Choose couple photos (Max {max}):",
    youtubeMusic: "YouTube Music URL (Optional):",
    createSite: "Create our site",
    together: "Together",
    new: "New:",
    checklistForCouples: "Checklist for couples",
    preview: "Here's a preview 👇",
    placeholderCoupleNames: "e.g. Alice and Bob",
  },
  pt: {
    title: "Surpreenda seu amor",
    subtitle: "Crie um contador dinâmico do seu relacionamento. Preencha o formulário e receba seu site personalizado + QR Code para compartilhar com seu amor 😊",
    basicPlan: "1 ano, 3 fotos e sem música - R$24,99",
    premiumPlan: "Para sempre, 7 fotos e com música - R$49,99",
    couplesName: "Nome do casal:",
    startDate: "Data de início do relacionamento:",
    startTime: "Hora de início:",
    message: "Mensagem:",
    choosePhotos: "Escolha fotos do casal (Máx {max}):",
    youtubeMusic: "URL da Música no YouTube (Opcional):",
    createSite: "Criar nosso site",
    together: "Juntos",
    new: "Novo:",
    checklistForCouples: "Checklist para casais",
    preview: "Aqui está uma prévia 👇",
    placeholderCoupleNames: "ex: Simone e Ricardo",
  }
}

interface PreviewProps {
  coupleNames: string
  startDate: string
  startTime: string
  message: string
  imageUrls: string[]
  youtubeUrl?: string
  lang: 'en' | 'pt'
  t: typeof translations['en'] | typeof translations['pt']
}

function Preview({ coupleNames, startDate, startTime, message, imageUrls, youtubeUrl, lang, t }: PreviewProps) {
  const [timeTogether, setTimeTogether] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const youtubePlayerRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(`${startDate}T${startTime}:00`)
      const now = new Date()
      const diff = now.getTime() - start.getTime()
      
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      if (lang === 'pt') {
        setTimeTogether(`${years} ${years === 1 ? 'ano' : 'anos'}, ${months} ${months === 1 ? 'mês' : 'meses'}, ${days} ${days === 1 ? 'dia' : 'dias'}, ${hours} ${hours === 1 ? 'hora' : 'horas'}, ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} e ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`)
      } else {
        setTimeTogether(`${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}, ${days} ${days === 1 ? 'day' : 'days'}, ${hours} ${hours === 1 ? 'hour' : 'hours'}, ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startDate, startTime, lang])

  useEffect(() => {
    if (imageUrls.length > 0) {
      const imageInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length)
      }, 5000)

      return () => clearInterval(imageInterval)
    }
  }, [imageUrls])

  useEffect(() => {
    if (youtubeUrl && youtubePlayerRef.current) {
      // Extract video ID from YouTube URL
      const videoId = youtubeUrl.split('v=')[1]
      if (videoId) {
        youtubePlayerRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
      }
    }
  }, [youtubeUrl])

  const getCustomUrl = (names: string) => {
    if (!names) return 'your-custom-url'
    return names.toLowerCase().replace(/\s+/g, '-')
  }

  return (
    <div className="w-full h-[calc(100vh-280px)] overflow-hidden">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
        <div className="bg-gray-900 p-2 flex items-center">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="ml-4 text-gray-200 text-sm truncate">
            loveyuu.com/{getCustomUrl(coupleNames)}
          </div>
        </div>
        <div className="relative flex-grow overflow-hidden">
          {imageUrls.length > 0 ? (
            <img 
              src={imageUrls[currentImageIndex]}
              alt={coupleNames ? `${coupleNames} ${t.together.toLowerCase()}` : t.together}
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
              {lang === 'pt' ? 'Nenhuma imagem carregada' : 'No images uploaded'}
            </div>
          )}
          <HeartAnimation />
          {youtubeUrl && (
            <>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
                <Music className="text-white" />
              </div>
              <iframe
                ref={youtubePlayerRef}
                className="hidden"
                width="560"
                height="315"
                src=""
                title="YouTube music player"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </>
          )}
        </div>
        <div className="p-4 text-white">
          <h2 className="text-2xl font-bold mb-2">{t.together}</h2>
          <p className="text-sm mb-4 whitespace-pre-line">{timeTogether}</p>
          <div className="h-px bg-gray-700 my-4"></div>
          <p className="italic">&quot;{message || (lang === 'pt' ? 'Sua mensagem de amor aqui' : 'Your love message here')}&quot;</p>
        </div>
      </div>
    </div>
  )
}

function HeartAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: Math.random() * 100 + '%', y: '100%' }}
          animate={{
            scale: [0, 1, 0],
            x: Math.random() * 100 + '%',
            y: ['-100%', '100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear",
          }}
          className="absolute"
        >
          <Heart className="text-pink-500 w-6 h-6" />
        </motion.div>
      ))}
    </div>
  )
}

export function LoveCounter() {
  const [lang, setLang] = useState<'en' | 'pt'>('en')
  const t = translations[lang]
  const [coupleNames, setCoupleNames] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [message, setMessage] = useState('')
  const [plan, setPlan] = useState('basic')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const maxPhotos = plan === 'basic' ? 3 : 7
      const newImageUrls: string[] = []
      Array.from(files).slice(0, maxPhotos).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newImageUrls.push(reader.result as string)
          if (newImageUrls.length === Math.min(files.length, maxPhotos)) {
            setImageUrls(prevUrls => [...prevUrls, ...newImageUrls].slice(0, maxPhotos))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-end mb-4 space-x-2">
          <Button 
            variant={lang === 'pt' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setLang('pt')}
            className={lang === 'pt' ? "bg-pink-500 text-white" : "text-pink-500 border-pink-500"}
          >
            🇧🇷 Português
          </Button>
          <Button 
            variant={lang === 'en' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setLang('en')}
            className={lang === 'en' ? "bg-pink-500 text-white" : "text-pink-500 border-pink-500"}
          >
            🇺🇸 English
          </Button>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-pink-500">{t.title}</h1>
        <p className="text-center mb-8">{t.subtitle}</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4 text-sm text-pink-500 flex items-center">
              <span className="font-bold mr-2">{t.new}</span> {t.checklistForCouples}
            </div>
            <Tabs value={plan} onValueChange={setPlan} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">{t.basicPlan}</TabsTrigger>
                <TabsTrigger value="premium">{t.premiumPlan}</TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="coupleNames">{t.couplesName}</Label>
                    <Input
                      id="coupleNames"
                      value={coupleNames}
                      onChange={(e) => setCoupleNames(e.target.value)}
                      placeholder={t.placeholderCoupleNames}
                      className="bg-gray-800 border-pink-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">{t.startDate}</Label>
                      <div className="relative">
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-gray-800 border-pink-500 pl-10"
                          required
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="startTime">{t.startTime}</Label>
                      <div className="relative">
                        <Input
                          id="startTime"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="bg-gray-800 border-pink-500 pl-10"
                          required
                        />
                        <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">{t.message}</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="I love you forever"
                      className="bg-gray-800 border-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="photos">{t.choosePhotos.replace('{max}', '3')}</Label>
                    <div className="relative">
                      <Input
                        id="photos"
                        type="file"
                        accept="image/*"
                        multiple
                        className="bg-gray-800 border-pink-500 pl-10"
                        onChange={handleImageUpload}
                      />
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="premium">
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="coupleNames">{t.couplesName}</Label>
                    <Input
                      id="coupleNames"
                      value={coupleNames}
                      onChange={(e) => setCoupleNames(e.target.value)}
                      placeholder={t.placeholderCoupleNames}
                      className="bg-gray-800 border-pink-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">{t.startDate}</Label>
                      <div className="relative">
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-gray-800 border-pink-500 pl-10"
                          required
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="startTime">{t.startTime}</Label>
                      <div className="relative">
                        <Input
                          id="startTime"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="bg-gray-800 border-pink-500 pl-10"
                          required
                        />
                        <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">{t.message}</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="I love you forever"
                      className="bg-gray-800 border-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="photos">{t.choosePhotos.replace('{max}', '7')}</Label>
                    <div className="relative">
                      <Input
                        id="photos"
                        type="file"
                        accept="image/*"
                        multiple
                        className="bg-gray-800 border-pink-500 pl-10"
                        onChange={handleImageUpload}
                      />
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="youtubeMusic">{t.youtubeMusic}</Label>
                    <Input
                      id="youtubeMusic"
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="bg-gray-800 border-pink-500"
                    />
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">{t.preview}</h2>
            <Preview
              coupleNames={coupleNames}
              startDate={startDate}
              startTime={startTime}
              message={message}
              imageUrls={imageUrls}
              youtubeUrl={youtubeUrl}
              lang={lang}
              t={t}
            />
            <div className="mt-6">
              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">{t.createSite}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}