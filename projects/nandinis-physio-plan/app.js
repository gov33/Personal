/**
 * Nandini's Physio Plan - Visual Interactive Application Logic
 */

// Application State
const APP_STATE = {
  currentView: 'calendar',
  activeDayId: 'monday',
  activePhaseId: 'phase-1',
  userProgress: {
    completedDays: {},      // { monday: true, ... }
    completedExercises: {}, // { 'monday:banded-mwm': true, ... }
    activePhase: 'phase-1'
  },
  activeTimers: {}
};

const STORAGE_KEY = 'nandini_physio_progress_v1';

// Web Audio Soft Chime Generator
function playTimerChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(523.25, now, 0.4);        // C5
    playTone(659.25, now + 0.16, 0.5); // E5
  } catch (e) {}
}

function loadUserProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      APP_STATE.userProgress = {
        completedDays: parsed.completedDays || {},
        completedExercises: parsed.completedExercises || {},
        activePhase: parsed.activePhase || 'phase-1'
      };
      APP_STATE.activePhaseId = APP_STATE.userProgress.activePhase;
    }
  } catch (e) {}
}

function saveUserProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(APP_STATE.userProgress));
  } catch (e) {}
}

// --------------------------------------------------------------------------
// Navigation & Routing
// --------------------------------------------------------------------------
function initRouting() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash.replace('#', '') || 'calendar';
  
  if (hash.startsWith('day-')) {
    const dayId = hash.replace('day-', '');
    const dayExists = PHYSIO_DATA.schedule.some(d => d.id === dayId);
    if (dayExists) {
      APP_STATE.activeDayId = dayId;
      switchView('day-view');
      renderDayView(dayId);
      return;
    }
  }

  if (['calendar', 'exercises', 'phases'].includes(hash)) {
    switchView(hash);
  } else {
    switchView('calendar');
  }
}

function switchView(viewName) {
  APP_STATE.currentView = viewName;
  
  document.querySelectorAll('.nav-tab').forEach(tab => {
    const target = tab.getAttribute('data-view');
    tab.classList.toggle('active', target === viewName || (viewName === 'day-view' && target === 'calendar'));
  });

  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateHeroSummary();

  if (viewName === 'calendar') {
    renderCalendar();
  } else if (viewName === 'exercises') {
    renderExerciseLibrary();
  } else if (viewName === 'phases') {
    renderProgressionView();
  }
}

// --------------------------------------------------------------------------
// Phase Controls
// --------------------------------------------------------------------------
function initPhaseControls() {
  const phasePills = document.querySelectorAll('.phase-toggle-btn');
  phasePills.forEach(btn => {
    btn.addEventListener('click', () => {
      const phaseId = btn.getAttribute('data-phase');
      setPhase(phaseId);
    });
  });

  updateHeroSummary();
}

function setPhase(phaseId) {
  APP_STATE.activePhaseId = phaseId;
  APP_STATE.userProgress.activePhase = phaseId;
  saveUserProgress();
  updateHeroSummary();
  
  if (APP_STATE.currentView === 'phases') {
    renderProgressionView();
  }
}

