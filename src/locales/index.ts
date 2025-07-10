import * as i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import translationKo from './ko.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ko',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    lng: sessionStorage.getItem('i18nextLng') || 'ko',
    detection: {
      lookupSessionStorage: 'i18nextLng',
      order: ['sessionStorage'],
      caches: ['sessionStorage'],
    },
    resources: {
      ko: {
        translation: translationKo,
      },
      // en: {
      //   translation: translationEn, //TODO: 나중에 영어 추가
      // },
    },
  });

export default i18n;
