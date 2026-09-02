/**
 * THE HIGH PASS : STUDIO DISCOVERY CONSOLE
 * Clean Minimalist Architecture & State Management
 * Strict adherence to design-taste-frontend directives
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'high_pass_studio_v3';
  const TOTAL_STEPS = 6;
  let currentStep = 1;

  // Cloud & Delivery Configuration
  const CONFIG = {
    destinationEmail: 'govindcs33@gmail.com',
    apiSubmitEndpoint: '/api/submit',
    formSubmitUrl: 'https://formsubmit.co/ajax/govindcs33@gmail.com'
  };

  // Step Meta Data for Context Rail
  const STEP_METAS = {
    1: {
      tag: 'Step 01 / 06',
      name: 'Context',
      heading: 'Client & Stakeholder',
      desc: 'Introduce yourself and your company so we can calibrate the architectural review.'
    },
    2: {
      tag: 'Step 02 / 06',
      name: 'Scope',
      heading: 'Commission Scope',
      desc: 'Define the format and business priorities for this development engagement.'
    },
    3: {
      tag: 'Step 03 / 06',
      name: 'Aesthetic',
      heading: 'Visual Standard',
      desc: 'Specify design direction and the current state of brand assets and guidelines.'
    },
    4: {
      tag: 'Step 04 / 06',
      name: 'Architecture',
      heading: 'Technical Capabilities',
      desc: 'Select required engineering features, database needs, and launch milestone.'
    },
    5: {
      tag: 'Step 05 / 06',
      name: 'Investment',
      heading: 'Investment Tier',
      desc: 'Choose the scope tier and governance team responsible for project approval.'
    },
    6: {
      tag: 'Step 06 / 06',
      name: 'Specification',
      heading: 'Executive Brief',
      desc: 'Review your compiled specification sheet and transmit directly to Govind.'
    }
  };

  // State
  const state = {
    clientName: '',
    companyName: '',
    clientEmail: '',
    clientWebsite: '',
    isStartingFresh: false,
    clientRole: 'Founder / CEO',
    projectScope: 'Flagship Web Experience',
    objectives: ['High Inquiries & Conversion', 'Category Authority & Prestige'],
    aestheticWorld: 'Minimalist Studio Clean',
    inspirationLinks: '',
    brandHeritage: 'Complete Design System Ready',
    capabilities: ['Custom CMS / Headless', 'High-Performance SEO', 'Advanced Micro-Interactions'],
    targetTimeline: 'Standard Build (4-6 Weeks)',
    budgetTier: 'Flagship Experience ($5,000 - $10,000)',
    decisionMakers: 'Solo Decision Maker',
    additionalNotes: ''
  };

  // DOM Cache
  const form = document.getElementById('high-pass-form');
  const panels = document.querySelectorAll('.slide-panel');
  const stepSegments = document.querySelectorAll('.step-segment');
  const progressBar = document.getElementById('progress-bar');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const nextBtnText = document.getElementById('next-btn-text');
  const slideCount = document.getElementById('slide-count');
  const saveStatus = document.getElementById('save-status');
  const btnResetDraft = document.getElementById('btn-reset-draft');
  const btnFreshCanvas = document.getElementById('btn-fresh-canvas');
  const clientWebsiteInput = document.getElementById('client-website');
  const toast = document.getElementById('pass-toast');
  const toastMessage = document.getElementById('toast-message');

  // Rail Elements
  const railStepTag = document.getElementById('rail-step-tag');
  const railStepName = document.getElementById('rail-step-name');
  const railHeading = document.getElementById('rail-heading');
  const railDescription = document.getElementById('rail-description');
  
  // Snapshot Elements
  const snapClient = document.getElementById('snap-client');
  const snapScope = document.getElementById('snap-scope');
  const snapAesthetic = document.getElementById('snap-aesthetic');
  const snapTimeline = document.getElementById('snap-timeline');
  const snapBudget = document.getElementById('snap-budget');

  // Spec Elements
  const dossierBody = document.getElementById('dossier-body');
  const dossierTimestamp = document.getElementById('dossier-timestamp');
  const btnTransmitEmail = document.getElementById('btn-transmit-email');
  const btnCopyBrief = document.getElementById('btn-copy-brief');
  const btnDownloadBrief = document.getElementById('btn-download-brief');
  const btnAmendAnswers = document.getElementById('btn-amend-answers');

  /* ==========================================================================
     INITIALIZATION & STORAGE
     ========================================================================== */
  function init() {
    loadFromStorage();
    syncStateToDOM();
    updateSnapshot();
    renderStep(currentStep);
    bindEvents();

    if (dossierTimestamp) {
      dossierTimestamp.textContent = new Date().toISOString().slice(0, 10);
    }
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed.state || {});
        if (parsed.currentStep && parsed.currentStep >= 1 && parsed.currentStep <= TOTAL_STEPS) {
          currentStep = parsed.currentStep;
        }
      }
    } catch (e) {
      console.warn('Storage restore error', e);
    }
  }

  function saveToStorage() {
    syncDOMToState();
    updateSnapshot();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        state,
        currentStep,
        timestamp: Date.now()
      }));
      indicateSaveStatus();
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }

  function indicateSaveStatus() {
    if (!saveStatus) return;
    const text = saveStatus.querySelector('.save-status-text');
    if (text) text.textContent = 'Draft saved';
    saveStatus.style.opacity = '1';
    clearTimeout(saveStatus._timer);
    saveStatus._timer = setTimeout(() => {
      if (text) text.textContent = 'Draft saved locally';
    }, 2000);
  }

  /* ==========================================================================
     STATE SYNCHRONIZATION
     ========================================================================== */
  function syncDOMToState() {
    const clientNameInput = document.getElementById('client-name');
    const companyNameInput = document.getElementById('company-name');
    const clientEmailInput = document.getElementById('client-email');
    const inspirationInput = document.getElementById('inspiration-links');
    const additionalNotesInput = document.getElementById('additional-notes');

    if (clientNameInput) state.clientName = clientNameInput.value.trim();
    if (companyNameInput) state.companyName = companyNameInput.value.trim();
    if (clientEmailInput) state.clientEmail = clientEmailInput.value.trim();
    if (clientWebsiteInput && !state.isStartingFresh) {
      state.clientWebsite = clientWebsiteInput.value.trim();
    }
    if (inspirationInput) state.inspirationLinks = inspirationInput.value.trim();
    if (additionalNotesInput) state.additionalNotes = additionalNotesInput.value.trim();

    // Radio fields
    const roleChecked = document.querySelector('input[name="clientRole"]:checked');
    if (roleChecked) state.clientRole = roleChecked.value;

    const scopeChecked = document.querySelector('input[name="projectScope"]:checked');
    if (scopeChecked) state.projectScope = scopeChecked.value;

    const aestheticChecked = document.querySelector('input[name="aestheticWorld"]:checked');
    if (aestheticChecked) state.aestheticWorld = aestheticChecked.value;

    const brandChecked = document.querySelector('input[name="brandHeritage"]:checked');
    if (brandChecked) state.brandHeritage = brandChecked.value;

    const timelineChecked = document.querySelector('input[name="targetTimeline"]:checked');
    if (timelineChecked) state.targetTimeline = timelineChecked.value;

    const budgetChecked = document.querySelector('input[name="budgetTier"]:checked');
    if (budgetChecked) state.budgetTier = budgetChecked.value;

    const decisionChecked = document.querySelector('input[name="decisionMakers"]:checked');
    if (decisionChecked) state.decisionMakers = decisionChecked.value;

    // Checkboxes (Capabilities)
    const capChecked = document.querySelectorAll('input[name="capabilities"]:checked');
    state.capabilities = Array.from(capChecked).map(cb => cb.value);

    // Toggle chips (Objectives)
    const activeChips = document.querySelectorAll('.toggle-chip.active');
    state.objectives = Array.from(activeChips).map(chip => chip.getAttribute('data-val'));
  }

  function syncStateToDOM() {
    const clientNameInput = document.getElementById('client-name');
    const companyNameInput = document.getElementById('company-name');
    const clientEmailInput = document.getElementById('client-email');
    const inspirationInput = document.getElementById('inspiration-links');
    const additionalNotesInput = document.getElementById('additional-notes');

    if (clientNameInput && state.clientName) clientNameInput.value = state.clientName;
    if (companyNameInput && state.companyName) companyNameInput.value = state.companyName;
    if (clientEmailInput && state.clientEmail) clientEmailInput.value = state.clientEmail;
    if (clientWebsiteInput) {
      if (state.isStartingFresh) {
        clientWebsiteInput.value = '';
        clientWebsiteInput.disabled = true;
        clientWebsiteInput.placeholder = 'Starting from clean slate (New Build)';
        if (btnFreshCanvas) btnFreshCanvas.setAttribute('data-active', 'true');
      } else {
        clientWebsiteInput.value = state.clientWebsite;
        clientWebsiteInput.disabled = false;
        if (btnFreshCanvas) btnFreshCanvas.setAttribute('data-active', 'false');
      }
    }
    if (inspirationInput && state.inspirationLinks) inspirationInput.value = state.inspirationLinks;
    if (additionalNotesInput && state.additionalNotes) additionalNotesInput.value = state.additionalNotes;

    // Radios
    setRadioValue('clientRole', state.clientRole);
    setRadioValue('projectScope', state.projectScope);
    setRadioValue('aestheticWorld', state.aestheticWorld);
    setRadioValue('brandHeritage', state.brandHeritage);
    setRadioValue('targetTimeline', state.targetTimeline);
    setRadioValue('budgetTier', state.budgetTier);
    setRadioValue('decisionMakers', state.decisionMakers);

    // Cards highlight classes
    document.querySelectorAll('.option-card').forEach(card => {
      const r = card.querySelector('input[type="radio"]');
      if (r && r.checked) card.classList.add('selected');
      else card.classList.remove('selected');
    });

    document.querySelectorAll('.tier-card').forEach(card => {
      const r = card.querySelector('input[type="radio"]');
      if (r && r.checked) card.classList.add('selected');
      else card.classList.remove('selected');
    });

    // Checkboxes
    document.querySelectorAll('input[name="capabilities"]').forEach(cb => {
      cb.checked = state.capabilities.includes(cb.value);
    });

    // Chips
    document.querySelectorAll('.toggle-chip').forEach(chip => {
      const val = chip.getAttribute('data-val');
      if (state.objectives.includes(val)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  function setRadioValue(name, value) {
    const radio = document.querySelector(`input[name="${name}"][value="${CSS.escape(value)}"]`);
    if (radio) radio.checked = true;
  }

  function updateSnapshot() {
    if (snapClient) {
      if (state.companyName && state.clientName) {
        snapClient.textContent = `${state.companyName} (${state.clientName})`;
      } else if (state.companyName) {
        snapClient.textContent = state.companyName;
      } else if (state.clientName) {
        snapClient.textContent = state.clientName;
      } else {
        snapClient.textContent = 'Not specified';
      }
    }

    if (snapScope) snapScope.textContent = state.projectScope;
    if (snapAesthetic) snapAesthetic.textContent = state.aestheticWorld;
    if (snapTimeline) snapTimeline.textContent = state.targetTimeline;
    if (snapBudget) {
      // Shorten display
      if (state.budgetTier.includes('Minimal')) snapBudget.textContent = 'Focused ($2.5k - $5k)';
      else if (state.budgetTier.includes('Flagship')) snapBudget.textContent = 'Flagship ($5k - $10k)';
      else if (state.budgetTier.includes('Enterprise')) snapBudget.textContent = 'Enterprise ($10k+)';
      else snapBudget.textContent = state.budgetTier;
    }
  }

  /* ==========================================================================
     STEP TRANSITIONS & VALIDATION
     ========================================================================== */
  function renderStep(step) {
    currentStep = Math.max(1, Math.min(step, TOTAL_STEPS));

    // Panels
    panels.forEach(panel => {
      const panelStep = parseInt(panel.getAttribute('data-step'), 10);
      if (panelStep === currentStep) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Stepper segments
    stepSegments.forEach(seg => {
      const segStep = parseInt(seg.getAttribute('data-step'), 10);
      seg.classList.remove('active', 'completed');
      if (segStep === currentStep) {
        seg.classList.add('active');
      } else if (segStep < currentStep) {
        seg.classList.add('completed');
      }
    });

    // Progress bar
    const percent = ((currentStep) / TOTAL_STEPS) * 100;
    if (progressBar) progressBar.style.width = `${percent}%`;

    // Rail Context
    const meta = STEP_METAS[currentStep];
    if (meta) {
      if (railStepTag) railStepTag.textContent = meta.tag;
      if (railStepName) railStepName.textContent = meta.name;
      if (railHeading) railHeading.textContent = meta.heading;
      if (railDescription) railDescription.textContent = meta.desc;
    }

    // Dock Controls
    if (slideCount) slideCount.textContent = `0${currentStep} / 0${TOTAL_STEPS}`;
    if (btnPrev) btnPrev.disabled = (currentStep === 1);

    if (nextBtnText) {
      if (currentStep === 5) {
        nextBtnText.textContent = 'Review Brief';
      } else if (currentStep === 6) {
        nextBtnText.textContent = 'Finish';
      } else {
        nextBtnText.textContent = 'Continue';
      }
    }

    if (btnNext) {
      btnNext.style.display = (currentStep === 6) ? 'none' : 'inline-flex';
    }

    // Render dossier when entering step 6
    if (currentStep === 6) {
      renderDossier();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    saveToStorage();
  }

  function advanceStep() {
    if (!validateCurrentStep()) return;
    if (currentStep < TOTAL_STEPS) {
      renderStep(currentStep + 1);
    }
  }

  function retreatStep() {
    if (currentStep > 1) {
      renderStep(currentStep - 1);
    }
  }

  function validateCurrentStep() {
    syncDOMToState();

    if (currentStep === 1) {
      const nameInput = document.getElementById('client-name');
      const companyInput = document.getElementById('company-name');
      const emailInput = document.getElementById('client-email');

      let isValid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!state.clientName) {
        shakeElement(nameInput);
        isValid = false;
      }
      if (!state.companyName) {
        shakeElement(companyInput);
        isValid = false;
      }
      if (!state.clientEmail || !emailRegex.test(state.clientEmail)) {
        shakeElement(emailInput);
        isValid = false;
      }

      if (!isValid) {
        showToast('Please enter your name, company, and a valid email.');
        return false;
      }
    }

    return true;
  }

  function shakeElement(el) {
    if (!el) return;
    el.focus();
    el.style.borderColor = '#ef4444';
    el.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }, 2000);
  }

  /* ==========================================================================
     DOSSIER & BRIEF COMPILER
     ========================================================================== */
  function renderDossier() {
    syncDOMToState();

    const domainDisplay = state.isStartingFresh
      ? 'Clean Slate (Ground-up Build)'
      : (state.clientWebsite || 'None specified');

    const capabilitiesList = state.capabilities.length > 0
      ? state.capabilities.join(', ')
      : 'Standard High-Performance Architecture';

    const objectivesList = state.objectives.length > 0
      ? state.objectives.join(', ')
      : 'Bespoke Experience & High Authority';

    const sections = [
      {
        heading: '1. CLIENT PROFILE',
        items: [
          `Contact: ${state.clientName} (${state.clientRole})`,
          `Brand: ${state.companyName}`,
          `Email: ${state.clientEmail}`,
          `Domain: ${domainDisplay}`
        ]
      },
      {
        heading: '2. COMMISSION AMBITION',
        items: [
          `Scope: ${state.projectScope}`,
          `Focal Outcomes: ${objectivesList}`
        ]
      },
      {
        heading: '3. AESTHETIC DIRECTION',
        items: [
          `Visual Standard: ${state.aestheticWorld}`,
          `Brand Assets: ${state.brandHeritage}`,
          `Inspirations: ${state.inspirationLinks || 'None provided'}`
        ]
      },
      {
        heading: '4. TECHNICAL ARCHITECTURE',
        items: [
          `Capabilities: ${capabilitiesList}`,
          `Target Timeline: ${state.targetTimeline}`
        ]
      },
      {
        heading: '5. INVESTMENT & GOVERNANCE',
        items: [
          `Investment Tier: ${state.budgetTier}`,
          `Decision Maker: ${state.decisionMakers}`,
          `Additional Notes: ${state.additionalNotes || 'None'}`
        ]
      }
    ];

    if (dossierBody) {
      dossierBody.innerHTML = sections.map(s => `
        <div style="margin-bottom: 16px;">
          <div style="color: var(--accent-primary); font-weight: 600; margin-bottom: 6px; letter-spacing: 0.05em;">${escapeHtml(s.heading)}</div>
          ${s.items.map(item => `<div style="padding-left: 8px; border-left: 1px solid var(--border-default); margin-bottom: 4px; color: var(--text-primary);">${escapeHtml(item)}</div>`).join('')}
        </div>
      `).join('');
    }
  }

  function buildMarkdownBrief() {
    syncDOMToState();
    const dateStr = new Date().toISOString().slice(0, 10);

    return `# THE HIGH PASS: CLIENT DISCOVERY SPECIFICATION
Date: ${dateStr}
Project: ${state.companyName}

---

## 1. Client Context
- Name: ${state.clientName}
- Company / Brand: ${state.companyName}
- Role: ${state.clientRole}
- Email: ${state.clientEmail}
- Current Domain: ${state.isStartingFresh ? 'Clean Slate (New Build)' : (state.clientWebsite || 'None specified')}

## 2. Project Scope & Ambition
- Scope: ${state.projectScope}
- Focal Outcomes: ${state.objectives.join(', ') || 'High Authority & Performance'}

## 3. Visual Standard & Aesthetics
- Visual Standard: ${state.aestheticWorld}
- Brand Assets: ${state.brandHeritage}
- References: ${state.inspirationLinks || 'None provided'}

## 4. Technical Architecture
- Capabilities: ${state.capabilities.join(', ') || 'Custom Static Architecture'}
- Target Timeline: ${state.targetTimeline}

## 5. Investment & Governance
- Investment Tier: ${state.budgetTier}
- Decision Maker: ${state.decisionMakers}
- Additional Notes: ${state.additionalNotes || 'None'}

---
Compiled via The High Pass Studio Discovery Console
`;
  }

  /* ==========================================================================
     TRANSMISSION & ACTIONS
     ========================================================================== */
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

    // 1. Try internal /api/submit Cloudflare endpoint
    try {
      const apiRes = await fetch(CONFIG.apiSubmitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (apiRes.ok) sent = true;
    } catch (e) {
      // Offline or local dev fallback
    }

    // 2. Try FormSubmit AJAX delivery
    if (!sent && CONFIG.formSubmitUrl) {
      try {
        const formData = new FormData();
        formData.append('_subject', `[Commission Spec] ${state.companyName}: ${state.projectScope}`);
        formData.append('_replyto', state.clientEmail);
        formData.append('Client Name', `${state.clientName} (${state.clientRole})`);
        formData.append('Company', state.companyName);
        formData.append('Email', state.clientEmail);
        formData.append('Website', payload.clientWebsite);
        formData.append('Scope', state.projectScope);
        formData.append('Objectives', payload.objectives);
        formData.append('Aesthetic', state.aestheticWorld);
        formData.append('Capabilities', payload.capabilities);
        formData.append('Timeline', state.targetTimeline);
        formData.append('Budget Tier', state.budgetTier);
        formData.append('Decision Maker', state.decisionMakers);
        formData.append('Notes', state.additionalNotes || 'None');
        formData.append('Full Brief', brief);

        const res = await fetch(CONFIG.formSubmitUrl, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        if (res.ok) sent = true;
      } catch (err) {
        console.warn('FormSubmit dispatch failed', err);
      }
    }

    if (sent) {
      showToast('Specification dispatched to Govind');
      if (primaryCard) {
        primaryCard.innerHTML = `
          <div style="padding: 16px 0;">
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); margin-bottom: 8px; font-weight: 600;">TRANSMISSION CONFIRMED</div>
            <div style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Specification Dispatched</div>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">Your project brief was transmitted to <strong>govindcs33@gmail.com</strong> for architectural review.</p>
            <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">Direct review window: 24 to 48 hours</div>
          </div>
        `;
      }
    } else {
      // Fallback: mailto
      const subject = encodeURIComponent(`[Commission Spec] ${state.companyName}: ${state.projectScope}`);
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
        showToast('Brief copied to clipboard');
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
      showToast('Brief copied to clipboard');
    } catch (e) {
      showToast('Could not copy automatically');
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

  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
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

    // Stepper segments direct navigation
    stepSegments.forEach(seg => {
      seg.addEventListener('click', () => {
        const targetStep = parseInt(seg.getAttribute('data-step'), 10);
        if (targetStep < currentStep) {
          renderStep(targetStep);
        } else if (targetStep > currentStep) {
          if (validateCurrentStep()) {
            renderStep(targetStep);
          }
        }
      });
    });

    // Reset draft
    btnResetDraft?.addEventListener('click', () => {
      if (confirm('Clear all answers and reset draft?')) {
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

    // Option cards selection
    document.querySelectorAll('.option-card').forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      card.addEventListener('click', () => {
        if (radio) {
          radio.checked = true;
          const groupName = radio.getAttribute('name');
          document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
            const parent = r.closest('.option-card');
            if (parent) parent.classList.remove('selected');
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
          showToast('Select up to 2 target outcomes.');
          return;
        }

        chip.classList.toggle('active');
        saveToStorage();
      });
    });

    // Capabilities checkboxes
    document.querySelectorAll('input[name="capabilities"]').forEach(cb => {
      cb.addEventListener('change', saveToStorage);
    });

    // Pill radios
    document.querySelectorAll('.pill-item input[type="radio"]').forEach(r => {
      r.addEventListener('change', saveToStorage);
    });

    // Inputs auto-save & snapshot update
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

    // Actions
    btnTransmitEmail?.addEventListener('click', transmitCommission);
    btnCopyBrief?.addEventListener('click', copyBriefToClipboard);
    btnDownloadBrief?.addEventListener('click', downloadBriefFile);
    btnAmendAnswers?.addEventListener('click', () => renderStep(1));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
