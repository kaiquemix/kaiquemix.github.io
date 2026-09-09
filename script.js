/**
 * PORTFOLIO - KAIQUE FERREIRA (MARZINO.GG)
 * Interactive Cyberpunk Scripts & Parallax
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation & Header Scroll State
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

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

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

  // 2. Budget Modal ("FAÇA UM ORÇAMENTO") Logic
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

  // 3. Project Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Project Details Modal
  const projectData = {
    "1": {
      title: "8BitDo Ultimate 2 Wireless - Wuchang Edition",
      subtitle: "Hardware Showcase & Experiência Imersiva Gamer",
      image: "assets/project-1.png",
      tags: ["React", "Three.js / 3D Canvas", "TailwindCSS", "Framer Motion"],
      description: "Página de produto com visualização 3D em tempo real, iluminação dinâmica e experiência gamer de alto padrão. Desenvolvido com foco em velocidade de carregamento, responsividade e alto engajamento visual.",
      highlights: [
        "Renderização de produto com microinterações interativas",
        "Performance de 98+ no Google PageSpeed",
        "Layout totalmente adaptado para dispositivos móveis"
      ],
      demoLink: "https://www.8bitdo.com",
      githubLink: "https://github.com"
    },
    "2": {
      title: "Evernight Edition - Honkai: Star Rail Showcase",
      subtitle: "E-Commerce & Edição Especial para Colecionadores",
      image: "assets/project-2.png",
      tags: ["Next.js 14", "TypeScript", "UI/UX Design", "Stripe API"],
      description: "Experiência de e-commerce personalizada para o lançamento da edição especial Honkai: Star Rail. Inclui transições de página ultra-suaves, sistema de pré-venda e design responsivo inspirado na estética do jogo.",
      highlights: [
        "Design System exclusivo criado no Figma",
        "Integração com fluxo de checkout otimizado",
        "Micro-animações e efeitos sonoros opcionais"
      ],
      demoLink: "https://www.8bitdo.com",
      githubLink: "https://github.com"
    },
    "3": {
      title: "Neo-Arcade Cybercafe Portal",
      subtitle: "Plataforma Web Full Stack & Sistema de Gestão",
      image: "assets/project-3.png",
      tags: ["Node.js", "Express", "PostgreSQL", "React", "Socket.io"],
      description: "Plataforma interativa para reservas de estações gamer, rankings de torneios e hub comunitário em tempo real. Possui painel administrativo completo e interface inspirada na cultura cyberpunk.",
      highlights: [
        "Atualizações em tempo real com WebSockets",
        "Autenticação segura JWT e controle de permissões",
        "Dashboard com métricas e analytics em tempo real"
      ],
      demoLink: "https://github.com",
      githubLink: "https://github.com"
    }
  };

  const projectModal = document.getElementById('projectModal');
  const projectModalBody = document.getElementById('projectModalBody');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
  const viewDetailBtns = document.querySelectorAll('.view-details-btn');

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      const proj = projectData[projId];

      if (proj) {
        projectModalBody.innerHTML = `
          <div style="margin-bottom: 1.5rem; border-radius: 12px; overflow: hidden; max-height: 320px;">
            <img src="${proj.image}" alt="${proj.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <span style="color: var(--neon-cyan); font-size: 0.85rem; text-transform: uppercase; font-family: var(--font-heading);">${proj.subtitle}</span>
          <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: #fff; margin: 0.5rem 0 1rem;">${proj.title}</h3>
          <p style="color: #c9c7dc; line-height: 1.6; margin-bottom: 1.5rem;">${proj.description}</p>
          
          <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--neon-pink); margin-bottom: 0.75rem;">Destaques do Projeto:</h4>
          <ul style="list-style: none; padding: 0; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
            ${proj.highlights.map(h => `<li style="color: #e0dff2; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-check" style="color: var(--neon-cyan);"></i> ${h}</li>`).join('')}
          </ul>

          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
            ${proj.tags.map(t => `<span style="font-size: 0.8rem; padding: 0.25rem 0.75rem; border-radius: 6px; background: rgba(0, 255, 242, 0.15); border: 1px solid var(--neon-cyan); color: #fff;">${t}</span>`).join('')}
          </div>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="${proj.demoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Ver Projeto Online
            </a>
            <a href="${proj.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              <i class="fa-brands fa-github"></i> Repositório
            </a>
          </div>
        `;
        projectModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

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

  // 5. Interactive 3D Card Tilt Effect on Hover (Desktop)
  if (window.innerWidth > 992) {
    const cards = document.querySelectorAll('.service-card, .project-card');
    cards.forEach(card => {
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

  // Carousel Dots Click Handler
  const dots = document.querySelectorAll('.carousel-dots-wrapper .dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
});
