import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        welcome: "Welcome",
        logout: "Logout",
        login: "Login",
        signup: "Sign up",
        save: "Save",
        cancel: "Cancel",
      },
      pages: {
        dashboard: "Dashboard",
        contacts: "Contacts",
        map: "Map",
        donors: "Donors",
        protocols: "Protocols",
        profile: "Profile",
        admin: "Admin",
      },
      sos: {
        trigger: "SOS",
        sending: "Sending SOS...",
        sent: "SOS sent",
      },
      auth: {
        email: "Email",
        password: "Password",
        name: "Name",
      },
      errors: {
        required: "This field is required",
      },
    },
  },
  hi: {
    translation: {
      common: {
        welcome: "स्वागत है",
        logout: "लॉग आउट",
        login: "लॉगिन",
        signup: "साइन अप",
        save: "सहेजें",
        cancel: "रद्द करें",
      },
      pages: {
        dashboard: "डैशबोर्ड",
        contacts: "संपर्क",
        map: "मैप",
        donors: "दानकर्ता",
        protocols: "प्रोटोकॉल",
        profile: "प्रोफ़ाइल",
        admin: "एडमिन",
      },
      sos: {
        trigger: "एसओएस",
        sending: "एसओएस भेज रहे हैं...",
        sent: "एसओएस भेजा गया",
      },
      auth: {
        email: "ईमेल",
        password: "पासवर्ड",
        name: "नाम",
      },
      errors: {
        required: "यह आवश्यक फ़ील्ड है",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
