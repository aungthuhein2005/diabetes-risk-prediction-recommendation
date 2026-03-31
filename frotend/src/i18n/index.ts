import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import my from './locales/my.json'
import th from './locales/th.json'

const STORAGE_KEY = 'diapredict_lang'

const savedLang = localStorage.getItem(STORAGE_KEY) ?? 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      my: { translation: my },
      th: { translation: th },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

// Persist language choice & update <html lang> + font class on every change
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  document.documentElement.setAttribute('lang', lng)
  document.documentElement.setAttribute('data-lang', lng)
})

// Apply on startup
document.documentElement.setAttribute('lang', savedLang)
document.documentElement.setAttribute('data-lang', savedLang)

export default i18n
