(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];

  const setMenu = (open) => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('.sr-only').textContent = open ? 'Close navigation' : 'Open navigation';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const assignmentCards = [...document.querySelectorAll('[data-category]')];
  const filterStatus = document.querySelector('#filter-status');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });

      let visibleCount = 0;
      assignmentCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.hidden = !show;
        if (show) visibleCount += 1;
      });

      if (filterStatus) {
        const label = button.childNodes[0]?.textContent?.trim().toLowerCase() || filter;
        filterStatus.textContent = `Showing ${visibleCount} ${label === 'all' ? 'experience' : label} ${visibleCount === 1 ? 'entry' : 'entries'}.`;
      }
    });
  });

  const copyButton = document.querySelector('[data-copy-email]');
  const copyStatus = document.querySelector('[data-copy-status]');
  const emailAddress = 'coachmani1983@gmail.com';

  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      if (copyStatus) copyStatus.textContent = 'Email address copied.';
    } catch {
      if (copyStatus) copyStatus.textContent = `Copy unavailable. Use ${emailAddress}`;
    }
  });

  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');

  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const replyEmail = String(data.get('email') || '').trim();
    const organisation = String(data.get('organisation') || '').trim();
    const message = String(data.get('message') || '').trim();
    const emailInput = contactForm.querySelector('#email');

    if (!name || !message || !replyEmail || !emailInput?.checkValidity()) {
      if (formStatus) formStatus.textContent = 'Please add your name, a valid email address and a message.';
      if (!name) contactForm.querySelector('#name')?.focus();
      else if (!replyEmail || !emailInput?.checkValidity()) emailInput?.focus();
      else contactForm.querySelector('#message')?.focus();
      return;
    }

    if (formStatus) formStatus.textContent = 'Opening an email draft. Your form details remain here.';
    const subject = `Coaching enquiry${organisation ? ` — ${organisation}` : ''}`;
    const body = [
      `Hello Manikantan,`,
      '',
      message,
      '',
      `Regards,`,
      name,
      organisation,
      replyEmail
    ].filter((line, index, lines) => line !== '' || lines[index - 1] !== '').join('\n');

    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  document.querySelector('[data-year]').textContent = String(new Date().getFullYear());

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reveal-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -45px' });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle('is-current', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-25% 0px -68% 0px' });

    document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));
  }
})();
