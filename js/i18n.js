
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
    en: { translation: await loadLocaleMessages('en') },
    fr: { translation: await loadLocaleMessages('fr') },
    it: { translation: await loadLocaleMessages('it') },
    es: { translation: await loadLocaleMessages('es') },
    pt: { translation: await loadLocaleMessages('pt') },
    sq: { translation: await loadLocaleMessages('sq') }
  };

  await i18next
    .use(i18nextBrowserLanguageDetector)
    .init({
      resources,
      fallbackLng: 'de',
      debug: false,
      interpolation: {
        escapeValue: false
      }
    });

  updatePageContent();
}

function updatePageContent() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key.startsWith('[')) {
      // Handle attribute translations
      const match = key.match(/\[(.*?)\](.*)/);
      if (match) {
        const attr = match[1];
        const k = match[2];
        element.setAttribute(attr, i18next.t(k));
      }
    } else {
      element.textContent = i18next.t(key);
    }
  });
}

function changeLanguage(lang) {
  i18next.changeLanguage(lang).then(() => {
    updatePageContent();
  });
}
