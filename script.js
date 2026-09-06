// ==========================================================================
// ALGO DO CÉU · CONFEITARIA ARTESANAL (POR DUDA SOARES)
// Interações: Filtro de Cardápio, Simulador de Bolos & WhatsApp Direct
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Número oficial de WhatsApp da Duda Soares
  const WHATSAPP_PHONE = '5521966495123';

  // 1. Efeito de Scroll no Navbar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Menu Mobile Toggle
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

  // 3. Filtro de Categorias no Cardápio
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  function filterCategory(category) {
    // Atualiza botões
    tabButtons.forEach(btn => {
      if (btn.dataset.target === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Filtra cards com animação suave
    productCards.forEach(card => {
      const cardCat = card.dataset.category;
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 30);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      filterCategory(target);
    });
  });

  // 4. Integração das bolinhas de Stories / Destaques com os filtros
  const highlightItems = document.querySelectorAll('.highlight-item');
  highlightItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const filter = item.dataset.filter;
      if (filter) {
        filterCategory(filter);
      }
    });
  });

  // 5. SIMULADOR DE BOLO INTERATIVO
  const simState = {
    size: 'Aro 15cm (Mini / Bentô)',
    fatias: '8 a 10 fatias',
    basePrice: 80,
    massa: 'Baunilha Tradicional',
    recheio: 'Leite Ninho Trufado',
    extraRecheio: 0,
    decoracao: 'Vintage Pinterest (Babadinhos & Cerejas)'
  };

  function updateSummary() {
    document.getElementById('sumSize').textContent = simState.size;
    document.getElementById('sumFatias').textContent = simState.fatias;
    document.getElementById('sumMassa').textContent = simState.massa;
    document.getElementById('sumRecheio').textContent = simState.recheio;
    document.getElementById('sumDecoracao').textContent = simState.decoracao;

    const total = simState.basePrice + simState.extraRecheio;
    document.getElementById('sumPrice').textContent = `R$ ${total},00`;
  }

  // Listener para botões do simulador
  function bindSimOptionGroup(containerId, stateKey, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const buttons = container.querySelectorAll('.opt-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (callback) {
          callback(btn);
        }
        updateSummary();
      });
    });
  }

  // Passo 1: Tamanho
  bindSimOptionGroup('optSize', 'size', (btn) => {
    simState.size = btn.dataset.name;
    simState.fatias = btn.dataset.fatias;
    simState.basePrice = parseInt(btn.dataset.price, 10) || 80;
  });

  // Passo 2: Massa
  bindSimOptionGroup('optMassa', 'massa', (btn) => {
    simState.massa = btn.dataset.name;
  });

  // Passo 3: Recheio
  bindSimOptionGroup('optRecheio', 'recheio', (btn) => {
    simState.recheio = btn.dataset.name;
    simState.extraRecheio = parseInt(btn.dataset.extra, 10) || 0;
  });

  // Passo 4: Decoração
  bindSimOptionGroup('optDecoracao', 'decoracao', (btn) => {
    simState.decoracao = btn.dataset.name;
  });

  // Botão Enviar Pedido pelo WhatsApp
  const btnSendCustomOrder = document.getElementById('btnSendCustomOrder');
  if (btnSendCustomOrder) {
    btnSendCustomOrder.addEventListener('click', () => {
      const themeInput = document.getElementById('txtTheme').value.trim();
      const dateInput = document.getElementById('txtDate').value.trim();
      
      let dateFormatted = 'A combinar';
      if (dateInput) {
        const parts = dateInput.split('-');
        if (parts.length === 3) {
          dateFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      }

      const total = simState.basePrice + simState.extraRecheio;

      const message = 
`🎂 *NOVA ENCOMENDA PERSONALIZADA · ALGO DO CÉU* 🎂

Olá, Chef Duda! Montei o meu bolo pelo simulador do site e gostaria de confirmar disponibilidade e detalhes:

🍰 *Tamanho:* ${simState.size} (${simState.fatias})
🌾 *Massa:* ${simState.massa}
🍫 *Recheio:* ${simState.recheio}
✨ *Estilo da Decoração:* ${simState.decoracao}
${themeInput ? `🎨 *Tema / Topo / Frase:* ${themeInput}
` : ''}📅 *Data Desejada:* ${dateFormatted}
💰 *Valor Estimado:* R$ ${total},00

Como podemos prosseguir com o pagamento e horário para o meu evento? 🩵`;

      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMsg}`;
      window.open(url, '_blank');
    });
  }

  // 6. Accordion do FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Inicializa o resumo do simulador
  updateSummary();
});
