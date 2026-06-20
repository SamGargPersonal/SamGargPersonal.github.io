/**
 * Sam Garg Websites — Main Script
 * Premium interactions: particles, tilt, counters, scramble, scroll FX
 */

(function () {
  const NAV_OFFSET = 80;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(hover: none)").matches || window.innerWidth < 768;

  /* ── Mobile hamburger menu ── */
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (toggle && menu) {
    const mobileLinks = menu.querySelectorAll(".mobile-nav-link");

    function closeMenu() {
      toggle.classList.remove("is-active");
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    }

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      menu.setAttribute("aria-hidden", String(!isOpen));
    });

    mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
    });
  }

  /* ── Smooth scrolling (accounts for sticky nav) ── */
  function scrollToSection(target) {
    const y = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      scrollToSection(target);

      if (toggle && menu?.classList.contains("is-open")) {
        toggle.classList.remove("is-active");
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
      }

      history.pushState(null, "", id);
    });
  });

  /* ── Scroll progress bar ── */
  const progressBar = document.getElementById("scroll-progress-bar");

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ── Active nav highlighting ── */
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const sections = ["home", "about", "services", "portfolio", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function updateActiveNav() {
    const scrollPos = window.scrollY + NAV_OFFSET + 100;
    let current = "home";

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.section === current);
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* ── Scroll-reveal ── */
  const revealElements = document.querySelectorAll(".reveal, .section-divider");

  if (revealElements.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── Animated counters ── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;

      el.textContent =
        decimals > 0 ? value.toFixed(decimals) + suffix : Math.round(value) + suffix;

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll("[data-count]");

  if (counters.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => {
      const suffix = el.dataset.suffix || "";
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const val = parseFloat(el.dataset.count);
      el.textContent = decimals > 0 ? val.toFixed(decimals) + suffix : val + suffix;
    });
  }

  /* ── Text scramble effect (hero) ── */
  const scrambleEl = document.getElementById("hero-scramble");

  if (scrambleEl && !prefersReducedMotion) {
    const finalText = scrambleEl.textContent.trim();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let frame = 0;
    const totalFrames = 40;

    scrambleEl.textContent = "";
    scrambleEl.classList.add("scramble-cursor");

    const scrambleInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * finalText.length);

      let output = "";
      for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === " ") {
          output += " ";
        } else if (i < revealed) {
          output += finalText[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      scrambleEl.textContent = output;

      if (frame >= totalFrames) {
        clearInterval(scrambleInterval);
        scrambleEl.textContent = finalText;
        scrambleEl.classList.remove("scramble-cursor");
      }
    }, 50);
  }

  /* ── 3D tilt cards ── */
  if (!prefersReducedMotion && !isTouchDevice) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.classList.add("is-tilting");
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("is-tilting");
        card.style.transform = "";
      });
    });
  }

  /* ── Magnetic buttons ── */
  if (!prefersReducedMotion && !isTouchDevice) {
    document.querySelectorAll(".btn-magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) * 0.15;
        const deltaY = (y - centerY) * 0.15;

        btn.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
        btn.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
        btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ── Cursor spotlight ── */
  const spotlight = document.getElementById("cursor-spotlight");

  if (spotlight && !prefersReducedMotion && !isTouchDevice) {
    let spotlightVisible = false;

    document.addEventListener(
      "mousemove",
      (e) => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;

        if (!spotlightVisible) {
          spotlightVisible = true;
          document.body.classList.add("is-cursor-active");
        }
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => {
      spotlightVisible = false;
      document.body.classList.remove("is-cursor-active");
    });
  }

  /* ── Particle canvas network ── */
  const canvas = document.getElementById("particle-canvas");

  if (canvas && !prefersReducedMotion && !isTouchDevice) {
    const ctx = canvas.getContext("2d");
    const hero = canvas.closest("section");
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };
    let animationId;

    function resizeCanvas() {
      if (!hero) return;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * 2;
            p.y += (dy / dist) * force * 2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 245, 255, 0.6)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 245, 255, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 212, 170, ${0.2 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });

    if (hero) {
      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      hero.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        drawParticles();
      }
    });
  }

  /* ── Contact form (FormSubmit — emails not displayed on page) ── */
  const form = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");
  const formError = document.getElementById("form-error");
  const formSubmitBtn = document.getElementById("form-submit-btn");

  const PACKAGE_LABELS = {
    "one-pager": "The One-Pager ($300–$400)",
    standard: "The Standard Package ($500–$700)",
    premium: "The Premium Custom ($800–$1,000)",
    unsure: "Not sure yet",
  };

  if (form && formSuccess) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = form.querySelector("#name");
      const emailInput = form.querySelector("#email");
      const packageInput = form.querySelector("#package");
      const messageInput = form.querySelector("#message");

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) return;

      if (formError) {
        formError.classList.add("hidden");
        formError.textContent = "";
      }

      if (formSubmitBtn) {
        formSubmitBtn.disabled = true;
        formSubmitBtn.textContent = "Sending…";
      }

      const packageValue = packageInput.value;
      const packageLabel = PACKAGE_LABELS[packageValue] || "Not specified";
      const fullMessage = packageValue
        ? `Package: ${packageLabel}\n\n${messageInput.value.trim()}`
        : messageInput.value.trim();

      try {
        const response = await fetch("https://formsubmit.co/ajax/sam.garg2101@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: fullMessage,
            _subject: `New inquiry from ${nameInput.value.trim()} — Sam Garg Websites`,
            _cc: "23729@bbc.qld.edu.au",
            _template: "table",
            _captcha: "false",
          }),
        });

        const data = await response.json();

        if (!response.ok || data.success !== "true") {
          throw new Error(data.message || "Submission failed");
        }

        form.classList.add("hidden");
        formSuccess.classList.remove("hidden");
        formSuccess.classList.add("reveal", "is-visible");
      } catch (err) {
        if (formError) {
          formError.textContent =
            "Something went wrong sending your message. Please try again in a moment, or reach out via GitHub.";
          formError.classList.remove("hidden");
        }
        if (formSubmitBtn) {
          formSubmitBtn.disabled = false;
          formSubmitBtn.textContent = "Send Message";
        }
      }
    });
  }

  /* ── Logo loader (assets/logo.png, .png, .svg, or .webp) ── */
  const logoEl = document.getElementById("site-logo");
  const logoCandidates = ["assets/logo.png", "assets/logo.png", "assets/logo.svg", "assets/logo.webp"];

  function tryLoadLogo(index) {
    if (!logoEl || index >= logoCandidates.length) return;

    logoEl.onload = () => {
      logoEl.classList.remove("hidden");
    };

    logoEl.onerror = () => {
      tryLoadLogo(index + 1);
    };

    logoEl.src = logoCandidates[index];
  }

  if (logoEl) tryLoadLogo(0);
})();
