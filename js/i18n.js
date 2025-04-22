
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
    updatePageContent();
    updateLanguageSelector();
  });
}
