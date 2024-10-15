import { initReactI18next } from "react-i18next";
import { en } from "./translations/en";
import { fr } from "./translations/fr";
import i18n from "i18next";

const resources = {
    ...en,
    ...fr
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;