import { initReactI18next } from "react-i18next";
import { en } from "./translations/en";
import { fr } from "./translations/fr";
import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    ...en,
    ...fr
}

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        supportedLngs: ['en', 'fr'],
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;