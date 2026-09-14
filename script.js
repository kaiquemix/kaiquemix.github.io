/**
 * PORTFOLIO - KAIQUE FERREIRA (MARZINO.GG)
 * Interactive Cyberpunk Scripts & Parallax
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Navigation & Header Scroll State
  // ==========================================================================
  const header = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow and backdrop effect
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Tracking
    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current && sections.length > 1) {
      navLinkItems.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.classList.remove('active');
          if (href === `#${current}`) {
            link.classList.add('active');
          }
        }
      });
    }

    // Parallax background shifts (Figma request: "tentar fazer um paralax nas imagens")
    const scrolled = window.pageYOffset;
    const heroBg = document.getElementById('heroBg');
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
    }
  });

  // Mobile Menu Toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ==========================================================================
  // 2. Budget Modal ("FAÇA UM ORÇAMENTO") Logic
  // ==========================================================================
  const budgetModal = document.getElementById('budgetModal');
  const openBudgetBtns = document.querySelectorAll('.open-budget-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const budgetForm = document.getElementById('budgetForm');

  openBudgetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      budgetModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      budgetModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (budgetModal) {
    budgetModal.addEventListener('click', (e) => {
      if (e.target === budgetModal) {
        budgetModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // WhatsApp Form Submit Handler
  if (budgetForm) {
    budgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('clientName').value.trim();
      const whatsapp = document.getElementById('clientWhatsapp').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const service = document.getElementById('serviceType').value;
      const details = document.getElementById('projectDetails').value.trim();

      // Your WhatsApp number
      const myPhoneNumber = "5527997330865"; 

      let message = `*Novo Pedido de Orçamento - Portfólio*\n\n`;
      message += `*Nome/Empresa:* ${name}\n`;
      message += `*WhatsApp:* ${whatsapp}\n`;
      message += `*E-mail:* ${email}\n`;
      message += `*Serviço de Interesse:* ${service}\n`;
      if (details) {
        message += `*Detalhes do Projeto:* ${details}\n`;
      }
      message += `\n_Mensagem enviada através do portfólio marzino.gg_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${myPhoneNumber}?text=${encodedMessage}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Close modal and reset
      budgetModal.classList.remove('open');
      document.body.style.overflow = '';
      budgetForm.reset();
    });
  }

  // ==========================================================================
  // 3. Projects Management (Fetching from projects.json)
  // ==========================================================================
  const projectsGrid = document.getElementById('projectsGrid');
  const projectModal = document.getElementById('projectModal');
  const projectModalBody = document.getElementById('projectModalBody');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectsLoadMore = document.getElementById('projectsLoadMore');
  const projectsLoadStatus = document.getElementById('projectsLoadStatus');
  const carouselDotsWrapper = document.querySelector('.carousel-dots-wrapper');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const isProjectsPage = Boolean(projectsLoadMore);
  const isHomeProjectsCarousel = !isProjectsPage && Boolean(carouselDotsWrapper);

  let projectsDataStore = {};
  let allProjects = [];
  let filteredProjects = [];
  let renderedProjectsCount = 0;
  const projectsPerPage = 12;
  let projectsObserver;
  let homeCarouselProjects = [];
  let homeCarouselPage = 0;
  let homeCarouselDragStartX = 0;
  let homeCarouselDragDistance = 0;
  let homeCarouselIsDragging = false;
  let homeCarouselDidDrag = false;

  function createProjectCard(proj, index) {
      const delay = ((index % projectsPerPage) + 1) * 100;
      const card = document.createElement('article');
      card.className = 'project-card glass-cyber';
      card.setAttribute('data-category', proj.category || 'web');
      card.setAttribute('data-project', proj.id);
      card.setAttribute('data-aos', 'fade-up');
      card.setAttribute('data-aos-delay', `${delay}`);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Ver detalhes do projeto ${proj.name || proj.title}`);

      const tagsHtml = (proj.tags || []).map(tag => `<span>${tag}</span>`).join('');

      card.innerHTML = `
        <div class="project-img-wrapper">
          <img src="${proj.image}" alt="${proj.name || proj.title}" loading="lazy">
          <div class="project-img-overlay">
            <div class="project-quick-links">
              <span class="quick-btn" aria-hidden="true">
                <i class="fa-solid fa-eye"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="project-info">
          <span class="project-category">${proj.categoryLabel || 'Projeto'}</span>
          <h3 class="project-name">${proj.name || proj.title}</h3>
          <p class="project-summary">${proj.summary || ''}</p>
          <div class="project-tags">
            ${tagsHtml}
          </div>
        </div>
      `;

      return card;
  }

  function updateProjectsLoadStatus() {
    if (!projectsLoadMore || !projectsLoadStatus) return;

    const total = filteredProjects.length;
    projectsLoadStatus.textContent = total
      ? `Mostrando ${renderedProjectsCount} de ${total} projetos`
      : 'Nenhum projeto encontrado nesta categoria.';
    projectsLoadMore.hidden = renderedProjectsCount >= total;
  }

  function renderNextProjects() {
    if (!projectsGrid || renderedProjectsCount >= filteredProjects.length) return;

    const nextProjects = filteredProjects.slice(renderedProjectsCount, renderedProjectsCount + projectsPerPage);
    const fragment = document.createDocumentFragment();
    nextProjects.forEach((proj, index) => fragment.appendChild(createProjectCard(proj, renderedProjectsCount + index)));
    projectsGrid.appendChild(fragment);
    renderedProjectsCount += nextProjects.length;

    attachProjectEventListeners();
    attachTiltEffect();
    updateProjectsLoadStatus();
  }

  // Filtra a lista completa em memória antes de paginar os cards exibidos.
  function renderProjects(projects) {
    if (!projectsGrid) return;

    filteredProjects = projects;
    renderedProjectsCount = 0;
    projectsGrid.innerHTML = '';
    projectsDataStore = Object.fromEntries(allProjects.map(project => [project.id, project]));
    renderNextProjects();
  }

  function getHomeCarouselCardsPerPage() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function setHomeCarouselPage(page) {
    if (!projectsGrid || !carouselDotsWrapper) return;

    const cardsPerPage = getHomeCarouselCardsPerPage();
    const pageCount = Math.max(1, Math.ceil(homeCarouselProjects.length / cardsPerPage));
    homeCarouselPage = Math.min(Math.max(page, 0), pageCount - 1);
    const firstCard = projectsGrid.querySelector('.project-card');
    const gap = Number.parseFloat(window.getComputedStyle(projectsGrid).columnGap) || 0;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    const translate = homeCarouselPage * cardsPerPage * (cardWidth + gap);
    projectsGrid.style.setProperty('--home-carousel-translate', `-${translate}px`);
    if (carouselPrev) carouselPrev.disabled = homeCarouselPage === 0;
    if (carouselNext) carouselNext.disabled = homeCarouselPage === pageCount - 1;

    carouselDotsWrapper.innerHTML = '';
    for (let index = 0; index < pageCount; index += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `dot${index === homeCarouselPage ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Mostrar projetos ${index * cardsPerPage + 1} a ${Math.min((index + 1) * cardsPerPage, homeCarouselProjects.length)}`);
      dot.setAttribute('aria-current', index === homeCarouselPage ? 'true' : 'false');
      dot.addEventListener('click', () => setHomeCarouselPage(index));
      carouselDotsWrapper.appendChild(dot);
    }
  }

  // A home mostra uma seleção de até 12 projetos em páginas horizontais de 3 cards.
  function renderHomeCarousel(projects) {
    if (!projectsGrid) return;

    homeCarouselProjects = projects.slice(0, 12);
    homeCarouselPage = 0;
    projectsDataStore = Object.fromEntries(allProjects.map(project => [project.id, project]));
    projectsGrid.classList.add('home-projects-carousel');
    projectsGrid.innerHTML = '';

    const fragment = document.createDocumentFragment();
    homeCarouselProjects.forEach((project, index) => fragment.appendChild(createProjectCard(project, index)));
    projectsGrid.appendChild(fragment);
    attachProjectEventListeners();
    setHomeCarouselPage(0);
  }

  function changeHomeCarouselPage(direction) {
    setHomeCarouselPage(homeCarouselPage + direction);
  }

  if (carouselPrev) carouselPrev.addEventListener('click', () => changeHomeCarouselPage(-1));
  if (carouselNext) carouselNext.addEventListener('click', () => changeHomeCarouselPage(1));

  if (isHomeProjectsCarousel && projectsGrid) {
    let homeCarouselPointerId = null;

    projectsGrid.addEventListener('pointerdown', (event) => {
      if (event.target.closest('a, button')) return;
      homeCarouselDragStartX = event.clientX;
      homeCarouselDragDistance = 0;
      homeCarouselIsDragging = true;
      homeCarouselDidDrag = false;
      homeCarouselPointerId = event.pointerId;
      projectsGrid.classList.add('is-dragging');
      // NOTE: Do NOT call setPointerCapture here — it prevents click
      // events from firing on child elements. Capture is deferred until
      // actual drag movement is detected in pointermove.
    });

    projectsGrid.addEventListener('pointermove', (event) => {
      if (!homeCarouselIsDragging) return;
      homeCarouselDragDistance = event.clientX - homeCarouselDragStartX;
      if (Math.abs(homeCarouselDragDistance) > 8) {
        homeCarouselDidDrag = true;
        // Capture pointer only after real drag movement is detected,
        // so simple clicks on cards are never intercepted.
        if (homeCarouselPointerId !== null && !projectsGrid.hasPointerCapture(homeCarouselPointerId)) {
          projectsGrid.setPointerCapture(homeCarouselPointerId);
        }
      }
      projectsGrid.style.setProperty('--home-carousel-drag', `${homeCarouselDragDistance}px`);
    });

    const finishHomeCarouselDrag = (event) => {
      if (!homeCarouselIsDragging) return;
      homeCarouselIsDragging = false;
      homeCarouselPointerId = null;
      projectsGrid.classList.remove('is-dragging');
      projectsGrid.style.setProperty('--home-carousel-drag', '0px');
      if (projectsGrid.hasPointerCapture(event.pointerId)) projectsGrid.releasePointerCapture(event.pointerId);

      const firstCard = projectsGrid.querySelector('.project-card');
      const threshold = Math.max(50, (firstCard?.getBoundingClientRect().width || 0) * 0.15);
      if (Math.abs(homeCarouselDragDistance) >= threshold) {
        changeHomeCarouselPage(homeCarouselDragDistance < 0 ? 1 : -1);
      }
      window.setTimeout(() => {
        homeCarouselDidDrag = false;
      }, 0);
    };

    projectsGrid.addEventListener('pointerup', finishHomeCarouselDrag);
    projectsGrid.addEventListener('pointercancel', finishHomeCarouselDrag);
    projectsGrid.addEventListener('click', (event) => {
      if (!homeCarouselDidDrag) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      homeCarouselDidDrag = false;
    }, true);
  }

  function setupProjectsObserver() {
    if (!projectsLoadMore || !('IntersectionObserver' in window)) return;

    projectsObserver = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        renderNextProjects();
      }
    }, { rootMargin: '300px 0px' });
    projectsObserver.observe(projectsLoadMore);
  }

  // Open Project Details Modal
  function openProjectModal(projId) {
    const proj = projectsDataStore[projId];
    if (!proj || !projectModalBody) return;

    const highlightsHtml = (proj.highlights || [])
      .map(h => `<li style="color: #e0dff2; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-check" style="color: var(--neon-cyan);"></i> ${h}</li>`)
      .join('');

    const tagsHtml = (proj.tags || [])
      .map(t => `<span style="font-size: 0.8rem; padding: 0.25rem 0.75rem; border-radius: 6px; background: rgba(0, 255, 242, 0.15); border: 1px solid var(--neon-cyan); color: #fff;">${t}</span>`)
      .join('');

    projectModalBody.innerHTML = `
      <div style="margin-bottom: 1.5rem; border-radius: 12px; overflow: hidden; max-height: 320px;">
        <img src="${proj.image}" alt="${proj.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <span style="color: var(--neon-cyan); font-size: 0.85rem; text-transform: uppercase; font-family: var(--font-heading);">${proj.subtitle || ''}</span>
      <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: #fff; margin: 0.5rem 0 1rem;">${proj.title || proj.name}</h3>
      <p style="color: #c9c7dc; line-height: 1.6; margin-bottom: 1.5rem;">${proj.description || proj.summary || ''}</p>
      
      ${highlightsHtml ? `
        <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--neon-pink); margin-bottom: 0.75rem;">Destaques do Projeto:</h4>
        <ul style="list-style: none; padding: 0; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
          ${highlightsHtml}
        </ul>
      ` : ''}

      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
        ${tagsHtml}
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${proj.demoLink ? `
          <a href="${proj.demoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver Projeto Online
          </a>
        ` : ''}
        ${proj.githubLink ? `
          <a href="${proj.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <i class="fa-brands fa-github"></i> Repositório
          </a>
        ` : ''}
      </div>
    `;

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Attach modal click handlers
  function attachProjectEventListeners() {
    const projectCards = document.querySelectorAll('.project-card[data-project]:not([data-details-bound])');
    projectCards.forEach(card => {
      card.setAttribute('data-details-bound', 'true');
      card.addEventListener('click', () => openProjectModal(card.getAttribute('data-project')));
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openProjectModal(card.getAttribute('data-project'));
      });
    });
  }

  // Fetch projects from JSON file
  async function loadProjects() {
    try {
      const response = await fetch('./projects.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('projects.json precisa conter uma lista de projetos.');
      }
      allProjects = data;
      if (isProjectsPage) {
        renderProjects(allProjects);
        setupProjectsObserver();
      } else if (isHomeProjectsCarousel) {
        renderHomeCarousel(allProjects);
      }
    } catch (error) {
      console.error('Não foi possível carregar projects.json:', error);
      if (projectsGrid) {
        projectsGrid.innerHTML = '<p class="projects-load-error">Não foi possível carregar os projetos. Abra o site por um servidor local e tente novamente.</p>';
      }
      if (projectsLoadMore) projectsLoadMore.hidden = true;
    }
  }

  // Initialize projects loading
  loadProjects();

  // Close project modal logic
  if (closeProjectModalBtn) {
    closeProjectModalBtn.addEventListener('click', () => {
      projectModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================================================
  // 4. Project Filters
  // ==========================================================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const projectsForFilter = filter === 'all'
        ? allProjects
        : allProjects.filter(project => (project.category || '').trim().split(/\s+/).includes(filter));
      if (isProjectsPage) {
        renderProjects(projectsForFilter);
      } else if (isHomeProjectsCarousel) {
        renderHomeCarousel(projectsForFilter);
      }
    });
  });

  // ==========================================================================
  // 5. Interactive 3D Card Tilt Effect on Hover (Desktop)
  // ==========================================================================
  function attachTiltEffect() {
    if (window.innerWidth <= 992) return;

    const cards = document.querySelectorAll('.service-card, .project-card');
    cards.forEach(card => {
      if (card.closest('.home-projects-carousel')) return;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  attachTiltEffect();

  let homeCarouselResizeTimer;
  window.addEventListener('resize', () => {
    if (!isHomeProjectsCarousel || !homeCarouselProjects.length) return;
    window.clearTimeout(homeCarouselResizeTimer);
    homeCarouselResizeTimer = window.setTimeout(() => setHomeCarouselPage(homeCarouselPage), 150);
  });
});
