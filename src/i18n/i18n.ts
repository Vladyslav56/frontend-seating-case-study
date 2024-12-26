import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en/en.json"
import cz from "./locales/cz/cz.json"

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: en,
		},
		cz: {
			translation: cz,
		},
	},
	lng: "en",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
})

export default i18n
