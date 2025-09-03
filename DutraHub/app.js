// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", function () {
  // Loader inicial - CORREÇÃO PRINCIPAL
  const loader = document.getElementById("loader");

  // Função para remover o loader
  function removeLoader() {
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
        document.body.classList.add("loaded");
      }, 500);
    }
  }

  // Remove o loader após 2 segundos OU quando a página carregar (o que vier primeiro)
  const loaderTimeout = setTimeout(removeLoader, 2000);

  // Também tenta remover quando tudo carrega
  window.addEventListener("load", () => {
    clearTimeout(loaderTimeout);
    setTimeout(removeLoader, 500);
  });

  // Fallback: se algo der errado, remove após 3 segundos
  setTimeout(() => {
    if (loader && loader.style.display !== "none") {
      removeLoader();
    }
  }, 3000);

  // Partículas flutuantes
  function createParticles() {
    const particlesContainer = document.getElementById("particles");
    if (!particlesContainer || window.innerWidth <= 768) return;

    setInterval(() => {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particle.style.left = Math.random() * window.innerWidth + "px";
      particle.style.animationDuration = Math.random() * 3 + 3 + "s";

      particlesContainer.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, 6000);
    }, 300);
  }

  createParticles();

  // Indicador de scroll
  function updateScrollIndicator() {
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (!scrollIndicator) return;

    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;

    scrollIndicator.style.width = scrolled + "%";
  }

  window.addEventListener("scroll", updateScrollIndicator);

  // Menu Mobile Toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Fecha o menu mobile quando clica em um link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // Scroll suave para navegação
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Header com efeito de scroll
  const header = document.querySelector(".header");

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 100) {
      header.classList.add("scrolled");
      header.style.background = "rgba(13, 13, 13, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.3)";
    } else {
      header.classList.remove("scrolled");
      header.style.background = "rgba(13, 13, 13, 0.95)";
      header.style.boxShadow = "none";
    }
  }

  window.addEventListener("scroll", updateHeader);

  // Sistema de observação de elementos para animações
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // Animação especial para service cards
        if (entry.target.classList.contains("service-card")) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      }
    });
  }, observerOptions);

  // Observa elementos para animação
  document
    .querySelectorAll(".service-card, .education-item, .about-text p")
    .forEach((el) => {
      observer.observe(el);
    });

  // Sistema de notificações
  function showNotification(message, type = "info") {
    // Remove notificação existente
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Cria nova notificação
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Adiciona ao DOM
    document.body.appendChild(notification);

    // Evento de fechar
    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      });
    }

    // Auto remove após 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideOut 0.3s ease";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  }

  // Função para validar e-mail
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Highlight da navegação ativa
  function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionHeight = section.clientHeight;

      if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);

  // Parallax suave para o hero
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    if (hero && window.innerWidth > 768) {
      hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }

  window.addEventListener("scroll", updateParallax);

  // Efeito de digitação no título
  function typeWriter(element, text, speed = 100) {
    if (!element || window.innerWidth <= 768) return;

    let i = 0;
    element.innerHTML = "";
    element.style.borderRight = "3px solid var(--azul-claro)";

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          element.style.borderRight = "none";
        }, 1000);
      }
    }
    type();
  }

  // Ativa o efeito de digitação após um pequeno delay
  setTimeout(() => {
    const heroTitle = document.querySelector(".typewriter");
    if (heroTitle) {
      const originalText = heroTitle.textContent;
      typeWriter(heroTitle, originalText, 80);
    }
  }, 2500); // Aumentei o delay para garantir que o loader já foi removido

  // Animação de entrada suave para elementos
  setTimeout(() => {
    const fadeElements = document.querySelectorAll(
      ".subtitle, .description, .hero-buttons"
    );
    fadeElements.forEach((el, index) => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";

        setTimeout(() => {
          el.style.transition = "opacity 1s ease, transform 1s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, index * 200);
      }
    });
  }, 2000);

  // Efeito de hover melhorado nos botões
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.05)";
    });

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Smooth reveal para textos da seção about
  const aboutTexts = document.querySelectorAll(".about-text p");

  const textObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 200);
        }
      });
    },
    { threshold: 0.5 }
  );

  aboutTexts.forEach((text) => {
    textObserver.observe(text);
  });

  // Performance: desabilita alguns efeitos em dispositivos com baixa performance
  const isLowPerformanceDevice = () => {
    return (
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  };

  if (isLowPerformanceDevice()) {
    // Desabilita animações pesadas
    document.documentElement.style.setProperty("--animation-duration", "0.3s");

    // Remove partículas
    const particles = document.getElementById("particles");
    if (particles) particles.style.display = "none";

    // Simplifica animações de hover
    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("touchstart", function () {
        this.style.transform = "scale(1.02)";
      });

      card.addEventListener("touchend", function () {
        this.style.transform = "scale(1)";
      });
    });
  }

  // Log de inicialização
  console.log("🚀 Dutra Hub carregado com sucesso!");
  console.log("✨ Efeitos visuais ativados!");
});
