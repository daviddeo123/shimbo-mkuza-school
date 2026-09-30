const header = document.querySelector('.site-header');
const nav = document.querySelector('.main-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.main-nav a');
const revealItems = document.querySelectorAll('.reveal');
const stats = document.querySelectorAll('.stat-number');
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const siteSettingsKey = 'shimbo-school-settings';
const defaultContact = { phone: '', email: '', location: '' };

const loadSiteSettings = () => {
  const savedSettings = localStorage.getItem(siteSettingsKey);
  if (!savedSettings) return;

  const settings = JSON.parse(savedSettings);
  const contact = { ...defaultContact, ...settings.contact };
  stats.forEach((stat) => {
    const setting = stat.dataset.setting;
    if (setting && Number.isInteger(settings[setting]) && settings[setting] >= 0) {
      stat.dataset.target = settings[setting];
    }
  });

  const pathwaysContainer = document.querySelector('#academic-pathways');
  if (pathwaysContainer && Array.isArray(settings.pathways)) {
    pathwaysContainer.replaceChildren();
    settings.pathways.forEach((pathway) => {
      const card = document.createElement('div');
      const label = document.createElement('span');
      card.className = 'subject-card reveal is-visible';
      label.textContent = pathway;
      card.append(label);
      pathwaysContainer.append(card);
    });
  }

  document.querySelectorAll('[data-contact-value]').forEach((element) => {
    const key = element.dataset.contactValue;
    const value = contact[key];
    if (typeof value === 'string' && value.trim()) {
      element.textContent = value;
    }
  });

  document.querySelectorAll('[data-contact-link]').forEach((element) => {
    const key = element.dataset.contactLink;
    const value = contact[key];
    if (typeof value !== 'string' || !value.trim()) return;
    element.href = key === 'email' ? `mailto:${value}` : `tel:${value.replace(/[^\d+]/g, '')}`;
  });
};

loadSiteSettings();

const setHeaderState = () => {
  if (window.scrollY > 30) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

const toggleNavigation = () => {
  nav.classList.toggle('open');
  const expanded = nav.classList.contains('open');
  navToggle.setAttribute('aria-expanded', String(expanded));
  navToggle.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
};

if (navToggle) {
  navToggle.addEventListener('click', toggleNavigation);
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    }
  });
});

window.addEventListener('scroll', setHeaderState);
setHeaderState();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const animateCounters = () => {
  stats.forEach((stat) => {
    const target = Number(stat.dataset.target);
    const duration = 1400;
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const currentValue = Math.round(target * eased);
      stat.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        stat.textContent = target;
      }
    };

    requestAnimationFrame(updateNumber);
  });
};

const statsSection = document.querySelector('.stats');
if (statsSection) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  counterObserver.observe(statsSection);
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.textContent.trim();

    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

    galleryItems.forEach((item) => {
      const matches = selected === 'All' || item.classList.contains(selected.toLowerCase());
      item.style.display = matches ? 'block' : 'none';
    });
  });
});
