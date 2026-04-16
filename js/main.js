/* ============================================================
   OmniTax Professionals — main.js
   Handles: scroll animations, hero parallax, trust counters
   ============================================================ */

/* ── Scroll-reveal (Intersection Observer) ──────────────────── */
(function () {
    const elements = document.querySelectorAll('.animate-hidden');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
})();

/* ── Hero gradient parallax ─────────────────────────────────── */
(function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const onScroll = () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight * 1.5) {
            hero.style.setProperty('--parallax-offset', scrolled * 0.25 + 'px');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Trust counter animation ─────────────────────────────────── */
(function () {
    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (isNaN(target)) return;

        const duration = 1200;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }

    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
})();
