/**
 * Bengal Bits & Robotorial Platform
 * Dynamic Animation Engine, Interactive Canvas & Real-Data UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initScrollReveal();
  initNavbarScroll();
  initShowcaseToggle();
  initModelSpecSwitcher();
  initTelemetryGauge();
  initMobileNav();
  initQuickActions();
  initContactForm();
});

/* ==========================================================================
   1. Dynamic Ambient Background: Interactive Circuit & Geometric Nodes
   Reacts softly to mouse movements with connected proximity lines
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize, { passive: true });

  const mouse = { x: -1000, y: -1000, radius: 130 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
  const particles = [];

  class NodeParticle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.baseRadius = Math.random() * 2 + 1.2;
      this.radius = this.baseRadius;
      this.isOrange = Math.random() > 0.72;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 1.5;
        this.y -= Math.sin(angle) * force * 1.5;
        this.radius = this.baseRadius * 1.4;
      } else {
        this.radius = this.baseRadius;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isOrange
        ? 'rgba(255, 90, 0, 0.65)'
        : 'rgba(156, 163, 175, 0.45)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new NodeParticle());
  }

  const connectLines = () => {
    const maxDist = 95;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.16;
          ctx.strokeStyle = particles[i].isOrange || particles[j].isOrange
            ? `rgba(255, 90, 0, ${alpha * 1.5})`
            : `rgba(209, 213, 219, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectLines();
    requestAnimationFrame(render);
  };

  render();
}

/* ==========================================================================
   2. Scroll Reveal Animations (Smooth Staggered Entrance)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   3. Navbar Scroll Behavior & Active Spy
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.site-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const sections = document.querySelectorAll('section[id], div[id="robotorial-hub"], div[id="projects"], div[id="hero"]');
  const navLinks = document.querySelectorAll('.nav-item-link');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('text-black', 'bg-gray-100');
            } else {
              link.classList.remove('text-black', 'bg-gray-100');
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((sec) => spyObserver.observe(sec));
}

/* ==========================================================================
   4. Hero Robot Showcase / Filter Pills (Style, Future, Tech, Overview)
   ========================================================================== */
function initShowcaseToggle() {
  const filterPills = document.querySelectorAll('.filter-tag-pill');
  const heroRobotImg = document.querySelector('.showcase-surface img');

  if (!filterPills.length) return;

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      if (heroRobotImg) {
        heroRobotImg.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        heroRobotImg.style.transform = 'scale(0.96)';
        setTimeout(() => {
          heroRobotImg.style.transform = '';
        }, 180);
      }
    });
  });
}

/* ==========================================================================
   5. Model Specification Matrix Switcher (Bento Left Card)
   Sourced directly from live Bengal Bits Robotorial Projects & Gallery Images
   ========================================================================== */
const PROJECT_MODELS = {
  'obstacle-car': {
    code: '# BB-LV3-01',
    modelName: 'Obstacle Avoidance Car',
    levelTag: 'Level 3 Advanced Robotics',
    description: 'Navigates autonomously by detecting obstacles using ultrasonic distance sensors. Reroutes motor trajectories in real time, forming the foundation of autonomous rovers.',
    components: ['Ultrasonic HC-SR04', 'L298N Dual Motor Driver', 'Arduino Uno', '4WD Geared Chassis', 'Micro-Servo Pan-Tilt'],
    image: 'https://res.cloudinary.com/dcxadfbih/image/upload/v1786513371/ws2_q8jwhh.jpg',
    caption: 'Obstacle Avoidance Car • Autonomous Testing',
    student: 'LEVEL 3 ROVER BUILD'
  },
  'smart-dustbin': {
    code: '# BB-LV2-01',
    modelName: 'Smart Dustbin',
    levelTag: 'Level 2 Intermediate IoT',
    description: 'Contactless hygiene automation using ultrasonic proximity detection to actuate a servo-driven lid automatically when hands approach.',
    components: ['HC-SR04 Proximity Sensor', 'Micro Servo SG90', 'Arduino Nano / Uno', 'Automated Hinge Mechanism', 'Status LED Beacon'],
    image: 'https://res.cloudinary.com/dcxadfbih/image/upload/v1768675134/img4_vkibzm.jpg',
    caption: 'Smart Dustbin Prototype • Hardware Bench',
    student: 'LEVEL 2 IOT BUILD'
  },
  'human-following': {
    code: '# BB-LV4-01',
    modelName: 'Human Following Car',
    levelTag: 'Level 4 IoT & Smart Systems',
    description: 'Intelligent tracking rover using multi-sensor array and heading detection to lock onto and follow human movement in real time.',
    components: ['Multi-Sonar Array', 'Infrared Tracking Probes', 'ESP32 / Arduino Controller', 'High-Torque 4WD Motors', 'PWM Speed Control'],
    image: 'https://res.cloudinary.com/dcxadfbih/image/upload/v1786513365/ws1_a0ifqk.jpg',
    caption: 'Human Following Rover • Workshop Build',
    student: 'LEVEL 4 SMART SYSTEMS'
  },
  'sensor-integration': {
    code: '# BB-CORE-04',
    modelName: 'Sensor Integration Hub',
    levelTag: 'Hands-on Embedded Lab',
    description: 'Multi-probe hardware telemetry module interfacing ultrasonic, PIR motion, soil moisture, and temperature sensors with live signal processing.',
    components: ['Ultrasonic HC-SR04', 'PIR Motion Sensor', 'Soil Moisture Probe', 'DHT11 Temp & Humidity', 'Analog Signal Conditioning'],
    image: 'https://res.cloudinary.com/dcxadfbih/image/upload/v1786513380/ws4_ltgsh5.jpg',
    caption: 'Sensor Integration Bench • Circuit Calibration',
    student: 'CORE HARDWARE BENCH'
  }
};

