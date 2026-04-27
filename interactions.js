document.addEventListener('DOMContentLoaded', () => {

  // ── Entrance from survey (reverse transition) ──
  if (sessionStorage.getItem('pageTransition') === 'fromSurvey') {
    sessionStorage.removeItem('pageTransition');
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0;
      background: #e3dfd8;
      z-index: 9999;
      pointer-events: none;
      transition: opacity 0.45s ease 0.05s;
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 500);
    }));
  }

  // ── Entrance animations ──
  const cards = document.querySelectorAll('.agreement-card, .create-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => observer.observe(card));

  // ── Welcome text fade in ──
  const welcome = document.querySelector('.welcome');
  const welcomeSub = document.querySelector('.welcome-sub');
  if (welcome) {
    welcome.style.opacity = '0';
    welcome.style.transform = 'translateY(12px)';
    welcome.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    requestAnimationFrame(() => setTimeout(() => {
      welcome.style.opacity = '1';
      welcome.style.transform = 'translateY(0)';
    }, 60));
  }
  if (welcomeSub) {
    welcomeSub.style.opacity = '0';
    welcomeSub.style.transform = 'translateY(10px)';
    welcomeSub.style.transition = 'opacity 0.5s ease 0.12s, transform 0.5s ease 0.12s';
    requestAnimationFrame(() => setTimeout(() => {
      welcomeSub.style.opacity = '1';
      welcomeSub.style.transform = 'translateY(0)';
    }, 60));
  }

  // ── Continue button — card expands to fill screen then navigates ──
  const continueBtn = document.querySelector('.card-continue-btn');
  if (continueBtn) {
    continueBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      const card = document.querySelector('.agreement-card');
      const rect = card.getBoundingClientRect();

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: ${rect.top}px;
        left: ${rect.left}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        background: #e3dfd8;
        border-radius: 5px;
        z-index: 9999;
        pointer-events: none;
        transition: top 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    left 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    border-radius 0.4s ease,
                    background 0.12s ease 0.05s;
      `;
      document.body.appendChild(overlay);

      // Force reflow, then expand + morph colour to survey bg
      overlay.getBoundingClientRect();
      requestAnimationFrame(() => {
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.borderRadius = '0';
        overlay.style.background = '#F6F3EE'; // survey page background
      });

      // Navigate after expansion + colour transition both finish (~0.18 + 0.35 = 0.53s)
      sessionStorage.setItem('pageTransition', 'fromDashboard');
      setTimeout(() => { window.location.href = 'survey.html'; }, 560);
    });
  }

  // ── Create new agreement card ──
  const createCard = document.querySelector('.create-card');
  if (createCard) {
    createCard.addEventListener('click', () => {
      createCard.style.transform = 'scale(0.98)';
      setTimeout(() => { createCard.style.transform = ''; }, 150);
    });
  }

  // ── Nav active state ──
  document.querySelectorAll('.nav-list li a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-list li').forEach(li => li.classList.remove('active'));
      link.closest('li').classList.add('active');
    });
  });

});