function updateHeroSummary() {
  const phase = PHYSIO_DATA.phases.find(p => p.id === APP_STATE.activePhaseId) || PHYSIO_DATA.phases[0];
  
  document.querySelectorAll('.phase-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-phase') === phase.id);
  });

  const badgeEl = document.getElementById('hero-phase-badge');
  if (badgeEl) badgeEl.textContent = `Phase ${phase.number}: ${phase.title}`;

  // Calculate completed workout days
  let completedCount = 0;
  let totalActive = 0;
  PHYSIO_DATA.schedule.forEach(day => {
    if (!day.isRest) {
      totalActive++;
      if (APP_STATE.userProgress.completedDays[day.id]) completedCount++;
    }
  });

  const countText = document.getElementById('hero-completion-text');
  const fillBar = document.getElementById('hero-progress-fill');
  if (countText) countText.textContent = `${completedCount} of ${totalActive} Days Complete`;
  if (fillBar) fillBar.style.width = `${Math.round((completedCount / totalActive) * 100)}%`;

  // Determine current day of week to highlight
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayIdx = new Date().getDay();
  const currentDayId = dayNames[todayIdx];
  const todayObj = PHYSIO_DATA.schedule.find(d => d.id === currentDayId) || PHYSIO_DATA.schedule[0];

  const todayLabel = document.getElementById('hero-today-label');
  const todayLaunch = document.getElementById('hero-launch-today-btn');
  if (todayLabel) todayLabel.textContent = `Today: ${todayObj.dayName} (${todayObj.durationText})`;
  if (todayLaunch) {
    if (todayObj.isRest) {
      todayLaunch.textContent = 'View Rest Day →';
      todayLaunch.onclick = () => { window.location.hash = `day-${todayObj.id}`; };
    } else {
      todayLaunch.textContent = 'Start Routine →';
      todayLaunch.onclick = () => { window.location.hash = `day-${todayObj.id}`; };
    }
  }
}

