/**
 * Akash R Jadhav Portfolio - Interactive Engine
 * Handles Canvas Animation, Typewriter, Role Lens Filter,
 * Stat Counters, 3D Card Tilt, and Smooth Interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Interactive Ambient Particle Network Canvas
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 70);
    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.radius = Math.random() * 1.8 + 0.8;
        this.color = Math.random() > 0.4 ? 'rgba(0, 245, 212,' : 'rgba(168, 85, 247,';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse avoidance / interactive pull
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + ' 0.7)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            const alpha = (1 - dist / 115) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --------------------------------------------------------------------------
  // 2. Typewriter Effect
  // --------------------------------------------------------------------------
  const typewriterElem = document.getElementById('typewriter');
  if (typewriterElem) {
    const roles = [
      'High-Performance Distributed Systems',
      'Serverless RAG & Agentic AI (FastMCP)',
      'Enterprise Telemetry (OpenTelemetry & Grafana)',
      'Federated Learning (Flower & PyTorch)',
      'Reliable Cloud Architectures (AWS & OCI)'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElem.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typewriterElem.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 85;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 1900; // Pause when full word is typed
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }
    type();
  }

  // --------------------------------------------------------------------------
  // 3. Dynamic "Role Lens" Persona Switcher
  // --------------------------------------------------------------------------
  const lensButtons = document.querySelectorAll('.lens-btn');
  const lensItems = document.querySelectorAll('[data-lens-item]');

  lensButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      lensButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedLens = btn.getAttribute('data-lens');

      lensItems.forEach((item) => {
        const itemCategories = item.getAttribute('data-lens-item') || '';

        if (selectedLens === 'all') {
          item.classList.remove('lens-dimmed', 'lens-highlighted');
        } else if (itemCategories.includes(selectedLens)) {
          item.classList.remove('lens-dimmed');
          item.classList.add('lens-highlighted');
        } else {
          item.classList.remove('lens-highlighted');
          item.classList.add('lens-dimmed');
        }
      });

      showToast(`Lens switched to: ${btn.textContent.trim()}`);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Project Category Filtering
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (filter === 'all' || cardCategory.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. 3D Tilt Effect on Profile Card
  // --------------------------------------------------------------------------
  const tiltCard = document.getElementById('tilt-card');
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // --------------------------------------------------------------------------
  // 6. Animated Metric Number Counters
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let current = 0;
            const duration = 1600;
            const stepTime = 30;
            const increment = target / (duration / stepTime);

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
              } else {
                stat.textContent = Math.floor(current);
              }
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsBox = document.querySelector('.code-stats-box');
  if (statsBox) {
    observer.observe(statsBox);
  }

  // --------------------------------------------------------------------------
  // 7. Navbar Scroll Spy & Scrolled Class
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Navigation Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
      const icon = mobileToggle.querySelector('i');
      if (navLinksContainer.classList.contains('mobile-open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close on clicking link
    navLinks.forEach((l) => {
      l.addEventListener('click', () => {
        navLinksContainer.classList.remove('mobile-open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. Clipboard Copy Functionality & Toast Notification
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  const toast = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #00f5d4;"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('akashrj090@gmail.com').then(() => {
        showToast('Email (akashrj090@gmail.com) copied to clipboard!');
      });
    });
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('+91 7676265783').then(() => {
        showToast('Phone number (+91 7676265783) copied to clipboard!');
      });
    });
  }
});
