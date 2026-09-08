/**
 * THE HIGH PASS : CLIENT INFORMATION COLLECTION
 * Clean Minimalist Architecture & State Management
 * Strict adherence to design-taste-frontend directives
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'high_pass_studio_v6';
  const TOTAL_STEPS = 6;
  let currentStep = 1;

  // Cloud & Delivery Configuration
  const CONFIG = {
    destinationEmail: 'govindcs33@gmail.com',
    apiSubmitEndpoint: '/api/submit',
    localApiSubmitEndpoint: 'http://localhost:3001/api/submit',
    formSubmitUrl: 'https://formsubmit.co/ajax/govindcs33@gmail.com',
    resendApiKey: '', // Managed securely via backend environment variables (.env / Cloudflare)
    resendFromDomain: 'aihaving.fun' // Verified domain
  };

  // Step Meta Data for Context Rail
  const STEP_METAS = {
    1: {
      tag: 'Step 01 / 06',
      name: 'Basics',
      heading: 'About You & Your Business',
      desc: 'Introduce yourself and what you are building so we can tailor our recommendations.'
    },
    2: {
      tag: 'Step 02 / 06',
      name: 'Project',
      heading: 'What You Want to Build',
      desc: 'Choose the project type and business priorities that matter most to you.'
    },
    3: {
      tag: 'Step 03 / 06',
      name: 'Style',
      heading: 'Look, Feel & Vibe',
      desc: 'Pick how you want your business to be perceived by potential clients.'
    },
    4: {
      tag: 'Step 04 / 06',
      name: 'Features',
      heading: 'Features & Capabilities',
      desc: 'Select the key features and launch timeline you are aiming for.'
    },
    5: {
      tag: 'Step 05 / 06',
      name: 'Budget',
      heading: 'Investment & Planning',
      desc: 'Pick the budget range that fits your comfort zone and how decisions will be made.'
    },
    6: {
      tag: 'Step 06 / 06',
      name: 'Review',
      heading: 'Your Project Summary',
      desc: 'Review your compiled project summary and send it directly to The High Pass.'
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
    businessSummary: '',
    projectScope: 'A New Company or Brand Website',
    objectives: ['Get More Inquiries & Leads', 'Elevate Credibility & Trust', 'Explain Our Product or Service Clearly'],
    projectNotes: '',
    aestheticWorld: 'Professional & High-Trust',
    brandHeritage: 'Full Brand Guidelines & Assets Ready',
    inspirationLinks: '',
    stylePreferences: '',
    capabilities: ['Easy Content Editing (CMS)', 'Contact & Inquiry Forms', 'Fast Speed & Google SEO', 'Smooth Micro-Animations'],
    targetTimeline: 'Standard Pace (4-6 Weeks)',
    integrationNotes: '',
    budgetTier: 'Complete Business Website (₹45,000 - ₹1,00,000)',
    decisionMakers: "I'm the primary decision maker (fast approval)",
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
    const businessSummaryInput = document.getElementById('business-summary');
    const projectNotesInput = document.getElementById('project-notes');
    const inspirationInput = document.getElementById('inspiration-links');
    const stylePreferencesInput = document.getElementById('style-preferences');
    const integrationNotesInput = document.getElementById('integration-notes');
    const additionalNotesInput = document.getElementById('additional-notes');

    if (clientNameInput) state.clientName = clientNameInput.value.trim();
    if (companyNameInput) state.companyName = companyNameInput.value.trim();
    if (clientEmailInput) state.clientEmail = clientEmailInput.value.trim();
    if (clientWebsiteInput && !state.isStartingFresh) {
      state.clientWebsite = clientWebsiteInput.value.trim();
    }
    if (businessSummaryInput) state.businessSummary = businessSummaryInput.value.trim();
    if (projectNotesInput) state.projectNotes = projectNotesInput.value.trim();
    if (inspirationInput) state.inspirationLinks = inspirationInput.value.trim();
    if (stylePreferencesInput) state.stylePreferences = stylePreferencesInput.value.trim();
    if (integrationNotesInput) state.integrationNotes = integrationNotesInput.value.trim();
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
    const businessSummaryInput = document.getElementById('business-summary');
    const projectNotesInput = document.getElementById('project-notes');
    const inspirationInput = document.getElementById('inspiration-links');
    const stylePreferencesInput = document.getElementById('style-preferences');
    const integrationNotesInput = document.getElementById('integration-notes');
    const additionalNotesInput = document.getElementById('additional-notes');

    if (clientNameInput && state.clientName) clientNameInput.value = state.clientName;
    if (companyNameInput && state.companyName) companyNameInput.value = state.companyName;
    if (clientEmailInput && state.clientEmail) clientEmailInput.value = state.clientEmail;
    if (clientWebsiteInput) {
      if (state.isStartingFresh) {
        clientWebsiteInput.value = '';
        clientWebsiteInput.disabled = true;
        clientWebsiteInput.placeholder = 'Starting fresh (No website yet)';
        if (btnFreshCanvas) btnFreshCanvas.setAttribute('data-active', 'true');
      } else {
        clientWebsiteInput.value = state.clientWebsite;
        clientWebsiteInput.disabled = false;
        clientWebsiteInput.placeholder = 'https://yoursite.com';
        if (btnFreshCanvas) btnFreshCanvas.setAttribute('data-active', 'false');
      }
    }
    if (businessSummaryInput && state.businessSummary) businessSummaryInput.value = state.businessSummary;
    if (projectNotesInput && state.projectNotes) projectNotesInput.value = state.projectNotes;
    if (inspirationInput && state.inspirationLinks) inspirationInput.value = state.inspirationLinks;
    if (stylePreferencesInput && state.stylePreferences) stylePreferencesInput.value = state.stylePreferences;
    if (integrationNotesInput && state.integrationNotes) integrationNotesInput.value = state.integrationNotes;
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

    if (snapScope) {
      if (state.projectScope.includes('New Company')) snapScope.textContent = 'New Brand Website';
      else if (state.projectScope.includes('Redesign')) snapScope.textContent = 'Website Redesign';
      else if (state.projectScope.includes('Landing Page')) snapScope.textContent = 'Landing Page';
      else if (state.projectScope.includes('Web App')) snapScope.textContent = 'Web App / Tool';
      else snapScope.textContent = state.projectScope;
    }

    if (snapAesthetic) snapAesthetic.textContent = state.aestheticWorld;

    if (snapTimeline) {
      if (state.targetTimeline.includes('2-3')) snapTimeline.textContent = 'Rush (2-3 Wks)';
      else if (state.targetTimeline.includes('4-6')) snapTimeline.textContent = 'Standard (4-6 Wks)';
      else if (state.targetTimeline.includes('2+')) snapTimeline.textContent = 'Flexible (2+ Mos)';
      else snapTimeline.textContent = state.targetTimeline;
    }

    if (snapBudget) {
      if (state.budgetTier.includes('Focused') || state.budgetTier.includes('15')) snapBudget.textContent = 'Focused (₹15k - ₹25k)';
      else if (state.budgetTier.includes('Business') || state.budgetTier.includes('45')) snapBudget.textContent = 'Business Site (₹45k - ₹1L)';
      else if (state.budgetTier.includes('Platform') || state.budgetTier.includes('2')) snapBudget.textContent = 'Platform (₹2L+)';
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
    setTimeout(checkScrollCues, 150);
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
      ? 'Starting Fresh (No existing website)'
      : (state.clientWebsite || 'None specified');

    const capabilitiesList = state.capabilities.length > 0
      ? state.capabilities.join(', ')
      : 'Standard Web Features';

    const objectivesList = state.objectives.length > 0
      ? state.objectives.join(', ')
      : 'Brand Credibility & Inquiries';

    const sections = [
      {
        heading: '1. ABOUT YOU & YOUR BUSINESS',
        items: [
          `Contact: ${state.clientName || 'Not specified'} (${state.clientRole})`,
          `Company / Brand: ${state.companyName || 'Not specified'}`,
          `Email: ${state.clientEmail || 'Not specified'}`,
          `Current Website: ${domainDisplay}`,
          ...(state.businessSummary ? [`What they do: ${state.businessSummary}`] : [])
        ]
      },
      {
        heading: '2. PROJECT GOALS & SCOPE',
        items: [
          `Project Type: ${state.projectScope}`,
          `Main Goals: ${objectivesList}`,
          ...(state.projectNotes ? [`Project Context: ${state.projectNotes}`] : [])
        ]
      },
      {
        heading: '3. LOOK, FEEL & STYLE',
        items: [
          `Visual Direction: ${state.aestheticWorld}`,
          `Design Assets: ${state.brandHeritage}`,
          `Sites Admired: ${state.inspirationLinks || 'None provided'}`,
          ...(state.stylePreferences ? [`Style Preferences: ${state.stylePreferences}`] : [])
        ]
      },
      {
        heading: '4. FEATURES & TIMELINE',
        items: [
          `Features Needed: ${capabilitiesList}`,
          `Target Launch: ${state.targetTimeline}`,
          ...(state.integrationNotes ? [`App Integrations: ${state.integrationNotes}`] : [])
        ]
      },
      {
        heading: '5. INVESTMENT & PLANNING',
        items: [
          `Budget Range: ${state.budgetTier}`,
          `Decision Process: ${state.decisionMakers}`,
          ...(state.additionalNotes ? [`Additional Notes: ${state.additionalNotes}`] : [])
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
    const domainDisplay = state.isStartingFresh
      ? 'Starting Fresh (No existing website)'
      : (state.clientWebsite || 'None specified');

    return `# THE HIGH PASS: CLIENT PROJECT SUMMARY
Date: ${dateStr}
Project: ${state.companyName || 'Untitled Project'}

---

## 1. About You & Your Business
- Name: ${state.clientName || 'Not specified'}
- Role: ${state.clientRole}
- Company / Brand: ${state.companyName || 'Not specified'}
- Email: ${state.clientEmail || 'Not specified'}
- Current Website: ${domainDisplay}
${state.businessSummary ? `- What We Do: ${state.businessSummary}\n` : ''}
## 2. What You Want to Build
- Project Type: ${state.projectScope}
- Main Goals: ${state.objectives.join(', ') || 'High Quality Web Presence'}
${state.projectNotes ? `- Project Context: ${state.projectNotes}\n` : ''}
## 3. Look, Feel & Style
- Visual Direction: ${state.aestheticWorld}
- Design Assets: ${state.brandHeritage}
- Sites Admired: ${state.inspirationLinks || 'None provided'}
${state.stylePreferences ? `- Style Preferences: ${state.stylePreferences}\n` : ''}
## 4. Features & Capabilities
- Features Needed: ${state.capabilities.join(', ') || 'Custom Web Experience'}
- Target Launch: ${state.targetTimeline}
${state.integrationNotes ? `- App Integrations: ${state.integrationNotes}\n` : ''}
## 5. Investment & Planning
- Budget Range: ${state.budgetTier}
- Decision Making: ${state.decisionMakers}
- Additional Notes: ${state.additionalNotes || 'None'}

---
Compiled via The High Pass Client Information Collection
`;
  }

  /* ==========================================================================
     HTML TABULATED EMAIL BUILDER & TRANSMISSION
     ========================================================================== */
  function buildHtmlTableBrief(data, isClientCopy) {
    const domainDisplay = data.isStartingFresh
      ? 'Starting Fresh (No existing website)'
      : (data.clientWebsite || 'None specified');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>The High Pass Project Summary</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px; color: #18181b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #09090b; padding: 24px; text-align: center; }
    .header h1 { color: #fafafa; margin: 0; font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; }
    .header p { color: #a1a1aa; margin: 4px 0 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
    .body { padding: 28px; }
    .intro { font-size: 15px; color: #27272a; margin-top: 0; margin-bottom: 20px; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    th, td { padding: 11px 14px; text-align: left; vertical-align: top; border-bottom: 1px solid #f4f4f5; }
    th { width: 34%; font-weight: 600; color: #52525b; background-color: #fafafa; border-right: 1px solid #f4f4f5; }
    td { color: #09090b; }
    .notice-box { background: #f8fafc; border-left: 3px solid #09090b; padding: 14px 16px; margin: 20px 0 8px; font-size: 14px; color: #18181b; font-weight: 500; border-radius: 0 4px 4px 0; }
    .footer { background: #fafafa; border-top: 1px solid #f4f4f5; padding: 16px; text-align: center; font-size: 11px; color: #a1a1aa; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>THE HIGH PASS</h1>
      <p>Client Information &amp; Project Intake</p>
    </div>
    <div class="body">
      <p class="intro">
        ${isClientCopy
        ? 'You have filled up a form at <strong>The High Pass</strong>. Here is a summary of the details you submitted:'
        : `A new project intake form was submitted by <strong>${escapeHtml(data.clientName || 'Client')}</strong> for <strong>${escapeHtml(data.companyName || 'Brand')}</strong>:`
      }
      </p>
      <table>
        <tbody>
          <tr><th>Contact Name</th><td>${escapeHtml(data.clientName || 'Not specified')} (${escapeHtml(data.clientRole || 'Not specified')})</td></tr>
          <tr><th>Company / Brand</th><td>${escapeHtml(data.companyName || 'Not specified')}</td></tr>
          <tr><th>Email Address</th><td><a href="mailto:${escapeHtml(data.clientEmail)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(data.clientEmail || 'Not specified')}</a></td></tr>
          <tr><th>Current Website</th><td>${escapeHtml(domainDisplay)}</td></tr>
          ${data.businessSummary ? `<tr><th>What We Do</th><td>${escapeHtml(data.businessSummary)}</td></tr>` : ''}
          <tr><th>Project Type</th><td><strong>${escapeHtml(data.projectScope || 'Not specified')}</strong></td></tr>
          <tr><th>Main Priorities</th><td>${escapeHtml(data.objectives.join ? data.objectives.join(', ') : data.objectives || 'None selected')}</td></tr>
          ${data.projectNotes ? `<tr><th>Project Notes</th><td>${escapeHtml(data.projectNotes)}</td></tr>` : ''}
          <tr><th>Look &amp; Feel</th><td>${escapeHtml(data.aestheticWorld || 'Not specified')}</td></tr>
          <tr><th>Design Assets</th><td>${escapeHtml(data.brandHeritage || 'Not specified')}</td></tr>
          ${data.stylePreferences ? `<tr><th>Style Preferences</th><td>${escapeHtml(data.stylePreferences)}</td></tr>` : ''}
          ${data.inspirationLinks ? `<tr><th>Sites Admired</th><td>${escapeHtml(data.inspirationLinks)}</td></tr>` : ''}
          <tr><th>Features Needed</th><td>${escapeHtml(data.capabilities.join ? data.capabilities.join(', ') : data.capabilities || 'Standard Web Features')}</td></tr>
          <tr><th>Target Launch</th><td>${escapeHtml(data.targetTimeline || 'Not specified')}</td></tr>
          ${data.integrationNotes ? `<tr><th>Tool Integrations</th><td>${escapeHtml(data.integrationNotes)}</td></tr>` : ''}
          <tr><th>Investment Range</th><td><strong style="color: #09090b;">${escapeHtml(data.budgetTier || 'Not specified')}</strong></td></tr>
          <tr><th>Decision Making</th><td>${escapeHtml(data.decisionMakers || 'Not specified')}</td></tr>
          ${data.additionalNotes ? `<tr><th>Additional Notes</th><td>${escapeHtml(data.additionalNotes)}</td></tr>` : ''}
        </tbody>
      </table>
      <div class="notice-box">
        Somebody will reach out to you within 24 to 48 hours.
      </div>
    </div>
    <div class="footer">
      THE HIGH PASS &bull; CLIENT PROJECT INTAKE
    </div>
  </div>
</body>
</html>`;
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
      if (transmitLabel) transmitLabel.textContent = 'Sending Project Brief...';
      if (transmitArrow) transmitArrow.textContent = '...';
    }

    const payload = {
      timestamp: new Date().toISOString(),
      clientName: state.clientName,
      companyName: state.companyName,
      clientEmail: state.clientEmail,
      clientRole: state.clientRole,
      clientWebsite: state.isStartingFresh ? 'Starting Fresh (No existing website)' : state.clientWebsite,
      businessSummary: state.businessSummary,
      projectScope: state.projectScope,
      objectives: state.objectives.join(', '),
      projectNotes: state.projectNotes,
      aestheticWorld: state.aestheticWorld,
      brandHeritage: state.brandHeritage,
      inspirationLinks: state.inspirationLinks,
      stylePreferences: state.stylePreferences,
      capabilities: state.capabilities.join(', '),
      targetTimeline: state.targetTimeline,
      integrationNotes: state.integrationNotes,
      budgetTier: state.budgetTier,
      decisionMakers: state.decisionMakers,
      additionalNotes: state.additionalNotes,
      markdownBrief: brief
    };

    let sent = false;

    // 1. Try serverless /api/submit endpoint (Cloudflare Pages Functions with Resend)
    try {
      const apiRes = await fetch(CONFIG.apiSubmitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          resendApiKey: CONFIG.resendApiKey || undefined,
          resendFromDomain: CONFIG.resendFromDomain || 'aihaving.fun'
        })
      });
      if (apiRes.ok) {
        sent = true;
      }
    } catch (e) {
      // Endpoint unreachable
    }

    // 2. Try local backend server (port 3001) if running locally
    if (!sent && CONFIG.localApiSubmitEndpoint) {
      try {
        const localRes = await fetch(CONFIG.localApiSubmitEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            resendApiKey: CONFIG.resendApiKey || undefined,
            resendFromDomain: CONFIG.resendFromDomain || 'aihaving.fun'
          })
        });
        if (localRes.ok) {
          sent = true;
        }
      } catch (localErr) {
        // Local server unreachable
      }
    }

    // 2. Try direct Resend API call if resendApiKey is set in CONFIG
    if (!sent && CONFIG.resendApiKey) {
      try {
        const fromDomain = CONFIG.resendFromDomain || 'resend.dev';
        const adminHtml = buildHtmlTableBrief(state, false);
        const clientHtml = buildHtmlTableBrief(state, true);

        // A. Email to Govind (From: "High Pass Website")
        const adminPromise = fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CONFIG.resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: `High Pass Website <onboarding@${fromDomain}>`,
            to: [CONFIG.destinationEmail],
            reply_to: state.clientEmail,
            subject: `[The High Pass] Project Summary: ${state.companyName || 'New Client'} (${state.projectScope})`,
            html: adminHtml
          })
        });

        // B. Email to User (From: "The High Pass new Client Submission", Subject: "You have filled up a form at The High Pass")
        const clientPromise = state.clientEmail ? fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CONFIG.resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: `The High Pass new Client Submission <onboarding@${fromDomain}>`,
            to: [state.clientEmail],
            reply_to: CONFIG.destinationEmail,
            subject: 'You have filled up a form at The High Pass',
            html: clientHtml
          })
        }) : Promise.resolve({ ok: true });

        const [adminRes, clientRes] = await Promise.all([adminPromise, clientPromise]);
        if (adminRes.ok && clientRes.ok) {
          sent = true;
        }
      } catch (resendErr) {
        console.warn('Direct Resend dispatch failed:', resendErr);
      }
    }

    // 3. FormSubmit fallback (Sends to Govind only, cleanly formatted as a table, NO _cc to client)
    if (!sent && CONFIG.formSubmitUrl) {
      try {
        const formData = new FormData();
        formData.append('_template', 'table');
        formData.append('_subject', `[The High Pass] Project Summary: ${state.companyName || 'New Client'} (${state.projectScope})`);
        formData.append('_replyto', state.clientEmail);
        formData.append('Client Name', `${state.clientName || 'Not specified'} (${state.clientRole})`);
        formData.append('Company', state.companyName || 'Not specified');
        formData.append('Email', state.clientEmail);
        formData.append('Website', payload.clientWebsite);
        formData.append('What We Do', state.businessSummary || 'Not provided');
        formData.append('Project Type', state.projectScope);
        formData.append('Goals', payload.objectives);
        formData.append('Project Context', state.projectNotes || 'None');
        formData.append('Style', state.aestheticWorld);
        formData.append('Brand Assets', state.brandHeritage);
        formData.append('Style Preferences', state.stylePreferences || 'None');
        formData.append('Features', payload.capabilities);
        formData.append('Timeline', state.targetTimeline);
        formData.append('Tool Integrations', state.integrationNotes || 'None');
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
      showToast('Project brief sent to The High Pass');
      if (primaryCard) {
        primaryCard.innerHTML = `
          <div style="padding: 16px 0;">
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-primary); margin-bottom: 8px; font-weight: 600;">SUBMISSION CONFIRMED</div>
            <div style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Project Summary Sent!</div>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">Your project summary has been received by The High Pass. A confirmation copy has also been sent to your email.</p>
            <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">We will get back to you within 24 to 48 hours for next steps.</div>
          </div>
        `;
      }
    } else {
      // Fallback: mailto
      const subject = encodeURIComponent(`[The High Pass] Project Summary: ${state.companyName || 'New Client'} (${state.projectScope})`);
      const body = encodeURIComponent(brief);
      window.location.href = `mailto:${CONFIG.destinationEmail}?subject=${subject}&body=${body}`;
      showToast('Opening email draft to The High Pass');
      if (btnTransmit) {
        btnTransmit.disabled = false;
        if (transmitLabel) transmitLabel.textContent = 'Send project brief to The High Pass';
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
     SCROLL CUE SYSTEM (VIEWPORT AWARENESS)
     ========================================================================== */
  function checkScrollCues() {
    const scrollCueFloating = document.getElementById('scroll-cue-floating');

    if (currentStep === 6) {
      scrollCueFloating?.classList.add('cue-hidden');
      return;
    }

    const activeSlide = document.querySelector('.slide-panel.active');
    if (!activeSlide) return;

    // Check if bottom of active slide is beyond the current visible viewport
    const slideRect = activeSlide.getBoundingClientRect();
    const windowH = window.innerHeight;
    const hasMoreBelow = (slideRect.bottom > windowH - 60);

    if (hasMoreBelow) {
      scrollCueFloating?.classList.remove('cue-hidden');
    } else {
      scrollCueFloating?.classList.add('cue-hidden');
    }
  }

  function scrollToNextSection() {
    const activeSlide = document.querySelector('.slide-panel.active');
    if (!activeSlide) return;
    const cue = activeSlide.querySelector('.form-section-cue');
    if (cue) {
      cue.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: 380, behavior: 'smooth' });
    }
  }

  /* ==========================================================================
     EVENT BINDINGS
     ========================================================================== */
  function bindEvents() {
    btnPrev?.addEventListener('click', retreatStep);
    btnNext?.addEventListener('click', advanceStep);

    // Floating Scroll Cue Click & Viewport Listeners
    document.getElementById('scroll-cue-floating')?.addEventListener('click', scrollToNextSection);
    window.addEventListener('scroll', checkScrollCues, { passive: true });
    window.addEventListener('resize', checkScrollCues, { passive: true });

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

    // Objectives chips toggle (max 3)
    document.querySelectorAll('.toggle-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const isCurrentlyActive = chip.classList.contains('active');
        const activeCount = document.querySelectorAll('.toggle-chip.active').length;

        if (!isCurrentlyActive && activeCount >= 3) {
          showToast('Select up to 3 target priorities.');
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
    btnAmendAnswers?.addEventListener('click', () => renderStep(1));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