// --------------------------------------------------------------------------
// View 1: Visual Calendar Renderer
// --------------------------------------------------------------------------
function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  grid.innerHTML = '';

  PHYSIO_DATA.schedule.forEach(day => {
    const isCompleted = !!APP_STATE.userProgress.completedDays[day.id];
    const card = document.createElement('div');
    card.className = `visual-day-card ${day.isRest ? 'rest-tile' : ''} ${isCompleted ? 'completed-tile' : ''}`;
    
    // Intensity dots HTML
    let dotsHtml = '';
    if (!day.isRest) {
      dotsHtml = `
        <div class="intensity-meter" title="${day.intensityDots} / 3 Intensity">
          <span class="intensity-dot ${day.intensityDots >= 1 ? 'filled' : ''}"></span>
          <span class="intensity-dot ${day.intensityDots >= 2 ? 'filled' : ''}"></span>
          <span class="intensity-dot ${day.intensityDots >= 3 ? 'filled' : ''}"></span>
        </div>
      `;
    }

    // SVG artwork
    const svgArt = PHYSIO_SVGS[day.primaryExId] || PHYSIO_SVGS['rest'];

    card.innerHTML = `
      <div>
        <div class="day-tile-top">
          <div class="day-tile-title-group">
            <span class="day-tile-name">${day.dayName}</span>
            <span class="day-tile-focus">${day.focus}</span>
          </div>
          <div class="day-check-indicator">
            ${isCompleted ? '✓' : day.isRest ? '🌿' : '○'}
          </div>
        </div>

        <div class="day-art-frame">
          ${svgArt}
        </div>
      </div>

      <div class="day-tile-footer">
        <div>${dotsHtml}</div>
        <div class="day-duration-badge">${day.durationText}</div>
        ${day.isRest ? '<span style="color: var(--text-faint); font-weight: 500;">Rest</span>' : '<span class="tile-action-link">Open &rarr;</span>'}
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.hash = `day-${day.id}`;
    });

    grid.appendChild(card);
  });
}

// --------------------------------------------------------------------------
// View 2: Dynamic Day View (Dedicated Routine Flow)
// --------------------------------------------------------------------------
function renderDayView(dayId) {
  const day = PHYSIO_DATA.schedule.find(d => d.id === dayId);
  if (!day) return;

  const titleEl = document.getElementById('day-view-title');
  const focusEl = document.getElementById('day-view-focus');
  const exercisesContainer = document.getElementById('day-exercises-container');
  const markDayBtn = document.getElementById('mark-day-btn');
  const prevBtn = document.getElementById('prev-day-btn');
  const nextBtn = document.getElementById('next-day-btn');

  if (titleEl) titleEl.textContent = `${day.dayName} Routine`;
  if (focusEl) focusEl.textContent = `${day.focus} · ${day.durationText}`;

  // Steppers
  const currentIndex = PHYSIO_DATA.schedule.findIndex(d => d.id === dayId);
  if (prevBtn) {
    const prevDay = PHYSIO_DATA.schedule[currentIndex - 1];
    prevBtn.disabled = !prevDay;
    prevBtn.onclick = () => { if (prevDay) window.location.hash = `day-${prevDay.id}`; };
  }
  if (nextBtn) {
    const nextDay = PHYSIO_DATA.schedule[currentIndex + 1];
    nextBtn.disabled = !nextDay;
    nextBtn.onclick = () => { if (nextDay) window.location.hash = `day-${nextDay.id}`; };
  }

  // Day Complete Button
  const isDayCompleted = !!APP_STATE.userProgress.completedDays[day.id];
  updateDayCompleteButton(markDayBtn, isDayCompleted);

  if (markDayBtn) {
    markDayBtn.onclick = () => {
      const newState = !APP_STATE.userProgress.completedDays[day.id];
      APP_STATE.userProgress.completedDays[day.id] = newState;
      
      day.exerciseIds.forEach(exId => {
        APP_STATE.userProgress.completedExercises[`${day.id}:${exId}`] = newState;
      });

      saveUserProgress();
      updateDayCompleteButton(markDayBtn, newState);
      updateHeroSummary();
      renderDayExercises(day, exercisesContainer);
    };
  }

  renderDayExercises(day, exercisesContainer);
}

function updateDayCompleteButton(btn, isCompleted) {
  if (!btn) return;
  btn.classList.toggle('completed', isCompleted);
  btn.innerHTML = isCompleted ? `✓ Routine Completed` : `Mark Routine Complete`;
}

function renderDayExercises(day, container) {
  if (!container) return;
  container.innerHTML = '';

  if (day.exerciseIds.length === 0) {
    container.innerHTML = `
      <div class="routine-exercise-card" style="text-align: center; padding: 40px;">
        <div style="max-width: 140px; margin: 0 auto 16px;">${PHYSIO_SVGS['rest']}</div>
        <h3>Rest & Tissue Recovery Day</h3>
        <p style="margin-top: 6px; color: var(--text-muted);">No wrist-straining loading today. Allow joint capsule and tendon collagen remodeling.</p>
      </div>
    `;
    return;
  }

  day.exerciseIds.forEach((exId, index) => {
    const ex = PHYSIO_DATA.exercises[exId];
    if (!ex) return;

    const isDone = !!APP_STATE.userProgress.completedExercises[`${day.id}:${exId}`];
    const card = document.createElement('div');
    card.className = `routine-exercise-card ${isDone ? 'done' : ''}`;
    card.id = `card-${day.id}-${exId}`;

    const stepsHtml = ex.setup.map(step => `<li>${step}</li>`).join('');
    const cuesHtml = ex.keyCues.map(cue => `
      <li class="routine-cue-item">
        <span class="bullet">✦</span>
        <span>${cue}</span>
      </li>
    `).join('');

    let mediaHtml = '';
    if (ex.youtubeId) {
      mediaHtml = `
        <div class="routine-video-frame">
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${ex.youtubeId}?rel=0" 
            title="${ex.name}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            loading="lazy">
          </iframe>
        </div>
      `;
    } else {
      const svgArt = PHYSIO_SVGS[exId] || '';
      mediaHtml = `
        <div class="routine-svg-fallback-card">
          <div style="width: 120px; height: 75px;">${svgArt}</div>
          <span style="font-size: 0.8125rem; color: var(--text-faint);">${ex.equipment}</span>
        </div>
      `;
    }

    let timerHtml = '';
    if (ex.holdSeconds && ex.holdSeconds >= 5) {
      const timerKey = `${day.id}-${exId}`;
      timerHtml = `
        <div class="routine-timer-widget" id="timer-${timerKey}">
          <div style="font-size: 0.8125rem; font-weight: 600;">Hold Timer</div>
          <div class="timer-digits" id="readout-${timerKey}">${formatTime(ex.holdSeconds)}</div>
          <div style="display: flex; gap: 4px;">
            <button class="timer-action-btn start" id="btn-start-${timerKey}" onclick="toggleTimer('${timerKey}', ${ex.holdSeconds})">Start</button>
            <button class="timer-action-btn reset" onclick="resetTimer('${timerKey}', ${ex.holdSeconds})">Reset</button>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="routine-card-header">
        <div class="routine-title-wrap">
          <div class="routine-checkbox" id="check-${day.id}-${exId}">
            ${isDone ? '✓' : ''}
          </div>
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-faint); font-weight: 600;">${ex.category}</span>
            <h3 style="margin-top: 2px;">${index + 1}. ${ex.name}</h3>
          </div>
        </div>
        <div class="volume-pill">${ex.volumeDefault}</div>
      </div>

      <div class="routine-card-body-grid">
        <div>
          <ol class="routine-steps-list">${stepsHtml}</ol>
          <ul class="routine-cues-list">${cuesHtml}</ul>
        </div>

        <div class="routine-media-box">
          ${mediaHtml}
          ${timerHtml}
        </div>
      </div>
    `;

    const checkBtn = card.querySelector(`#check-${day.id}-${exId}`);
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        const newState = !APP_STATE.userProgress.completedExercises[`${day.id}:${exId}`];
        APP_STATE.userProgress.completedExercises[`${day.id}:${exId}`] = newState;
        
        card.classList.toggle('done', newState);
        checkBtn.textContent = newState ? '✓' : '';

        const allDone = day.exerciseIds.every(id => APP_STATE.userProgress.completedExercises[`${day.id}:${id}`]);
        APP_STATE.userProgress.completedDays[day.id] = allDone;
        
        const markDayBtn = document.getElementById('mark-day-btn');
        updateDayCompleteButton(markDayBtn, allDone);
        
        saveUserProgress();
        updateHeroSummary();
      });
    }

    container.appendChild(card);
  });
}

