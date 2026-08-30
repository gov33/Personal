/**
 * Nandini's Physio Plan - Visual Data Store
 * Visual diagrams, structured exercises, and progressive calendar routines.
 */

const PHYSIO_SVGS = {
  // 1. Banded MWM
  "banded-mwm": `
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ex-svg-art">
      <path d="M15 42H65C75 42 85 36 95 24" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 54H60C70 54 78 48 88 38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      <!-- Band loop around lower forearm -->
      <ellipse cx="50" cy="48" rx="8" ry="18" fill="var(--clay-100)" stroke="var(--clay-500)" stroke-width="2.5" stroke-dasharray="3 2"/>
      <!-- Forward traction force vector -->
      <path d="M50 48L50 68M45 62L50 68L55 62" stroke="var(--clay-600)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Extension movement arc -->
      <path d="M92 20C96 24 102 32 100 38" stroke="var(--sage-600)" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 2"/>
    </svg>
  `,

  // 2. Radiocarpal Traction
  "radiocarpal-traction": `
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ex-svg-art">
      <rect x="10" y="48" width="60" height="12" rx="3" fill="var(--border-card)" opacity="0.5"/>
      <path d="M20 44H65L90 28" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <!-- Stabilizing hand clamp -->
      <rect x="52" y="34" width="14" height="22" rx="4" fill="var(--sage-100)" stroke="var(--sage-600)" stroke-width="2"/>
      <!-- Upward extension lift vector -->
      <path d="M85 38V18M79 24L85 18L91 24" stroke="var(--clay-500)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 3. Multi-Directional Isometrics (4-Way Compass)
  "multidirectional-isometrics": `
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ex-svg-art">
      <!-- Central neutral fist circle -->
      <circle cx="60" cy="40" r="16" fill="var(--bg-surface)" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="60" cy="40" r="6" fill="var(--sage-500)"/>
      <!-- 4 isometric vectors with static stops -->
      <path d="M60 18V8M55 12L60 8L65 12" stroke="var(--clay-500)" stroke-width="2" stroke-linecap="round"/>
      <path d="M60 62V72M55 68L60 72L65 68" stroke="var(--clay-500)" stroke-width="2" stroke-linecap="round"/>
      <path d="M38 40H28M34 35L28 40L34 45" stroke="var(--sage-600)" stroke-width="2" stroke-linecap="round"/>
      <path d="M82 40H92M86 35L92 40L86 45" stroke="var(--sage-600)" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // 4. Dart Thrower's Hold (Diagonal Scapholunate Plane)
  "dart-thrower-hold": `
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ex-svg-art">
      <!-- Diagonal 45-degree axis line -->
      <line x1="25" y1="65" x2="95" y2="15" stroke="var(--border-card)" stroke-width="1.5" stroke-dasharray="3 3"/>
      <!-- Forearm & hand aligned on the diagonal -->
      <path d="M30 60L65 35L88 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <!-- Small weight held in hand -->
      <rect x="84" y="10" width="10" height="18" rx="3" transform="rotate(35 84 10)" fill="var(--clay-100)" stroke="var(--clay-600)" stroke-width="2"/>
      <!-- Hold angle indicator -->
      <path d="M60 48C68 44 76 36 78 28" stroke="var(--sage-600)" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // 5. Wrist Circles & Finger Spreads
  "wrist-circles-finger-spreads": `
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ex-svg-art">
      <!-- Fluid rotational ellipse arrows -->
      <path d="M40 38C40 26 55 20 68 24C82 28 85 46 72 54C60 60 44 52 46 40" stroke="var(--sage-500)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4 3"/>
      <path d="M42 46L46 40L52 44" stroke="var(--sage-600)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Radiating active finger rays -->
      <line x1="88" y1="20" x2="98" y2="14" stroke="var(--clay-500)" stroke-width="2" stroke-linecap="round"/>
      <line x1="96" y1="32" x2="108" y2="30" stroke="var(--clay-500)" stroke-width="2" stroke-linecap="round"/>
      <line x1="94" y1="46" x2="106" y2="50" stroke="var(--clay-500)" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  // 6. Serratus Push-ups / Scapular Protraction
  "serratus-pushups": `
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ex-svg-art">
      <!-- Straight plank arm line -->
      <line x1="45" y1="65" x2="45" y2="28" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <!-- Knuckle base (0-deg wrist) -->
      <circle cx="45" cy="65" r="4" fill="var(--clay-500)"/>
      <line x1="30" y1="69" x2="60" y2="69" stroke="var(--border-card)" stroke-width="2"/>
      <!-- Upper back / scapular protraction dome -->
      <path d="M45 28C58 20 78 22 95 35" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <!-- Push ceiling vector -->
      <path d="M68 32L68 14M62 20L68 14L74 20" stroke="var(--sage-600)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 7. Quadruped Rocking
  "quadruped-rocking": `
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ex-svg-art">
      <!-- Mat floor line -->
      <line x1="15" y1="65" x2="105" y2="65" stroke="var(--border-card)" stroke-width="2"/>
      <!-- Hands and knees ground contacts -->
      <circle cx="40" cy="65" r="3" fill="var(--clay-500)"/>
      <circle cx="85" cy="65" r="3" fill="var(--text-faint)"/>
      <!-- Body quad table -->
      <path d="M40 65V35H85V65" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Forward rock arrow over hands -->
      <path d="M60 24H35M42 18L35 24L42 30" stroke="var(--sage-600)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,

  // 8. Wall or Knuckle Planks
  "wall-or-knuckle-planks": `
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ex-svg-art">
      <!-- Vertical wall line -->
      <line x1="28" y1="12" x2="28" y2="68" stroke="var(--border-card)" stroke-width="2.5"/>
      <!-- Extended hands on wall / rigid plank line -->
      <circle cx="28" cy="38" r="4" fill="var(--clay-500)"/>
      <line x1="28" y1="38" x2="88" y2="62" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <!-- Stability brace core -->
      <circle cx="62" cy="51" r="5" fill="var(--sage-100)" stroke="var(--sage-600)" stroke-width="2"/>
    </svg>
  `,

  // Rest day icon
  "rest": `
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ex-svg-art">
      <path d="M35 48C45 28 75 24 85 48C65 52 45 52 35 48Z" fill="var(--sage-100)" stroke="var(--sage-600)" stroke-width="2"/>
      <path d="M35 48C55 42 75 36 85 48" stroke="var(--sage-600)" stroke-width="1.5"/>
      <circle cx="60" cy="24" r="3" fill="var(--clay-400)" opacity="0.6"/>
      <circle cx="72" cy="20" r="2" fill="var(--clay-400)" opacity="0.4"/>
    </svg>
  `
};

