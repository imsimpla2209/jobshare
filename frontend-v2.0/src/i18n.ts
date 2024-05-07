import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector'
// import i18nextConfig from 'src/config/react-i18next.config';
import resourcesToBackend from 'i18next-resources-to-backend'

i18n
  // .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .use(resourcesToBackend((language, namespace) => import(`src/locales/${language}/${namespace}.json`)))
  .init({
    // resources: {
    //   en: { translation: enTranslation },
    //   vi: { translation: viTranslation }
    // },
    // lng: localStorage.getItem('i18nextLng') || i18nextConfig.i18n.defaultLocale, // Detect selected langauge
    fallbackLng: 'en',
    // backend: {
    //   loadPath: './locales/vi/main.json',
    // },
    // supportedLngs: i18nextConfig.i18n.locales, // List of supported languages
    // debug: true,
    detection: {
      order: ['localStorage', 'navigator'], // Check localStorage first, then use browser navigator
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
