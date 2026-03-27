/* ============================================================
   HitMaster Graphics — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Nav Toggle ─────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const open = document.body.classList.contains('nav-open');
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  /* ── Active nav link ───────────────────────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── FAQ Accordion ─────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── Pricing Tabs ──────────────────────────────────────── */
  document.querySelectorAll('.pricing-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.pricing-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Generic Tab Nav ───────────────────────────────────── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tab-group') || btn.parentElement.closest('[data-tabs]') || document;
      const target = btn.dataset.tab;
      btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const contents = btn.closest('section')
        ? btn.closest('section').querySelectorAll('.tab-content')
        : document.querySelectorAll('.tab-content');
      contents.forEach(c => c.classList.remove('active'));
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Scroll-triggered sticky CTA ──────────────────────── */
  const stickyCta = document.querySelector('.sticky-cta');
  if (stickyCta) {
    const showAfter = 600;
    window.addEventListener('scroll', () => {
      stickyCta.style.display = window.scrollY > showAfter ? 'flex' : 'none';
    }, { passive: true });
  }

  /* ── Smooth anchor links ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.body.classList.remove('nav-open');
      }
    });
  });

  /* ── Multi-step form (quote / order) ──────────────────── */
  const multiForm = document.querySelector('.multistep-form');
  if (multiForm) {
    const steps   = multiForm.querySelectorAll('.form-step');
    const dots    = document.querySelectorAll('.step-item');
    const nextBtns = multiForm.querySelectorAll('[data-next]');
    const prevBtns = multiForm.querySelectorAll('[data-prev]');
    let current = 0;

    function showStep(n) {
      steps.forEach((s, i) => {
        s.style.display = i === n ? 'block' : 'none';
      });
      dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if (i < n)  d.classList.add('done');
        if (i === n) d.classList.add('active');
      });
    }

    function validateStep(n) {
      const step = steps[n];
      const required = step.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--danger)';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      return valid;
    }

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateStep(current) && current < steps.length - 1) {
          current++;
          showStep(current);
          window.scrollTo({ top: multiForm.offsetTop - 100, behavior: 'smooth' });
        }
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (current > 0) {
          current--;
          showStep(current);
        }
      });
    });

    showStep(0);
  }

  /* ── Contact method cards ──────────────────────────────── */
  document.querySelectorAll('.contact-method[data-action]').forEach(card => {
    card.addEventListener('click', () => {
      const action = card.dataset.action;
      if (action === 'phone')  window.location.href = 'tel:+18132500555';
      if (action === 'email')  window.location.href = 'mailto:sales@hitmastergraphics.com';
      if (action === 'ai')     document.querySelector('#ai-chat-modal')?.classList.add('open');
    });
  });

  /* ── AI Chat modal stub ────────────────────────────────── */
  const chatModal = document.getElementById('ai-chat-modal');
  if (chatModal) {
    document.querySelector('.chat-close')?.addEventListener('click', () => {
      chatModal.classList.remove('open');
    });
    chatModal.addEventListener('click', e => {
      if (e.target === chatModal) chatModal.classList.remove('open');
    });
  }

  /* ── Animate on scroll (simple) ───────────────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animate-fadeup');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.service-card, .card, .why-item, .testimonial').forEach(el => {
    observer.observe(el);
  });

  /* ── Broker registration form validation ─────────────── */
  const brokerForm = document.getElementById('broker-form');
  if (brokerForm) {
    brokerForm.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = brokerForm.querySelector('[type=submit]');
      submitBtn.textContent = 'Submitting…';
      submitBtn.disabled = true;
      // Workflow stub — replace with real API call
      setTimeout(() => {
        brokerForm.innerHTML = `
          <div class="workflow-stub">
            <div class="workflow-stub-icon">✅</div>
            <h3>Application Submitted!</h3>
            <p>Thank you for applying to become a HitMaster broker. Our team will review your application and respond within 1–2 business days.</p>
            <p class="mt-16"><strong>Reference ID:</strong> HMG-${Date.now().toString(36).toUpperCase()}</p>
          </div>`;
      }, 1500);
    });
  }

  /* ── Character counter for file upload feedback ──────── */
  document.querySelectorAll('input[type=file]').forEach(input => {
    input.addEventListener('change', function() {
      const label = this.closest('.form-group')?.querySelector('.form-hint');
      if (label && this.files.length) {
        label.textContent = `${this.files.length} file(s) selected: ${Array.from(this.files).map(f => f.name).join(', ')}`;
        label.style.color = 'var(--green-dark)';
      }
    });
  });

  /* ── Quote calculator (pricing page) ────────────────── */
  const calcForm = document.getElementById('quick-calc');
  if (calcForm) {
    function calculate() {
      const service  = calcForm.querySelector('#calc-service')?.value || 'screen';
      const qty      = parseInt(calcForm.querySelector('#calc-qty')?.value) || 0;
      const colors   = parseInt(calcForm.querySelector('#calc-colors')?.value) || 1;
      const rush     = calcForm.querySelector('#calc-rush')?.value || 'standard';
      const output   = calcForm.querySelector('#calc-result');
      if (!output) return;
      if (qty < 12) { output.textContent = 'Minimum order is 12 pieces.'; return; }

      // Wholesale screen print per-piece rates (print cost only, not blanks)
      const screenRates = [
        { min: 12,  max: 23,  base: 5.50 },
        { min: 24,  max: 47,  base: 4.25 },
        { min: 48,  max: 71,  base: 3.50 },
        { min: 72,  max: 143, base: 2.75 },
        { min: 144, max: 287, base: 2.25 },
        { min: 288, max: 575, base: 1.95 },
        { min: 576, max: Infinity, base: 1.65 },
      ];
      const embRates = [
        { min: 1,  max: 11,  base: 8.00 },
        { min: 12, max: 35,  base: 6.50 },
        { min: 36, max: 71,  base: 5.25 },
        { min: 72, max: 143, base: 4.50 },
        { min: 144, max: Infinity, base: 3.75 },
      ];
      const dtgRates = [
        { min: 1,  max: 11,  base: 12.00 },
        { min: 12, max: 23,  base: 9.50 },
        { min: 24, max: 47,  base: 7.75 },
        { min: 48, max: 95,  base: 6.50 },
        { min: 96, max: Infinity, base: 5.25 },
      ];

      let rates = service === 'screen' ? screenRates : service === 'emb' ? embRates : dtgRates;
      const tier = rates.find(r => qty >= r.min && qty <= r.max);
      if (!tier) return;

      let perPiece = tier.base;
      if (service === 'screen') perPiece += (colors - 1) * 0.45; // extra color adder
      const rushMult = rush === 'rush' ? 1.25 : rush === 'super' ? 1.50 : 1.00;
      const setup = service === 'screen' ? colors * 25 : service === 'emb' ? 25 : 0;
      const total = (perPiece * qty * rushMult) + setup;

      output.innerHTML = `
        <strong>Estimated Print Cost:</strong><br>
        ${qty} pcs × $${(perPiece * rushMult).toFixed(2)}/pc = <span style="color:var(--blue);font-size:1.15rem;font-weight:700">$${(perPiece * qty * rushMult).toFixed(2)}</span>
        ${setup > 0 ? `<br>+ Setup: $${setup.toFixed(2)}` : ''}
        <br><strong style="font-size:1.1rem;">Total Est.: $${total.toFixed(2)}</strong>
        <br><small style="color:var(--gray-500);">Blank apparel not included. Final quote may vary.</small>
      `;
    }
    calcForm.addEventListener('input', calculate);
    calculate();
  }

});
