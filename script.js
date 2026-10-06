// ==========================================================================
// ALGO DO CÉU · CONFEITARIA ARTESANAL (POR DUDA SOARES)
// Interações: Filtros de Criações, Lightbox de Fotos, Acordeão FAQ & WhatsApp
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '5521966495123';

  // 1. Efeito de Scroll no Navbar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Menu Mobile Drawer
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const spans = mobileToggle.querySelectorAll('span');
      if (navMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Fechar ao clicar em um link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // 3. Filtros do Cardápio / Vitrine
  const filterPills = document.querySelectorAll('.filter-pill');
  const cakeCards = document.querySelectorAll('.cake-item-card');

  function filterCakes(category) {
    // Atualiza botões
    filterPills.forEach(pill => {
      if (pill.dataset.target === category) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Filtra cards com transição suave
    cakeCards.forEach(card => {
      const cardCat = card.dataset.category;
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 20);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterCakes(pill.dataset.target);
    });
  });

  // Integração com os Destaques (Stories)
  const highlightCards = document.querySelectorAll('.highlight-card');
  highlightCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetFilter = card.dataset.filter;
      if (targetFilter) {
        filterCakes(targetFilter);
      }
    });
  });

  // 4. Modal Lightbox para Detalhes e Fotos dos Bolos (Sem Preços)
  const lightbox = document.getElementById('cakeLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxServes = document.getElementById('lightboxServes');
  const lightboxOrderBtn = document.getElementById('lightboxOrderBtn');
  const closeLightbox = document.getElementById('closeLightbox');

  document.querySelectorAll('.zoom-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = btn.dataset.img;
      const title = btn.dataset.title;
      const desc = btn.dataset.desc;
      const serves = btn.dataset.serves || 'Sob medida';

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
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
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
