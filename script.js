// ==========================================================================
// ALGO DO CÉU · CONFEITARIA ARTESANAL (POR DUDA SOARES)
// Interações: Carrossel Infinito, Lightbox de Fotos, Acordeão FAQ & WhatsApp
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '5521966495123';

  // 1. Efeito de Scroll no Navbar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Menu Mobile Drawer com Backdrop e Bloqueio de Scroll
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');

  const closeMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (mobileToggle) {
      const spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  };

  const openMenu = () => {
    if (!navMenu) return;
    navMenu.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (mobileToggle) {
      const spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    }
  };

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMenu);
    }

    // Fechar ao clicar em qualquer link da gaveta
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // 3. Duplicação de Cards para o Carrossel Marquee Infinito & Pausa por Toque
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    const cards = Array.from(marqueeTrack.children);
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marqueeTrack.appendChild(clone);
    });

    // Pausar ao tocar no celular para facilitar visualização
    marqueeTrack.addEventListener('touchstart', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    }, { passive: true });

    marqueeTrack.addEventListener('touchend', () => {
      setTimeout(() => {
        marqueeTrack.style.animationPlayState = 'running';
      }, 1500);
    }, { passive: true });
  }

  // 4. Modal Lightbox para Fotos Ampliadas (Sem Preços)
  const lightbox = document.getElementById('cakeLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxServes = document.getElementById('lightboxServes');
  const lightboxOrderBtn = document.getElementById('lightboxOrderBtn');
  const closeLightbox = document.getElementById('closeLightbox');

  document.addEventListener('click', (e) => {
    // 1) Clique em Card de Feedback Real
    const feedbackCard = e.target.closest('.feedback-card');
    if (feedbackCard) {
      e.preventDefault();
      e.stopPropagation();

      const img = feedbackCard.dataset.img;
      const title = feedbackCard.dataset.title || 'Depoimento de Cliente';
      const desc = feedbackCard.dataset.desc || '';

      if (lightboxImg) {
        lightboxImg.src = img;
        lightboxImg.alt = title;
      }
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = `"${desc}"`;
      if (lightboxServes) lightboxServes.textContent = 'Feedback 100% Real de Cliente';

      if (lightboxOrderBtn) {
        const orderMsg = encodeURIComponent(`Olá Duda! Vi os depoimentos e bolos no site da Algo do Céu e gostaria de encomendar para a minha festa! 🩵🍰`);
        lightboxOrderBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${orderMsg}`;
      }

      if (lightbox) {
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
      }
      return;
    }

    // 2) Clique na Lupa OU no Card de Bolo (exceto botão de WhatsApp)
    const cakeCard = e.target.closest('.cake-slide-card');
    if (cakeCard && !e.target.closest('.btn-order-whatsapp')) {
      e.preventDefault();
      e.stopPropagation();

      const zoomBtn = cakeCard.querySelector('.zoom-btn');
      if (!zoomBtn) return;

      const img = zoomBtn.dataset.img;
      const title = zoomBtn.dataset.title;
      const desc = zoomBtn.dataset.desc;
      const serves = zoomBtn.dataset.serves || 'Personalizado sob medida';

      if (lightboxImg) {
        lightboxImg.src = img;
        lightboxImg.alt = title;
      }
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;
      if (lightboxServes) lightboxServes.textContent = `Rendimento: ${serves}`;

      if (lightboxOrderBtn) {
        const orderMsg = encodeURIComponent(`Olá Duda! Amei o modelo *${title}* que vi no site e gostaria de encomendar para o meu evento! 🩵🍰`);
        lightboxOrderBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${orderMsg}`;
      }

      if (lightbox) {
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    }
  });

  if (closeLightbox && lightbox) {
    closeLightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
      }
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // 5. Acordeão do FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
});
