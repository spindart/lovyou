import Head from 'next/head';

interface SeoProps {
  title: string;
  description: string;
}

const Seo: React.FC<SeoProps> = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  )
}

export default Seo