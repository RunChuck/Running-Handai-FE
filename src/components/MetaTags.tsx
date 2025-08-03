import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const MetaTags = ({ title, description, image, url }: MetaTagsProps) => {
  const [t] = useTranslation();

  const defaultTitle = t('seo.title');
  const defaultDescription = t('seo.description');
  const defaultImage = '/runninghandai-thumbnail.png';
  const defaultUrl = `${window.location.origin}${window.location.pathname}`;

  const seoTitle = title ? `${defaultTitle} | ${title}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || defaultUrl;

  // 디버깅용
  // console.log('MetaTags rendered:', { seoTitle, seoDescription, seoImage, seoUrl });

  // DOM 직접 업데이트
  useEffect(() => {
    document.title = seoTitle;

    const updateMetaTag = (selector: string, content: string) => {
      const metaTag = document.querySelector(selector);
      if (metaTag) {
        metaTag.setAttribute('content', content);
      }
    };

    updateMetaTag('meta[name="description"]', seoDescription);
    updateMetaTag('meta[property="og:title"]', seoTitle);
    updateMetaTag('meta[property="og:description"]', seoDescription);
    updateMetaTag('meta[property="og:image"]', seoImage);
    updateMetaTag('meta[property="og:url"]', seoUrl);
    updateMetaTag('meta[name="twitter:title"]', seoTitle);
    updateMetaTag('meta[name="twitter:description"]', seoDescription);
    updateMetaTag('meta[name="twitter:image"]', seoImage);
  }, [seoTitle, seoDescription, seoImage, seoUrl]);

  return null;
};

export default MetaTags;