const PHYSIO_DATA = {
  meta: {
    title: "Nandini's Physio Plan",
    subtitle: "Wrist Mobility, Stability & Progressive Loading",
    author: "Rehabilitation Protocol"
  },

  // 3-Phase Progression Criteria
  phases: [
    {
      id: "phase-1",
      number: "1",
      title: "Weeks 1–2",
      badge: "Acute Decompression",
      summary: "Isometrics at 50–70% max effort. Knuckles or handles only for all planks. Zero dorsal pinching.",
      loadingGuideline: "50–70% voluntary isometric effort",
      plankRule: "Strictly knuckles or push-up handles",
      keyGoal: "Pain-free dorsal space opening via Banded MWM",
      criteria: [
        "Perform isometrics at 50–70% maximum voluntary effort.",
        "Keep ALL floor planks strictly on knuckles or push-up handles to enforce 0° neutral wrist.",
        "Primary Goal: Eliminate dorsal joint pinching using Banded MWM.",
        "Movement must remain 100% pain-free throughout the entire range."
      ]
    },
    {
      id: "phase-2",
      number: "2",
      title: "Weeks 3–4",
      badge: "Progressive Load",
      summary: "Increase isometrics to 80–100%. Transition to flat-palm wall planks. Increase forward rocking shift.",
      loadingGuideline: "80–100% voluntary isometric effort",
      plankRule: "Flat-palm standing wall planks",
      keyGoal: "Gradual extension load during Quadruped Rocking",
      criteria: [
        "Increase isometric effort to 80–100% maximum voluntary contraction.",
        "Transition from knuckle planks to flat-palm standing wall planks.",
        "Increase forward shoulder shift during Quadruped Rocking as tolerated.",
        "Verify zero dorsal pinching before progressing to floor loading."
      ]
    },
    {
      id: "phase-3",
      number: "3",
      title: "Weeks 5+",
      badge: "Functional Return",
      summary: "Low-angle flat-palm floor planks reintroduced. Regress to Phase 2 immediately if pinching recurs.",
      loadingGuideline: "Full functional bodyweight tolerance",
      plankRule: "Low-angle floor planks if pinch-free",
      keyGoal: "Full pain-free wrist extension under load",
      criteria: [
        "Begin reintroducing low-angle flat-palm floor planks.",
        "If dorsal pinching recurs, immediately regress to Phase 2 loading.",
        "Integrate dynamic kinetic chain stability through full active range.",
        "Maintain daily MWM as warm-up decompression before any loading."
      ]
    }
  ],

  // 8 Core Exercises
  exercises: {
    "banded-mwm": {
      id: "banded-mwm",
      name: "Self-Administered Wrist MWM with Band",
      shortName: "Banded Wrist MWM",
      category: "Mobilization",
      categoryKey: "mobilization",
      volumeDefault: "2 sets × 12 reps",
      holdSeconds: 2,
      repsCount: 12,
      setsCount: 2,
      equipment: "Medium Resistance Band",
      youtubeId: "c2JIMZpTtoA",
      mechanism: "Creates a forward glide on the radius/ulna to open the dorsal joint space, preventing capsular pinching when bending the wrist back into extension.",
      setup: [
        "Anchor a medium band to a sturdy table leg at wrist height.",
        "Place the band loop directly BELOW the wrist crease on your lower forearm.",
        "Step back to create forward-pulling tension on the forearm while placing your hand on your thigh or table.",
        "Slowly bend your wrist back into extension using your opposite hand to guide it.",
        "Hold for 2 seconds at end range and return. Must remain 100% pain-free."
      ],
      keyCues: [
        "Band position must stay on the forearm, never across the hand.",
        "Maintain firm forward traction to decompress the joint.",
        "Never push into sharp pinching pain."
      ]
    },

    "radiocarpal-traction": {
      id: "radiocarpal-traction",
      name: "Manual Radiocarpal Traction & Extension",
      shortName: "Radiocarpal Traction",
      category: "Mobilization",
      categoryKey: "mobilization",
      volumeDefault: "2 sets × 10 reps",
      holdSeconds: 2,
      repsCount: 10,
      setsCount: 2,
      equipment: "Table Edge",
      youtubeId: null,
      mechanism: "Restores smooth gliding of the proximal carpal row (scaphoid/lunate) using manual distraction without requiring equipment.",
      setup: [
        "Forearm supported flat on a table, palm down, hand hanging off the edge.",
        "Grasp your lower forearm just above the wrist joint line with the opposite hand.",
        "Apply a gentle distraction force backward while applying subtle downward pressure over the back of the wrist.",
        "Lift your palm upward toward the ceiling into wrist extension."
      ],
      keyCues: [
        "Keep forearm securely anchored.",
        "Smooth 2-second lift and 2-second descent.",
        "Zero dorsal impingement."
      ]
    },

    "multidirectional-isometrics": {
      id: "multidirectional-isometrics",
      name: "Multi-Directional Wrist Isometrics (4-Way)",
      shortName: "4-Way Isometrics",
      category: "Stabilization",
      categoryKey: "stabilization",
      volumeDefault: "3 rounds × 10s holds (all 4 ways)",
      holdSeconds: 10,
      repsCount: 4,
      setsCount: 3,
      equipment: "Hand / Table Resistance",
      youtubeId: "Z0QeYB-o77c",
      mechanism: "Promotes co-contraction of carpal stabilizers (ECU & FCR) to dynamically lock the carpal bones together under load.",
      setup: [
        "Forearm flat on table in a neutral fist position.",
        "Extension (10s): Push fist UP against opposite hand resistance (zero movement).",
        "Flexion (10s): Push fist DOWN against static resistance.",
        "Radial Deviation (10s): Push outward toward thumb side.",
        "Ulnar Deviation (10s): Push inward toward pinky side."
      ],
      keyCues: [
        "Keep wrist strictly at 0° neutral angle.",
        "Phase 1: 50–70% effort. Phase 2: 80–100% effort.",
        "Breathe calmly throughout each 10-second hold."
      ]
    },

    "dart-thrower-hold": {
      id: "dart-thrower-hold",
      name: "Isometric Dart Thrower's Path Hold",
      shortName: "Dart Thrower's Hold",
      category: "Stabilization",
      categoryKey: "stabilization",
      volumeDefault: "3 sets × 30s static hold",
      holdSeconds: 30,
      repsCount: 1,
      setsCount: 3,
      equipment: "0.5–1 kg Dumbbell or Bottle",
      youtubeId: "0NkMInYg0lE",
      mechanism: "Targets the diagonal plane of wrist movement (extension/radial deviation) that optimizes scapholunate joint alignment and carpal stability.",
      setup: [
        "Hold a light weight (0.5–1 kg) in your hand.",
        "Cock wrist slightly back and toward the thumb side (the dart throw release angle).",
        "Lock wrist rigidly at this angle while bending and straightening the elbow."
      ],
      keyCues: [
        "Wrist stays locked in the diagonal plane while elbow moves.",
        "Do not let the wrist collapse into flexion.",
        "Maintain sustained steady grip."
      ]
    },

    "wrist-circles-finger-spreads": {
      id: "wrist-circles-finger-spreads",
      name: "Wrist Circles & Active Finger Spreads",
      shortName: "Circles & Finger Spreads",
      category: "Active Recovery",
      categoryKey: "recovery",
      volumeDefault: "2 minutes continuous flow",
      holdSeconds: 120,
      repsCount: 1,
      setsCount: 1,
      equipment: "None",
      youtubeId: null,
      mechanism: "Promotes synovial fluid circulation, carpal tunnel tendon gliding, and neural mobility without loading joint structures.",
      setup: [
        "Slow controlled wrist circles clockwise for 30 seconds.",
        "Reverse counter-clockwise for 30 seconds.",
        "Spread fingers as wide as possible for 3 seconds, then gentle fist (repeat 1 min)."
      ],
      keyCues: [
        "Gentle, smooth, and rhythmic.",
        "Focus on maximum active finger extension.",
        "Great for de-toning tense forearm flexors."
      ]
    },

    "serratus-pushups": {
      id: "serratus-pushups",
      name: "Scapular Protraction (Serratus Push-Ups)",
      shortName: "Serratus Push-ups",
      category: "Shoulder Integration",
      categoryKey: "kinetic",
      volumeDefault: "2 sets × 12 reps",
      holdSeconds: 2,
      repsCount: 12,
      setsCount: 2,
      equipment: "Push-up handles / Knuckles / Wall",
      youtubeId: null,
      mechanism: "Strengthens the serratus anterior to distribute force through the kinetic chain, preventing shoulder collapse from dumping load onto the wrist.",
      setup: [
        "Plank or knee-plank on push-up handles/knuckles (0° neutral wrist).",
        "Keep arms straight and elbows locked throughout.",
        "Sink chest slightly as shoulder blades come together (retraction).",
        "Push the floor away firmly, rounding upper back toward ceiling (protraction)."
      ],
      keyCues: [
        "Do not bend your elbows—movement is strictly scapular.",
        "Pause 1–2 seconds in full protraction at the top.",
        "Keep wrists strictly neutral."
      ]
    },

    "quadruped-rocking": {
      id: "quadruped-rocking",
      name: "Dynamic Quadruped Rocking",
      shortName: "Quadruped Rocking",
      category: "Closed-Chain Loading",
      categoryKey: "closed-chain",
      volumeDefault: "2 sets × 10 reps",
      holdSeconds: 2,
      repsCount: 10,
      setsCount: 2,
      equipment: "Exercise Mat",
      youtubeId: "i7-x3LDk2y4",
      mechanism: "Safely reintroduces controlled weight-bearing into wrist extension by allowing gradual forward bodyweight shift.",
      setup: [
        "On all fours with palms flat, shoulder-width, fingers spread wide.",
        "Actively push through shoulders to stabilize upper back.",
        "Slowly shift weight forward until shoulders are over fingertips (within pain-free tolerance).",
        "Hold 2 seconds, then rock back toward heels."
      ],
      keyCues: [
        "Distribute load through palm pads and finger pads.",
        "Increase forward shift distance gradually as tolerance improves.",
        "Stop before any dorsal pinching."
      ]
    },

    "wall-or-knuckle-planks": {
      id: "wall-or-knuckle-planks",
      name: "Progressive Closed-Chain Planks",
      shortName: "Wall / Knuckle Planks",
      category: "Closed-Chain Loading",
      categoryKey: "closed-chain",
      volumeDefault: "3 sets × 30s holds",
      holdSeconds: 30,
      repsCount: 1,
      setsCount: 3,
      equipment: "Wall / Mat with Handles",
      youtubeId: null,
      mechanism: "Builds core-to-wrist axial load tolerance while strictly respecting phase-dependent joint angle constraints.",
      setup: [
        "Phase 1: Floor plank on knuckles or push-up bars (0° neutral wrist).",
        "Phase 2: Standing wall plank with flat palms at shoulder height.",
        "Phase 3: Low-angle inclined or floor flat-palm plank as pain-free tolerance allows.",
        "Brace core and push through shoulders for a steady 30-second hold."
      ],
      keyCues: [
        "Never force into sharp wrist extension in Phase 1.",
        "Keep full kinetic chain engaged from core to palms.",
        "Regress immediately if dorsal discomfort is felt."
      ]
    }
  },

  // 7-Day Visual Schedule
  schedule: [
    {
      id: "monday",
      dayName: "Monday",
      shortDay: "Mon",
      isRest: false,
      focus: "Mobilization & Isometrics",
      intensityDots: 3,
      exerciseIds: [
        "banded-mwm",
        "radiocarpal-traction",
        "multidirectional-isometrics",
        "dart-thrower-hold"
      ],
      durationText: "15 min",
      primaryExId: "banded-mwm"
    },
    {
      id: "tuesday",
      dayName: "Tuesday",
      shortDay: "Tue",
      isRest: false,
      focus: "Active Recovery & Shoulder",
      intensityDots: 1,
      exerciseIds: [
        "wrist-circles-finger-spreads",
        "serratus-pushups"
      ],
      durationText: "8 min",
      primaryExId: "wrist-circles-finger-spreads"
    },
    {
      id: "wednesday",
      dayName: "Wednesday",
      shortDay: "Wed",
      isRest: false,
      focus: "Mobilization & Isometrics",
      intensityDots: 3,
      exerciseIds: [
        "banded-mwm",
        "radiocarpal-traction",
        "multidirectional-isometrics",
        "dart-thrower-hold"
      ],
      durationText: "15 min",
      primaryExId: "dart-thrower-hold"
    },
    {
      id: "thursday",
      dayName: "Thursday",
      shortDay: "Thu",
      isRest: false,
      focus: "Active Recovery & Shoulder",
      intensityDots: 1,
      exerciseIds: [
        "wrist-circles-finger-spreads",
        "serratus-pushups"
      ],
      durationText: "8 min",
      primaryExId: "serratus-pushups"
    },
    {
      id: "friday",
      dayName: "Friday",
      shortDay: "Fri",
      isRest: false,
      focus: "Closed-Chain Loading",
      intensityDots: 3,
      exerciseIds: [
        "banded-mwm",
        "multidirectional-isometrics",
        "quadruped-rocking",
        "wall-or-knuckle-planks"
      ],
      durationText: "18 min",
      primaryExId: "quadruped-rocking"
    },
    {
      id: "saturday",
      dayName: "Saturday",
      shortDay: "Sat",
      isRest: true,
      focus: "Rest & Tissue Recovery",
      intensityDots: 0,
      exerciseIds: [],
      durationText: "Rest",
      primaryExId: "rest"
    },
    {
      id: "sunday",
      dayName: "Sunday",
      shortDay: "Sun",
      isRest: true,
      focus: "Rest & Recovery",
      intensityDots: 0,
      exerciseIds: [],
      durationText: "Rest",
      primaryExId: "rest"
    }
  ]
};
