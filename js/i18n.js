
async function initI18n() {
  const languages = ['de', 'en', 'it', 'fr', 'es', 'pt', 'sq'];
  const resources = {};
  
  for (const lang of languages) {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      resources[lang] = {
        translation: await response.json()
      };
    } catch (error) {
      console.warn(`Failed to load ${lang} translations:`, error);
    }
  }

  await i18next
    .use(i18nextBrowserLanguageDetector)
    .init({
      resources,
      fallbackLng: 'de',
      lng: 'de', // Set default language to German
      debug: false,
      interpolation: {
        escapeValue: false
      }
    });

  updatePageContent();
  updateLanguageSelector();
}

function loadLocaleMessages(locale) {
  return fetch(`/locales/${locale}.json`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error loading translations:', error);
      return {};
    });
}

async function initI18n() {
  const resources = {
    de: { translation: await loadLocaleMessages('de') },
    en: { translation: await loadLocaleMessages('en') }
  };

  await i18next
    .use(i18nextBrowserLanguageDetector)
    .init({
      resources,
      fallbackLng: 'de',
      lng: 'de', // Force German as default
      debug: false,
      interpolation: {
        escapeValue: false
      }
    });

  updatePageContent();
  updateLanguageSelector();
}

function updatePageContent() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (!key) return;
    
    if (key.startsWith('[')) {
      const match = key.match(/\[(.*?)\](.*)/);
      if (match) {
        const attr = match[1];
        const k = match[2];
        element.setAttribute(attr, i18next.t(k));
      }
    } else {
      const translation = i18next.t(key);
      if (typeof translation === 'string') {
        element.textContent = translation;
      }
    }
  });
}

function updateLanguageSelector() {
  const selector = document.querySelector('.language-selector select');
  if (selector) {
    selector.value = i18next.language;
  }
}

function changeLanguage(lang) {
  i18next.changeLanguage(lang).then(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ['ar', 'he', 'fa'].includes(lang) ? 'rtl' : 'ltr';
    updatePageContent();
    updateLanguageSelector();
    localStorage.setItem('preferred-language', lang);
  });
}

// Initialize with stored language preference
document.addEventListener('DOMContentLoaded', () => {
  const storedLang = localStorage.getItem('preferred-language');
  if (storedLang) {
    changeLanguage(storedLang);
  }
});