function initModelSpecSwitcher() {
  const modelTabs = document.querySelectorAll('.model-tab-btn');
  const codeEl = document.getElementById('specModelCode');
  const nameEl = document.getElementById('specModelName');
  const levelEl = document.getElementById('specLevelTag');
  const descEl = document.getElementById('specDescription');
  const componentsEl = document.getElementById('specComponents');
  const previewImg = document.getElementById('specPreviewImg');
  const captionEl = document.getElementById('specImgCaption');
  const studentEl = document.getElementById('specProjectStudent');

  if (!modelTabs.length) return;

  modelTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      modelTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const modelKey = tab.getAttribute('data-model');
      const data = PROJECT_MODELS[modelKey];
      if (!data) return;

      const animatedElements = [nameEl, descEl, componentsEl, previewImg, captionEl];
      animatedElements.forEach((el) => { if (el) el.style.opacity = '0.3'; });

      setTimeout(() => {
        if (codeEl) codeEl.textContent = data.code;
        if (nameEl) nameEl.textContent = data.modelName;
        if (levelEl) levelEl.textContent = data.levelTag;
        if (descEl) descEl.textContent = data.description;
        if (studentEl) studentEl.textContent = data.student;
        if (captionEl) captionEl.textContent = data.caption;
        if (previewImg) {
          previewImg.src = data.image;
          previewImg.alt = `${data.modelName} - Bengal Bits Project`;
        }

        if (componentsEl && Array.isArray(data.components)) {
          componentsEl.innerHTML = data.components
            .map((c) => `<span class="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-[11px] font-mono text-gray-800 font-semibold shadow-2xs">${c}</span>`)
            .join('');
        }

        animatedElements.forEach((el) => { if (el) el.style.opacity = '1'; });
      }, 120);
    });
  });
}

/* ==========================================================================
   6. Dynamic Telemetry Gauge
   ========================================================================== */
function initTelemetryGauge() {
  const needle = document.getElementById('gaugeNeedle');
  const percentText = document.getElementById('gaugePercentText');
  const btnMinus = document.getElementById('btnCalibMinus');
  const btnPlus = document.getElementById('btnCalibPlus');

  let currentPercent = 54;

  const updateGauge = (pct) => {
    currentPercent = Math.max(10, Math.min(100, pct));
    if (percentText) percentText.textContent = `${currentPercent}%`;

    const rotationAngle = ((currentPercent - 50) / 50) * 80;
    if (needle) {
      needle.style.transform = `rotate(${rotationAngle}deg)`;
    }
  };

  if (btnMinus) {
    btnMinus.addEventListener('click', () => updateGauge(currentPercent - 5));
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', () => updateGauge(currentPercent + 5));
  }

  updateGauge(54);
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavClose');
  const links = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !mobileDrawer) return;

  const openDrawer = () => {
    mobileDrawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.add('hidden');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  links.forEach((l) => l.addEventListener('click', closeDrawer));
}

/* ==========================================================================
   8. Circular Action Buttons & Quick Anchors
   ========================================================================== */
function initQuickActions() {
  const copyLinkBtn = document.getElementById('btnCopyBlueprint');
  const toast = document.getElementById('actionToast');

  if (copyLinkBtn && toast) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.classList.remove('hidden');
        toast.classList.add('flex');
        setTimeout(() => {
          toast.classList.add('hidden');
          toast.classList.remove('flex');
        }, 3000);
      });
    });
  }

  const rsvpBtns = document.querySelectorAll('.btn-reserve-workshop');
  const workshopSelect = document.getElementById('contactWorkshop');
  const contactSection = document.getElementById('contact');

  rsvpBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.getAttribute('data-workshop');
      if (val && workshopSelect) {
        workshopSelect.value = val;
      }
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   9. Contact Form Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('clubRegistrationForm');
  const submitBtn = document.getElementById('btnSubmitRegistration');
  const formSuccess = document.getElementById('formSuccessModal');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Submitting to Bengal Bits...</span>`;
    }

    setTimeout(() => {
      if (formSuccess) {
        formSuccess.classList.remove('hidden');
        formSuccess.classList.add('flex');
      }
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>SUBMIT ADMISSION REQUEST</span><span class="text-orange-500">→</span>`;
      }
    }, 900);
  });

  const closeModalBtn = document.getElementById('btnCloseSuccessModal');
  if (closeModalBtn && formSuccess) {
    closeModalBtn.addEventListener('click', () => {
      formSuccess.classList.add('hidden');
      formSuccess.classList.remove('flex');
    });
  }
}
