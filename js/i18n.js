
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

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = i18next.t(key);
  });

  // Update language selector
  const langSelector = document.querySelector('.language-selector select');
  if (langSelector) {
    langSelector.value = i18next.language;
  }
}

function changeLanguage(lang) {
  i18next.changeLanguage(lang).then(() => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = i18next.t(key);
    });
  });
}