// --------------------------------------------------------------------------
// Timer Logic
// --------------------------------------------------------------------------
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins > 0 ? mins + ':' : ''}${secs < 10 && mins > 0 ? '0' : ''}${secs}s`;
}

window.toggleTimer = function(timerKey, initialSeconds) {
  if (APP_STATE.activeTimers[timerKey]) {
    clearInterval(APP_STATE.activeTimers[timerKey].interval);
    delete APP_STATE.activeTimers[timerKey];
    const startBtn = document.getElementById(`btn-start-${timerKey}`);
    if (startBtn) startBtn.textContent = 'Resume';
  } else {
    let remaining = initialSeconds;
    if (APP_STATE.activeTimers[`${timerKey}_state`]) {
      remaining = APP_STATE.activeTimers[`${timerKey}_state`].remaining;
    }

    const readout = document.getElementById(`readout-${timerKey}`);
    const startBtn = document.getElementById(`btn-start-${timerKey}`);
    if (startBtn) startBtn.textContent = 'Pause';

    const interval = setInterval(() => {
      remaining--;
      APP_STATE.activeTimers[`${timerKey}_state`] = { remaining };
      
      if (readout) readout.textContent = formatTime(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        delete APP_STATE.activeTimers[timerKey];
        delete APP_STATE.activeTimers[`${timerKey}_state`];
        
        if (readout) readout.textContent = 'Done! ✨';
        if (startBtn) startBtn.textContent = 'Start';

        playTimerChime();
      }
    }, 1000);

    APP_STATE.activeTimers[timerKey] = { interval };
  }
};

window.resetTimer = function(timerKey, initialSeconds) {
  if (APP_STATE.activeTimers[timerKey]) {
    clearInterval(APP_STATE.activeTimers[timerKey].interval);
    delete APP_STATE.activeTimers[timerKey];
  }
  delete APP_STATE.activeTimers[`${timerKey}_state`];

  const readout = document.getElementById(`readout-${timerKey}`);
  const startBtn = document.getElementById(`btn-start-${timerKey}`);
  if (readout) readout.textContent = formatTime(initialSeconds);
  if (startBtn) startBtn.textContent = 'Start';
};

// --------------------------------------------------------------------------
// View 3: Exercise Library Reference
// --------------------------------------------------------------------------
function renderExerciseLibrary() {
  const grid = document.getElementById('library-grid');
  const chips = document.querySelectorAll('.filter-chip');
  if (!grid) return;

  let currentCategory = 'all';

  const filterAndDraw = () => {
    grid.innerHTML = '';
    const all = Object.values(PHYSIO_DATA.exercises);

    const filtered = all.filter(ex => currentCategory === 'all' || ex.categoryKey === currentCategory);

    filtered.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'lib-card';
      const svgArt = PHYSIO_SVGS[ex.id] || '';

      card.innerHTML = `
        <div>
          <div class="lib-card-art">${svgArt}</div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <span style="font-size: 0.75rem; font-weight: 600; color: var(--sage-700);">${ex.category}</span>
            <span style="font-size: 0.75rem; font-weight: 600; color: var(--clay-600);">${ex.volumeDefault}</span>
          </div>
          <h3 style="margin-bottom: 6px;">${ex.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45;">${ex.mechanism}</p>
        </div>

        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; font-size: 0.8125rem;">
          <span style="color: var(--text-faint);">${ex.equipment}</span>
          ${ex.youtubeId ? '<span style="color: var(--clay-500); font-weight: 600;">▶ Video Demo</span>' : '<span style="color: var(--text-faint);">Guide</span>'}
        </div>
      `;

      card.addEventListener('click', () => {
        const matchingDay = PHYSIO_DATA.schedule.find(d => d.exerciseIds.includes(ex.id));
        if (matchingDay) window.location.hash = `day-${matchingDay.id}`;
      });

      grid.appendChild(card);
    });
  };

  chips.forEach(chip => {
    chip.onclick = () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.getAttribute('data-category');
      filterAndDraw();
    };
  });

  filterAndDraw();
}

// --------------------------------------------------------------------------
// View 4: Progression Guide
// --------------------------------------------------------------------------
function renderProgressionView() {
  const grid = document.getElementById('progression-grid');
  if (!grid) return;

  grid.innerHTML = '';

  PHYSIO_DATA.phases.forEach(phase => {
    const isCurrent = (phase.id === APP_STATE.activePhaseId);
    const card = document.createElement('div');
    card.className = `phase-guide-card ${isCurrent ? 'active-phase' : ''}`;

    const rulesHtml = phase.criteria.map(c => `
      <li style="display: flex; gap: 8px; font-size: 0.875rem; margin-bottom: 8px;">
        <span style="color: var(--sage-500); font-weight: 700;">✓</span>
        <span>${c}</span>
      </li>
    `).join('');

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="hero-tag-pill" style="margin-bottom: 4px;">Phase ${phase.number}</span>
          <h3>${phase.title}: ${phase.badge}</h3>
        </div>
        ${isCurrent ? '<span style="font-size: 0.75rem; font-weight: 700; color: var(--sage-500); background: var(--sage-50); padding: 3px 8px; border-radius: var(--radius-pill);">Active</span>' : ''}
      </div>

      <p style="font-size: 0.9rem; color: var(--text-main); font-weight: 500;">${phase.summary}</p>
      
      <ul style="list-style: none; margin-top: 8px;">${rulesHtml}</ul>

      <div style="margin-top: auto; padding-top: 14px;">
        <button class="phase-toggle-btn ${isCurrent ? 'active' : ''}" style="width: 100%;" onclick="setPhase('${phase.id}')">
          ${isCurrent ? 'Current Program' : 'Switch to this Phase'}
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

// --------------------------------------------------------------------------
// Reset Week
// --------------------------------------------------------------------------
function initResetWeek() {
  const resetBtn = document.getElementById('reset-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset completion checkmarks for the current week?')) {
        APP_STATE.userProgress.completedDays = {};
        APP_STATE.userProgress.completedExercises = {};
        saveUserProgress();
        updateHeroSummary();
        renderCalendar();
      }
    });
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadUserProgress();
  initPhaseControls();
  initResetWeek();
  initRouting();
});
