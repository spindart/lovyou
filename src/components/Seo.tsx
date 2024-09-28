import Head from 'next/head';

interface SeoProps {
  title: string;
  description: string;
  coupleNames?: string;
  startDate?: string;
  path?: string;  // Torne esta propriedade opcional
  image?: string;
}

export default function Seo({ title, description, coupleNames, startDate, path = '/', image }: SeoProps) {
  const fullUrl = `https://lovyou.com${path}`; // Use um valor padrão se path não for fornecido

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />} {/* Adicionamos a meta tag para a imagem */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />} {/* Adicionamos a meta tag para a imagem no Twitter */}
      <meta name="twitter:creator" content="@lovyou" /> {/* Ajuste para o handle correto do Twitter */}
      <meta property="og:site_name" content="LovYou" />
      <meta property="og:locale" content="en_US" />
      {coupleNames && <meta property="article:author" content={coupleNames} />}
      {startDate && <meta property="article:published_time" content={startDate} />}
    </Head>
  );
}
