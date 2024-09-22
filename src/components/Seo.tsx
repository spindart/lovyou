import Head from 'next/head';

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  coupleNames?: string;
  startDate?: string;
  path?: string;
}

export default function Seo({ title, description, image, coupleNames, startDate, path = '' }: SeoProps) {
  const canonicalUrl = `https://lovyou.xyz${path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {coupleNames && startDate && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Relationship",
            "name": coupleNames,
            "startDate": startDate,
            "description": description
          })}
        </script>
      )}
    </Head>
  );
}