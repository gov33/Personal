/**
 * THE HIGH PASS — CLIENT DISCOVERY QUESTIONNAIRE
 * Minimalist Cyberpunk Intake Deck
 * State Machine with Directional Slide Transitions & LocalStorage Persistence
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'the_high_pass_cyber_v2';
  const TOTAL_STEPS = 6;
  let currentStep = 1;
  let previousStep = 1;

  // Cloud & Delivery Configuration
  const CONFIG = {
    destinationEmail: 'govindcs33@gmail.com',
    // Paste your deployed Google Apps Script Web App URL here to append rows to your Google Sheet:
    googleSheetsWebhookUrl: '',
    // FormSubmit endpoint sends direct email to govindcs33@gmail.com without opening client app:
    formSubmitUrl: 'https://formsubmit.co/ajax/govindcs33@gmail.com'
  };

  // DOM Elements
  const form = document.getElementById('high-pass-form');
  const panels = document.querySelectorAll('.slide-panel');
  const stepDots = document.querySelectorAll('.step-dot');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const nextBtnText = document.getElementById('next-btn-text');
  const slideCount = document.getElementById('slide-count');
  const progressBar = document.getElementById('progress-bar');
  const saveStatus = document.getElementById('save-status');
  const btnResetDraft = document.getElementById('btn-reset-draft');
  const btnFreshCanvas = document.getElementById('btn-fresh-canvas');
  const clientWebsiteInput = document.getElementById('client-website');
  const toast = document.getElementById('pass-toast');
  const toastMessage = document.getElementById('toast-message');

  // Dossier elements
  const dossierBody = document.getElementById('dossier-body');
  const dossierTimestamp = document.getElementById('dossier-timestamp');
  const btnTransmitEmail = document.getElementById('btn-transmit-email');
  const btnCopyBrief = document.getElementById('btn-copy-brief');
  const btnDownloadBrief = document.getElementById('btn-download-brief');
  const btnAmendAnswers = document.getElementById('btn-amend-answers');

  // State object
  const state = {
    clientName: '',
    companyName: '',
    clientEmail: '',
    clientWebsite: '',
    isStartingFresh: false,
    clientRole: 'Founder / CEO',
    projectScope: 'Flagship Web Experience',
    objectives: ['High Inquiries & Conversion', 'Category Authority & Prestige'],
    aestheticWorld: 'Cyberpunk Neo-Dark',
    inspirationLinks: '',
    brandHeritage: 'Complete Design System Ready',
    capabilities: [
      'Headless CMS (Sanity / Strapi)',
      'Custom 60FPS Micro-interactions',
      'Edge Hosting & Core Web Vitals 95+'
    ],
    targetTimeline: 'Standard (1–2 Months)',
    budgetTier: 'Custom Flagship Platform ($5,000 – $10,000)',
    decisionMakers: 'Solo Decision Maker',
    additionalNotes: ''
  };

  /* ==========================================================================
     INIT & STORAGE
     ========================================================================== */
  function init() {
    loadFromStorage();
    bindEvents();
    renderStep(currentStep, 'none');
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed.state || {});
        if (parsed.step && parsed.step >= 1 && parsed.step <= TOTAL_STEPS) {
          currentStep = parsed.step;
        }
        syncStateToDOM();
        showSaveIndicator('Draft restored');
      }
    } catch (e) {
      console.warn('Could not read draft from localStorage', e);
    }
  }

  function saveToStorage() {
    try {
      syncDOMToState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        state,
        step: currentStep,
        updatedAt: new Date().toISOString()
      }));
      showSaveIndicator('Draft saved');
    } catch (e) {
      console.warn('Could not save draft to localStorage', e);
    }
  }

  function showSaveIndicator(text) {
    if (!saveStatus) return;
    const textEl = saveStatus.querySelector('.save-text');
    if (textEl) textEl.textContent = text;
  }

  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }

  /* ==========================================================================
     DOM & STATE SYNC
     ========================================================================== */
  function syncDOMToState() {
    state.clientName = document.getElementById('client-name')?.value.trim() || '';
    state.companyName = document.getElementById('company-name')?.value.trim() || '';
    state.clientEmail = document.getElementById('client-email')?.value.trim() || '';
    state.clientWebsite = document.getElementById('client-website')?.value.trim() || '';
    state.isStartingFresh = btnFreshCanvas?.getAttribute('data-active') === 'true';

    const roleChecked = document.querySelector('input[name="clientRole"]:checked');
    if (roleChecked) state.clientRole = roleChecked.value;

    const scopeChecked = document.querySelector('input[name="projectScope"]:checked');
    if (scopeChecked) state.projectScope = scopeChecked.value;

    const activeChips = document.querySelectorAll('.toggle-chip.active');
    state.objectives = Array.from(activeChips).map(c => c.getAttribute('data-value'));

    const aestheticChecked = document.querySelector('input[name="aestheticWorld"]:checked');
    if (aestheticChecked) state.aestheticWorld = aestheticChecked.value;

    state.inspirationLinks = document.getElementById('inspiration-links')?.value.trim() || '';

    const heritageChecked = document.querySelector('input[name="brandHeritage"]:checked');
    if (heritageChecked) state.brandHeritage = heritageChecked.value;

    const capChecked = document.querySelectorAll('input[name="capabilities"]:checked');
    state.capabilities = Array.from(capChecked).map(c => c.value);

    const timelineChecked = document.querySelector('input[name="targetTimeline"]:checked');
    if (timelineChecked) state.targetTimeline = timelineChecked.value;

    const budgetChecked = document.querySelector('input[name="budgetTier"]:checked');
    if (budgetChecked) state.budgetTier = budgetChecked.value;

    const decisionChecked = document.querySelector('input[name="decisionMakers"]:checked');
    if (decisionChecked) state.decisionMakers = decisionChecked.value;

    state.additionalNotes = document.getElementById('additional-notes')?.value.trim() || '';
  }

  function syncStateToDOM() {
    if (document.getElementById('client-name')) document.getElementById('client-name').value = state.clientName;
    if (document.getElementById('company-name')) document.getElementById('company-name').value = state.companyName;
    if (document.getElementById('client-email')) document.getElementById('client-email').value = state.clientEmail;
    if (document.getElementById('client-website')) document.getElementById('client-website').value = state.clientWebsite;

    if (btnFreshCanvas) {
      btnFreshCanvas.setAttribute('data-active', state.isStartingFresh ? 'true' : 'false');
      if (state.isStartingFresh && clientWebsiteInput) {
        clientWebsiteInput.disabled = true;
        clientWebsiteInput.placeholder = 'Starting from clean slate (New Build)';
      }
    }

    const roleRadio = document.querySelector(`input[name="clientRole"][value="${state.clientRole}"]`);
    if (roleRadio) roleRadio.checked = true;

    const scopeRadio = document.querySelector(`input[name="projectScope"][value="${state.projectScope}"]`);
    if (scopeRadio) {
      scopeRadio.checked = true;
      document.querySelectorAll('#step-2 .cyber-card').forEach(c => {
        if (c.contains(scopeRadio)) c.classList.add('selected');
        else c.classList.remove('selected');
      });
    }

    document.querySelectorAll('.toggle-chip').forEach(chip => {
      const val = chip.getAttribute('data-value');
      if (state.objectives.includes(val)) chip.classList.add('active');
      else chip.classList.remove('active');
    });

    const aestheticRadio = document.querySelector(`input[name="aestheticWorld"][value="${state.aestheticWorld}"]`);
    if (aestheticRadio) {
      aestheticRadio.checked = true;
      document.querySelectorAll('#step-3 .cyber-card').forEach(c => {
        if (c.contains(aestheticRadio)) c.classList.add('selected');
        else c.classList.remove('selected');
      });
    }

    if (document.getElementById('inspiration-links')) {
      document.getElementById('inspiration-links').value = state.inspirationLinks;
    }

    const heritageRadio = document.querySelector(`input[name="brandHeritage"][value="${state.brandHeritage}"]`);
    if (heritageRadio) heritageRadio.checked = true;

    document.querySelectorAll('input[name="capabilities"]').forEach(cb => {
      cb.checked = state.capabilities.includes(cb.value);
    });

    const tlRadio = document.querySelector(`input[name="targetTimeline"][value="${state.targetTimeline}"]`);
    if (tlRadio) tlRadio.checked = true;

    const budgetRadio = document.querySelector(`input[name="budgetTier"][value="${state.budgetTier}"]`);
    if (budgetRadio) {
      budgetRadio.checked = true;
      document.querySelectorAll('.tier-card').forEach(c => {
        if (c.contains(budgetRadio)) c.classList.add('selected');
        else c.classList.remove('selected');
      });
    }

    const decRadio = document.querySelector(`input[name="decisionMakers"][value="${state.decisionMakers}"]`);
    if (decRadio) decRadio.checked = true;

    if (document.getElementById('additional-notes')) {
      document.getElementById('additional-notes').value = state.additionalNotes;
    }
  }

  /* ==========================================================================
     VALIDATION
     ========================================================================== */
  function validateCurrentStep() {
    syncDOMToState();

    if (currentStep === 1) {
      const nameInput = document.getElementById('client-name');
      const companyInput = document.getElementById('company-name');
      const emailInput = document.getElementById('client-email');

      if (!state.clientName) {
        showToast('Please enter your name.');
        nameInput?.focus();
        return false;
      }
      if (!state.companyName) {
        showToast('Please enter your brand or venture name.');
        companyInput?.focus();
        return false;
      }
      if (!state.clientEmail || !state.clientEmail.includes('@')) {
        showToast('Please provide a valid contact email.');
        emailInput?.focus();
        return false;
      }
    }

    if (currentStep === 2 && !state.projectScope) {
      showToast('Please select your project scope.');
      return false;
    }

    if (currentStep === 3 && !state.aestheticWorld) {
      showToast('Please select an aesthetic direction.');
      return false;
    }

    if (currentStep === 4 && !state.targetTimeline) {
      showToast('Please select your target timeline.');
      return false;
    }

    if (currentStep === 5 && !state.budgetTier) {
      showToast('Please select an investment tier.');
      return false;
    }

    return true;
  }

  /* ==========================================================================
     STEP RENDERING & DIRECTIONAL SLIDE ANIMATION
     ========================================================================== */
  function renderStep(step, direction) {
    previousStep = currentStep;
    currentStep = step;

    // Panels with animation classes
    panels.forEach(p => {
      const pStep = parseInt(p.getAttribute('data-step'), 10);
      p.classList.remove('active', 'slide-enter-next', 'slide-enter-prev');

      if (pStep === currentStep) {
        p.classList.add('active');
        if (direction === 'next') {
          p.classList.add('slide-enter-next');
        } else if (direction === 'prev') {
          p.classList.add('slide-enter-prev');
        }
      }
    });

    // Stepper navigation
    stepDots.forEach(dot => {
      const dStep = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.remove('active', 'completed');
      if (dStep === currentStep) {
        dot.classList.add('active');
      } else if (dStep < currentStep) {
        dot.classList.add('completed');
      }
    });

    // Progress Bar (16.66% to 100%)
    if (progressBar) {
      const progressRatio = currentStep / TOTAL_STEPS;
      progressBar.style.transform = `scaleX(${progressRatio})`;
    }

    // Slide Counter HUD
    if (slideCount) {
      const padStep = String(currentStep).padStart(2, '0');
      slideCount.textContent = `${padStep} / 06`;
    }

    // Footer buttons
    if (btnPrev) {
      btnPrev.disabled = (currentStep === 1);
    }

    if (nextBtnText) {
      if (currentStep === 5) {
        nextBtnText.textContent = 'View Project Brief';
      } else if (currentStep === 6) {
        nextBtnText.textContent = 'Transmit to Govind';
      } else {
        nextBtnText.textContent = 'Next Slide';
      }
    }

    // Generate dossier on slide 6
    if (currentStep === 6) {
      generateDossier();
    }

    saveToStorage();
  }

  function advanceStep() {
    if (currentStep === 6) {
      transmitCommission();
      return;
    }

    if (!validateCurrentStep()) return;

    if (currentStep < TOTAL_STEPS) {
      renderStep(currentStep + 1, 'next');
    }
  }

  function retreatStep() {
    if (currentStep > 1) {
      renderStep(currentStep - 1, 'prev');
    }
  }

  /* ==========================================================================
     DOSSIER GENERATION & ACTIONS
     ========================================================================== */
  function generateDossier() {
    syncDOMToState();

    if (dossierTimestamp) {
      const now = new Date();
      dossierTimestamp.textContent = now.toISOString().slice(0, 10);
    }

    const domainDisplay = state.isStartingFresh
      ? 'Clean Slate (New Build)'
      : (state.clientWebsite || 'TBD');

    const objectivesList = state.objectives.length > 0
      ? state.objectives.join(', ')
      : 'Bespoke Quality';

    const capabilitiesList = state.capabilities.length > 0
      ? state.capabilities.join(', ')
      : 'High-Performance Static';

    const rows = [
      { key: 'CLIENT_IDENTITY', val: `${state.clientName} (${state.clientRole})` },
      { key: 'VENTURE_BRAND', val: state.companyName },
      { key: 'CONTACT_EMAIL', val: state.clientEmail },
      { key: 'CURRENT_DOMAIN', val: domainDisplay },
      { key: 'PROJECT_SCOPE', val: state.projectScope },
      { key: 'FOCAL_OUTCOMES', val: objectivesList },
      { key: 'VISUAL_STANDARD', val: state.aestheticWorld },
      { key: 'BRAND_ASSETS', val: state.brandHeritage },
      { key: 'CAPABILITIES', val: capabilitiesList },
      { key: 'LAUNCH_HORIZON', val: state.targetTimeline },
      { key: 'INVESTMENT_TIER', val: state.budgetTier },
      { key: 'DECISION_MAKER', val: state.decisionMakers }
    ];

    if (state.inspirationLinks) {
      rows.push({ key: 'INSPIRATION_URLS', val: state.inspirationLinks });
    }

    if (state.additionalNotes) {
      rows.push({ key: 'ADDITIONAL_NOTES', val: state.additionalNotes });
    }

    if (dossierBody) {
      dossierBody.innerHTML = rows.map(r => `
        <div class="spec-line">
          <span class="spec-key">// ${escapeHtml(r.key)}</span>
          <span class="spec-val">${escapeHtml(r.val)}</span>
        </div>
      `).join('');
    }
  }

  function buildMarkdownBrief() {
    syncDOMToState();
    const dateStr = new Date().toISOString().slice(0, 10);

    return `# THE HIGH PASS: CLIENT DISCOVERY BRIEF
Date: ${dateStr}
Project: ${state.companyName}

---

## 1. Client Context
- Name: ${state.clientName}
- Brand / Venture: ${state.companyName}
- Role: ${state.clientRole}
- Email: ${state.clientEmail}
- Current Domain: ${state.isStartingFresh ? 'Clean Slate (New Build)' : (state.clientWebsite || 'None specified')}

## 2. Project Scope & Ambition
- Scope: ${state.projectScope}
- Focal Outcomes: ${state.objectives.join(', ') || 'High Craft & Speed'}

## 3. Visual Standard & Aesthetics
- Aesthetic World: ${state.aestheticWorld}
- Brand Assets: ${state.brandHeritage}
- Reference Sites: ${state.inspirationLinks || 'None provided'}

## 4. Technical Architecture
- Required Capabilities: ${state.capabilities.join(', ') || 'Custom Static Architecture'}
- Launch Horizon: ${state.targetTimeline}

## 5. Investment & Governance
- Investment Tier: ${state.budgetTier}
- Decision Maker: ${state.decisionMakers}
- Additional Notes: ${state.additionalNotes || 'None'}

---
Generated via The High Pass Discovery Deck
`;
  }

  async function transmitCommission() {
    syncDOMToState();
    const brief = buildMarkdownBrief();
    const btnTransmit = document.getElementById('btn-transmit-email');
    const transmitLabel = document.getElementById('transmit-btn-label');
    const transmitArrow = document.getElementById('transmit-btn-arrow');
    const primaryCard = document.getElementById('action-card-primary');

    if (btnTransmit) {
      btnTransmit.disabled = true;
      if (transmitLabel) transmitLabel.textContent = 'Transmitting Spec...';
      if (transmitArrow) transmitArrow.textContent = '...';
    }

    const payload = {
      timestamp: new Date().toISOString(),
      clientName: state.clientName,
      companyName: state.companyName,
      clientEmail: state.clientEmail,
      clientRole: state.clientRole,
      clientWebsite: state.isStartingFresh ? 'Starting Fresh' : state.clientWebsite,
      projectScope: state.projectScope,
      objectives: state.objectives.join(', '),
      aestheticWorld: state.aestheticWorld,
      brandHeritage: state.brandHeritage,
      inspirationLinks: state.inspirationLinks,
      capabilities: state.capabilities.join(', '),
      targetTimeline: state.targetTimeline,
      budgetTier: state.budgetTier,
      decisionMakers: state.decisionMakers,
      additionalNotes: state.additionalNotes,
      markdownBrief: brief
    };

    let sent = false;

    // 1. If Google Sheets Webhook is configured, POST directly to Google Sheets
    if (CONFIG.googleSheetsWebhookUrl) {
      try {
        await fetch(CONFIG.googleSheetsWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        sent = true;
      } catch (err) {
        console.warn('Google Sheets Webhook dispatch failed, trying fallback...', err);
      }
    }

    // 2. FormSubmit AJAX direct delivery to govindcs33@gmail.com
    if (!sent && CONFIG.formSubmitUrl) {
      try {
        const formData = new FormData();
        formData.append('_subject', `[New Commission] ${state.companyName} — ${state.projectScope}`);
        formData.append('_replyto', state.clientEmail);
        formData.append('Client Name', `${state.clientName} (${state.clientRole})`);
        formData.append('Company', state.companyName);
        formData.append('Email', state.clientEmail);
        formData.append('Website', payload.clientWebsite);
        formData.append('Scope', state.projectScope);
        formData.append('Objectives', payload.objectives);
        formData.append('Aesthetic', state.aestheticWorld);
        formData.append('Brand Assets', state.brandHeritage);
        formData.append('Capabilities', payload.capabilities);
        formData.append('Timeline', state.targetTimeline);
        formData.append('Budget Tier', state.budgetTier);
        formData.append('Decision Makers', state.decisionMakers);
        formData.append('Additional Notes', state.additionalNotes || 'None');
        formData.append('Full Brief', brief);

        const res = await fetch(CONFIG.formSubmitUrl, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        if (res.ok) sent = true;
      } catch (err) {
        console.warn('Direct email dispatch failed', err);
      }
    }

    if (sent) {
      showToast('Transmission confirmed! Delivered to Govind.');
      if (primaryCard) {
        primaryCard.innerHTML = `
          <div class="transmission-success">
            <div class="success-badge">// TRANSMISSION CONFIRMED</div>
            <div class="success-title">Commission Spec Dispatched</div>
            <p class="success-desc">Your project brief was transmitted to <strong>govindcs33@gmail.com</strong> and logged to the ledger.</p>
            <div class="success-meta">
              <span>Recipient: govindcs33@gmail.com</span>
              <span>Status: In Architecture Queue (&lt;24h reply)</span>
            </div>
          </div>
        `;
      }
    } else {
      // Fallback: trigger email client with pre-filled Markdown brief
      const subject = encodeURIComponent(`[Project Discovery] ${state.companyName} — ${state.projectScope}`);
      const body = encodeURIComponent(brief);
      window.location.href = `mailto:${CONFIG.destinationEmail}?subject=${subject}&body=${body}`;
      showToast('Opened email draft to govindcs33@gmail.com');
      if (btnTransmit) {
        btnTransmit.disabled = false;
        if (transmitLabel) transmitLabel.textContent = 'Transmit Spec to Govind';
        if (transmitArrow) transmitArrow.innerHTML = '&rarr;';
      }
    }
  }

  function copyBriefToClipboard() {
    const brief = buildMarkdownBrief();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(brief).then(() => {
        showToast('Brief copied to clipboard!');
      }).catch(() => {
        fallbackCopy(brief);
      });
    } else {
      fallbackCopy(brief);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Brief copied to clipboard!');
    } catch (e) {
      showToast('Could not copy automatically.');
    }
    document.body.removeChild(ta);
  }

  function downloadBriefFile() {
    const brief = buildMarkdownBrief();
    const safeName = (state.companyName || 'project')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const filename = `high-pass-brief-${safeName || 'discovery'}.md`;

    const blob = new Blob([brief], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloaded ${filename}`);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     EVENT BINDINGS
     ========================================================================== */
  function bindEvents() {
    btnPrev?.addEventListener('click', retreatStep);
    btnNext?.addEventListener('click', advanceStep);

    // Stepper dots direct navigation
    stepDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetStep = parseInt(dot.getAttribute('data-step'), 10);
        if (targetStep < currentStep) {
          renderStep(targetStep, 'prev');
        } else if (targetStep > currentStep) {
          if (validateCurrentStep()) {
            renderStep(targetStep, 'next');
          }
        }
      });
    });

    // Reset draft button
    btnResetDraft?.addEventListener('click', () => {
      if (confirm('Clear all answers and reset questionnaire?')) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      }
    });

    // Starting Fresh website toggle
    btnFreshCanvas?.addEventListener('click', () => {
      const isActive = btnFreshCanvas.getAttribute('data-active') === 'true';
      const newState = !isActive;
      btnFreshCanvas.setAttribute('data-active', newState ? 'true' : 'false');
      state.isStartingFresh = newState;

      if (clientWebsiteInput) {
        if (newState) {
          clientWebsiteInput.value = '';
          clientWebsiteInput.disabled = true;
          clientWebsiteInput.placeholder = 'Starting from clean slate (New Build)';
        } else {
          clientWebsiteInput.disabled = false;
          clientWebsiteInput.placeholder = 'https://yoursite.com';
        }
      }
      saveToStorage();
    });

    // Cyber cards selection
    document.querySelectorAll('.cyber-card').forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      card.addEventListener('click', () => {
        if (radio) {
          radio.checked = true;
          const groupName = radio.getAttribute('name');
          document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
            const parentCard = r.closest('.cyber-card');
            if (parentCard) parentCard.classList.remove('selected');
          });
          card.classList.add('selected');
          saveToStorage();
        }
      });
    });

    // Tier cards selection
    document.querySelectorAll('.tier-card').forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      card.addEventListener('click', () => {
        if (radio) {
          radio.checked = true;
          document.querySelectorAll('.tier-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          saveToStorage();
        }
      });
    });

    // Objectives chips toggle (max 2)
    document.querySelectorAll('.toggle-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const isCurrentlyActive = chip.classList.contains('active');
        const activeCount = document.querySelectorAll('.toggle-chip.active').length;

        if (!isCurrentlyActive && activeCount >= 2) {
          showToast('Select up to two focal outcomes.');
          return;
        }

        chip.classList.toggle('active');
        saveToStorage();
      });
    });

    // Auto-save on input changes
    form?.addEventListener('input', saveToStorage);
    form?.addEventListener('change', saveToStorage);

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isTextarea = (tag === 'textarea');

      if (e.key === 'Enter' && !isTextarea && !e.shiftKey) {
        e.preventDefault();
        advanceStep();
      }

      if (e.key === 'Escape') {
        retreatStep();
      }
    });

    // Summit actions
    btnTransmitEmail?.addEventListener('click', transmitCommission);
    btnCopyBrief?.addEventListener('click', copyBriefToClipboard);
    btnDownloadBrief?.addEventListener('click', downloadBriefFile);
    btnAmendAnswers?.addEventListener('click', () => {
      renderStep(1, 'prev');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
