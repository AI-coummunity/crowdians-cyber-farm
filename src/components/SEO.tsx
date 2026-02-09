import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title = 'Crowdians - Cyber Farm',
  description = 'A gamified AI training platform where you chat with pixel-art characters, correct AI errors, and send them on adventures.',
  keywords = 'AI 훈련, 게임화, 데이터 라벨링, 챗봇, 픽셀아트, 사이버 농장, 크라우드소싱, 머신러닝',
  image = 'https://lovable.dev/opengraph-image-p98pqg.png',
  url = 'https://crowdians-cyber-farm.vercel.app',
  type = 'website',
}: SEOProps) {
  const fullTitle = title === 'Crowdians - Cyber Farm' ? title : `${title} | Crowdians - Cyber Farm`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
