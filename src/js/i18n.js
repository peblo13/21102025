(function(){
  const DICT = {
    pl: {
      'lang.name': 'Polski',
      'nav.home': 'Strona główna',
      'nav.cvdb': 'Baza CV',
      'nav.jobs': 'Oferty pracy',
      'nav.services': 'Usługi',
      'nav.trainings': 'Szkolenia',
      'nav.cvbuilder': 'Kreator CV',
      'nav.marketplace': '💰 Marketplace',
      'nav.faq': 'FAQ',
      'nav.contact': '📞 Kontakt',
      'nav.login': 'Logowanie',
      'nav.register': 'Rejestracja',

      'jobs.title': '🔍 Oferty Pracy',
      'jobs.subtitle': 'Znajdź idealną pracę z naszej bazy tysięcy ofert',

      'search.title': 'Stanowisko',
      'search.location': 'Lokalizacja',
      'search.type': 'Rodzaj umowy',
      'search.submit': '🔍 Szukaj pracy',
      'search.type.any': 'Dowolna',
      'search.type.full': 'Pełny etat',
      'search.type.mandate': 'Umowa zlecenie',
      'search.type.contract': 'Umowa o dzieło',
      'search.type.intern': 'Praktyki',
      'search.type.trainee': 'Staż',

      'stats.active': 'Aktywnych ofert',
      'stats.newToday': 'Nowych dzisiaj',
      'stats.companies': 'Firm rekrutujących',
      'stats.remote': 'Pracy zdalnej',

      'offers.latest': 'Najnowsze oferty pracy',
      'offers.loading': 'Ładowanie ofert pracy...',
      'offers.none.title': '🔍 Brak ofert',
      'offers.none.desc': 'Nie znaleziono ofert spełniających kryteria wyszukiwania.',
      'offers.loadMore': '⬇️ Załaduj więcej ogłoszeń z Jooble',
      'offers.moreInline': '⬇️ Więcej z Jooble',

      'card.location': '📍',
      'card.type': '📄',
      'card.from': 'Od:',
      'card.apply': '📧 Aplikuj teraz',
      'card.details': '📋 Szczegóły',
      'card.goto': '🌐 Przejdź do oferty',

      'paginate.prev': '⏮️',
      'paginate.next': '⏭️',

      // Index map section
      'map.title': '🗺️ Mapa ofert pracy',
      'map.subtitle': 'Interaktywna mapa pokazująca liczbę ofert (kliknij kraj, aby zobaczyć liczbę)'
    },
    en: {
      'lang.name': 'English',
      'nav.home': 'Home',
      'nav.cvdb': 'CV Database',
      'nav.jobs': 'Jobs',
      'nav.services': 'Services',
      'nav.trainings': 'Trainings',
      'nav.cvbuilder': 'CV Builder',
      'nav.marketplace': '💰 Marketplace',
      'nav.faq': 'FAQ',
      'nav.contact': '📞 Contact',
      'nav.login': 'Login',
      'nav.register': 'Register',

      'jobs.title': '🔍 Job Offers',
      'jobs.subtitle': 'Find your perfect job from our thousands of listings',

      'search.title': 'Job title',
      'search.location': 'Location',
      'search.type': 'Contract type',
      'search.submit': '🔍 Search jobs',
      'search.type.any': 'Any',
      'search.type.full': 'Full-time',
      'search.type.mandate': 'Mandate contract',
      'search.type.contract': 'Contract for specific work',
      'search.type.intern': 'Internship',
      'search.type.trainee': 'Traineeship',

      'stats.active': 'Active offers',
      'stats.newToday': 'New today',
      'stats.companies': 'Hiring companies',
      'stats.remote': 'Remote jobs',

      'offers.latest': 'Latest job offers',
      'offers.loading': 'Loading job offers...',
      'offers.none.title': '🔍 No results',
      'offers.none.desc': 'No offers matched your filters.',
      'offers.loadMore': '⬇️ Load more from Jooble',
      'offers.moreInline': '⬇️ More from Jooble',

      'card.location': '📍',
      'card.type': '📄',
      'card.from': 'From:',
      'card.apply': '📧 Apply now',
      'card.details': '📋 Details',
      'card.goto': '🌐 Open offer',

      'paginate.prev': '⏮️',
      'paginate.next': '⏭️',

      // Index map section
      'map.title': '🗺️ Job offers map',
      'map.subtitle': 'Interactive map with number of offers (click a country to see the count)'
      ,
      // About section (index)
      'about.title': '🚀 About eCVjob.pl',
      'about.stats': '📊 Our achievements'
    }
  };

  function getLang() {
    const u = new URL(window.location.href);
    const q = u.searchParams.get('lang');
    if (q) { localStorage.setItem('lang', q); return q; }
    return localStorage.getItem('lang') || (navigator.language || 'pl').toLowerCase().startsWith('pl') ? 'pl' : 'en';
  }

  function t(key) {
    const lang = window.__lang || 'pl';
    return (DICT[lang] && DICT[lang][key]) || (DICT['pl'][key]) || key;
  }

  function apply(doc) {
    const root = doc || document;
    // Simple text content
    root.querySelectorAll('[data-i18n]')?.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      el.textContent = t(key);
    });
    // Attributes
    root.querySelectorAll('[data-i18n-placeholder]')?.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    });
    root.querySelectorAll('[data-i18n-title]')?.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) el.setAttribute('title', t(key));
    });
    // Options with data-i18n-key on option elements
    root.querySelectorAll('option[data-i18n]')?.forEach(opt => {
      const key = opt.getAttribute('data-i18n');
      if (key) opt.textContent = t(key);
    });
    document.documentElement.setAttribute('lang', window.__lang || 'pl');

    // Auto-scan for common static phrases (index.html heavy content)
    try {
      if ((window.__lang || 'pl') === 'en') {
        const map = {
          // Hero/Sections
          'O eCVjob.pl': 'About eCVjob.pl',
          'Nasze Osiągnięcia': 'Our achievements',
          'Mapa ofert pracy': 'Job offers map',
          'Interaktywna mapa pokazująca liczbę ofert z Jooble (kliknij kraj, aby zobaczyć liczbę)': 'Interactive map showing number of offers from Jooble (click a country to see the count)',
          'Interaktywna mapa pokazująca liczbę ofert (kliknij kraj, aby zobaczyć liczbę)': 'Interactive map with number of offers (click a country to see the count)',
          'Zarejestruj się': 'Register',
          'Logowanie': 'Login',
          'Strona główna': 'Home',
          'Baza CV': 'CV Database',
          'Oferty pracy': 'Jobs',
          'Usługi': 'Services',
          'Szkolenia': 'Trainings',
          'Kreator CV': 'CV Builder',
          '📞 Kontakt': '📞 Contact',
          'Rejestracja': 'Register',
          'Dowiedz się więcej': 'Learn more',
          'Sprawdź ofertę': 'See offer',
          'Najczęstsze pytania': 'Frequently Asked Questions',
          'FAQ': 'FAQ',
          'O nas': 'About us',
          'Kontakt': 'Contact',
          // Buttons common
          'Zobacz więcej': 'See more',
          'Pokaż więcej': 'Show more',
          'Czytaj więcej': 'Read more'
        };
        const walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT, null, false);
        const toReplace = [];
        let node;
        while ((node = walker.nextNode())) {
          const orig = (node.nodeValue || '').trim();
          if (!orig) continue;
          if (map[orig]) {
            toReplace.push({ node, text: map[orig] });
          }
        }
        toReplace.forEach(({node, text}) => { node.nodeValue = text; });
      }
    } catch(_) {}
  }

  function setLang(lang) {
    window.__lang = (lang === 'en' ? 'en' : 'pl');
    localStorage.setItem('lang', window.__lang);
    apply();
    // Update toggles styling if present
    document.querySelectorAll('[data-lang-toggle]')?.forEach(btn => {
      const l = btn.getAttribute('data-lang-toggle');
      btn.classList.toggle('active', l === window.__lang);
    });
    // Persist ?lang on internal links
    try {
      document.querySelectorAll('a[href]')?.forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return;
        const u = new URL(href, window.location.origin);
        u.searchParams.set('lang', window.__lang);
        a.setAttribute('href', u.pathname + (u.search || ''));
      });
    } catch(_) {}
  }

  function init() {
    window.__lang = (localStorage.getItem('lang') || getLang());
    apply();
    // Wire global helpers
    window.i18n = { t, setLang, apply, getLang: () => window.__lang };
    try { setLang(window.__lang); } catch(_) {}
  }

  // expose t for inline scripts
  window.i18nInit = init;
  window.t = t;
})();
