'use client'

import { useEffect, useState, useRef } from 'react';
import { doc, getDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { HeartAnimation } from '../components/HeartAnimation';
import { Music, Share2, Play, Pause } from 'lucide-react';
import { translations, Lang } from '@/lib/translations';
import Seo from '@/components/Seo';
import Image from 'next/image';
import { initializeFirebase } from '@/lib/firebase';
import { devLog } from '@/utils/logging';
import { generateQRCode } from '@/utils/qrCode';

const db = initializeFirebase();

interface SiteData extends DocumentData {
  coupleNames: string;
  startDate: string;
  startTime: string;
  message: string;
  imageUrls: string[];
  youtubeUrl?: string;
  lang: Lang;
  isUnlocked: boolean;
  uniqueHash: string;
}

export default function CouplePage({ params }: { params: { customUrl: string } }) {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [timeTogether, setTimeTogether] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const youtubePlayerRef = useRef<HTMLIFrameElement>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockHash, setUnlockHash] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSiteData() {
      if (params.customUrl) {
        devLog('Fetching site data for:', params.customUrl);
        const docRef = doc(db, 'sites', params.customUrl);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as SiteData;
          devLog('Site data fetched:', data);
          setSiteData(data);
          setIsUnlocked(data.isUnlocked || false);
        } else {
          devLog('No such document!');
          setDataNotFound(true);
        }
      }
    }

    fetchSiteData();
  }, [params.customUrl]);

  useEffect(() => {
    if (siteData) {
      devLog('Setting up time together interval');
      const interval = setInterval(() => {
        const start = new Date(`${siteData.startDate}T${siteData.startTime}:00`);
        const now = new Date();
        const diff = now.getTime() - start.getTime();

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const t = translations[siteData.lang] || translations['en']; // Fallback para inglês se a tradução não existir
        const parts = siteData.lang === 'pt' ? [
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
        ];

        const togetherText = t.together || 'Together for'; // Fallback se 'together' não existir
        setTimeTogether(`${togetherText} ${parts.filter(Boolean).join(', ')}`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [siteData]);

  useEffect(() => {
    if (siteData) {
      const imageInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % siteData.imageUrls.length);
      }, 5000);

      return () => clearInterval(imageInterval);
    }
  }, [siteData]);

  useEffect(() => {
    if (siteData?.youtubeUrl) {
      const videoId = extractYoutubeVideoId(siteData.youtubeUrl);
      setYoutubeVideoId(videoId);
    }
  }, [siteData?.youtubeUrl]);

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
    async function fetchQRCode() {
      if (params.customUrl) {
        const qrCode = await generateQRCode(params.customUrl);
        setQrCodeUrl(qrCode);
      }
    }

    fetchQRCode();
  }, [params.customUrl]);

  const toggleAudio = () => {
    devLog('Toggling audio');
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

  const shareUrl = () => {
    devLog('Sharing URL');
    if (navigator.share) {
      navigator.share({
        title: `${siteData?.coupleNames} - Love Counter`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert(siteData?.lang === 'pt' ? 'Link copiado para a área de transferência!' : 'Link copied to clipboard!');
      }, (err) => {
        console.error('Erro ao copiar: ', err);
      });
    }
  };

  const capitalizeNames = (names: string) => {
    devLog('Capitalizing names:', names);
    return names.split(' ')
      .map(name => {
        if (name.toLowerCase() === 'e' || name.toLowerCase() === 'and') return name.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      })
      .join(' ')
  };

  const handleUnlock = async () => {
    devLog('Attempting to unlock site');
    devLog('Entered hash:', unlockHash);
    devLog('Stored hash:', siteData?.uniqueHash);
    if (siteData && unlockHash === siteData.uniqueHash) {
      devLog('Hash matched');
      const docRef = doc(db, 'sites', params.customUrl);
      await updateDoc(docRef, { isUnlocked: true });
      setIsUnlocked(true);
    } else {
      devLog('Hash mismatch');
      alert(t.invalidHash);
    }
  };

  const t = translations[siteData?.lang || 'en'];

  if (dataNotFound) {
    return (
      <>
        <Seo
          title="Page Not Found | LovYou"
          description="The couple page you are looking for does not exist or has been removed."
          coupleNames="Not Found"
          startDate={new Date().toISOString()}
          path={`/${params.customUrl}`}
        />
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl">
            <h1 className="text-2xl font-bold text-pink-600 mb-4">
              {siteData?.lang === 'pt' ? 'Oops! Página não encontrada' : 'Oops! Page not found'}
            </h1>
            <p className="text-gray-600">
              {siteData?.lang === 'pt'
                ? 'A página do casal que você está procurando não existe ou foi removida.'
                : 'The couple page you are looking for does not exist or has been removed.'}
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!siteData) {
    return (
      <>
        <Seo
          title="Loading Love Counter | LovYou"
          description="Your personalized love counter is loading..."
          coupleNames="Loading"
          startDate={new Date().toISOString()}
          path={`/${params.customUrl}`}
        />
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center">
          <div className="text-2xl font-bold text-pink-600">
            {translations['en'].loading}
          </div>
        </div>
      </>
    );
  }

  if (!isUnlocked) {
    return (
      <>
        <Seo
          title={`${siteData.coupleNames} - Love Counter | LovYou`}
          description="Unlock your personalized love counter"
          coupleNames={siteData.coupleNames}
          startDate={siteData.startDate}
          path={`/${params.customUrl}`}
        />
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl max-w-md w-full">
            <h1 className="text-2xl font-bold text-pink-600 mb-4">
              {t.unlockYourPage}
            </h1>
            <p className="text-gray-600 mb-4">
              {t.enterUnlockHash}
            </p>
            <input
              type="text"
              value={unlockHash}
              onChange={(e) => setUnlockHash(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder={t.unlockHashPlaceholder}
            />
            <button
              onClick={handleUnlock}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
            >
              {t.unlock}
            </button>
          </div>
        </div>
      </>
    );
  }

  const imageUrls = siteData.imageUrls || [];

  return (
    <>
      <Seo
        title={`${siteData.coupleNames} - Love Counter | LovYou`}
        description={`${siteData.coupleNames} have been together since ${siteData.startDate}. ${siteData.message}`}
        image={imageUrls[0]} // Agora esta propriedade é aceita
        coupleNames={siteData.coupleNames}
        startDate={siteData.startDate}
        path={`/${params.customUrl}`}
      />
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl overflow-hidden">
          <div className="relative" style={{ paddingBottom: '75%' }}>
            {siteData.imageUrls.length > 0 && (
              <Image
                src={siteData.imageUrls[currentImageIndex]}
                alt={`${siteData.coupleNames} together`}
                layout="fill"
                objectFit="contain"
                priority
                unoptimized // Adicione esta prop para evitar otimização do Next.js
              />
            )}
            <div className="absolute inset-0">
              <HeartAnimation />
            </div>
            <button
              onClick={shareUrl}
              className="absolute top-4 right-4 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors duration-200"
              aria-label={siteData.lang === 'pt' ? 'Compartilhar' : 'Share'}
            >
              <Share2 size={24} />
            </button>
          </div>
          <div className="p-6 bg-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-2">
              {capitalizeNames(siteData.coupleNames)}
            </h1>
            <p className="text-xl sm:text-2xl font-light text-gray-700 mb-4">
              {timeTogether}
            </p>
            <p className="text-lg italic text-gray-700 mb-6">"{siteData.message}"</p>
            {youtubeVideoId && (
              <div className="mt-4 flex items-center justify-between bg-pink-100 p-3 rounded-lg">
                <div className="flex items-center">
                  <Music className="w-6 h-6 mr-2 text-pink-500" />
                  <span className="text-pink-700 font-medium">
                    {siteData.lang === 'pt' ? 'Nossa música' : 'Our song'}
                  </span>
                </div>
                <button
                  onClick={toggleAudio}
                  className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-2 transition-colors duration-200"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>
            )}
            {qrCodeUrl && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-pink-600 mb-2">
                  {t.scanQRCode}
                </h2>
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
            )}
          </div>
        </div>
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
    </>
  );
}

function extractYoutubeVideoId(url: string): string | null {
  devLog('Extracting YouTube video ID from:', url);
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
