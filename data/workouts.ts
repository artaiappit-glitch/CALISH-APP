// Edit this file to change your workout programme.
// restSeconds: time between sets. Use 0 for skill/hold work (timer is skipped).

export type Exercise = {
  name: string;
  sets: number;
  reps: string;       // free-form, e.g. "6", "6–8", "max hold", "~10 min"
  restSeconds: number;
  note?: string;
  image?: string;     // relative path from assets/, e.g. "exercises/pullup.jpg"
};

export type Day = {
  name: string;       // shown as the card title, e.g. "Pull"
  focus: string;      // subtitle line, e.g. "Before every session"
  restDay?: boolean;  // if true, show a simple rest card instead of the exercise flow
  note?: string;      // for rest days, or a general day-level note
  icon?: string;      // key into ICON_MAP in HomeScreen, e.g. "pull"
  exercises: Exercise[];
};

const workouts: Day[] = [
  // ── PULL ────────────────────────────────────────────────────────────────────
  {
    name: 'Pull',
    focus: 'Vertical & horizontal pulling',
    icon: 'pull',
    exercises: [
      {
        name: 'Weighted pull-ups, 12 kg (bar)',
        sets: 4,
        reps: '6',
        restSeconds: 150,
        note: 'Anchor. Progress by reps then slower negatives.',
      },
      {
        name: 'Bar chin-ups, 12 kg',
        sets: 4,
        reps: '4–6',
        restSeconds: 120,
        note: 'Switched from rings (elbow strain at low point).',
      },
      {
        name: 'Ring rows, fully horizontal',
        sets: 4,
        reps: '8',
        restSeconds: 90,
        note: 'Progress by elevating feet, not more reps.',
      },
      {
        name: 'Ring face-pulls / rear-delt',
        sets: 3,
        reps: '12–20',
        restSeconds: 60,
      },
      {
        name: 'Ring biceps curls (lean back)',
        sets: 3,
        reps: '10–15',
        restSeconds: 60,
      },
      {
        name: 'Front-lever tuck holds',
        sets: 3,
        reps: '20–30s',
        restSeconds: 60,
        note: 'Open the tuck when 30s is clean.',
      },
    ],
  },

  // ── PUSH ────────────────────────────────────────────────────────────────────
  {
    name: 'Push',
    focus: 'Dips, press & overhead',
    icon: 'push',
    exercises: [
      {
        name: 'Ring dips (deep, RTO if able), weighted',
        sets: 4,
        reps: '6–8',
        restSeconds: 120,
        note: 'Anchor press. Ramp in.',
      },
      {
        name: 'Pike push-ups (feet elevated) → HSPU prog.',
        sets: 4,
        reps: '6–10',
        restSeconds: 90,
      },
      {
        name: 'Ring flys',
        sets: 3,
        reps: '10–15',
        restSeconds: 60,
      },
      {
        name: 'Pseudo-planche push-ups (parallettes)',
        sets: 3,
        reps: '8–12',
        restSeconds: 60,
      },
      {
        name: 'Ring triceps extensions (overhead/skull)',
        sets: 3,
        reps: '10–15',
        restSeconds: 60,
      },
      {
        name: 'Hollow-body holds, 12 kg',
        sets: 3,
        reps: 'max hold',
        restSeconds: 45,
        note: 'Weighted static hold, plate on chest/overhead.',
      },
    ],
  },

  // ── CORE ────────────────────────────────────────────────────────────────────
  {
    name: 'Core',
    focus: 'Core + skill work',
    icon: 'core',
    exercises: [
      {
        name: 'Skill — handstand OR front lever',
        sets: 1,
        reps: '~10 min',
        restSeconds: 0, // skill work: no rest timer
        note: 'Fresh. Rotate weekly.',
      },
      {
        name: 'Weighted hanging leg raises',
        sets: 4,
        reps: '10–12',
        restSeconds: 75,
      },
      {
        name: 'L-sit',
        sets: 4,
        reps: 'max hold',
        restSeconds: 75,
        note: 'Chase 30s.',
      },
      {
        name: 'Dragon flag (full or negatives)',
        sets: 4,
        reps: '5–8',
        restSeconds: 75,
      },
      {
        name: 'Ab-wheel or ring rollouts',
        sets: 3,
        reps: '8–12',
        restSeconds: 60,
      },
      {
        name: 'Pallof press / side plank (bands)',
        sets: 3,
        reps: '12/side',
        restSeconds: 45,
      },
      {
        name: 'Weighted calf raises (optional)',
        sets: 3,
        reps: '15',
        restSeconds: 45,
      },
    ],
  },

  // ── PULL #2 ──────────────────────────────────────────────────────────────────
  {
    name: 'Pull #2',
    focus: 'Power & muscle-up focus',
    icon: 'pull2',
    exercises: [
      {
        name: 'Muscle-up practice',
        sets: 5,
        reps: '3',
        restSeconds: 120,
        note: 'Skill/power up front while fresh.',
      },
      {
        name: 'Explosive pull-ups',
        sets: 4,
        reps: '4',
        restSeconds: 90,
      },
      {
        name: 'Wide-grip weighted pull-ups, 12 kg',
        sets: 4,
        reps: '6–8',
        restSeconds: 120,
      },
      {
        name: 'Ring rows, hard leverage',
        sets: 4,
        reps: '8',
        restSeconds: 90,
      },
      {
        name: 'Ring curls',
        sets: 3,
        reps: '10–15',
        restSeconds: 60,
      },
      {
        name: 'Front-lever tuck holds',
        sets: 3,
        reps: '20–30s',
        restSeconds: 60,
      },
    ],
  },

  // ── PUSH #2 ──────────────────────────────────────────────────────────────────
  {
    name: 'Push #2',
    focus: 'Skill + volume push',
    icon: 'push2',
    exercises: [
      {
        name: 'Handstand / planche balance practice',
        sets: 1,
        reps: '~10 min',
        restSeconds: 0, // skill work: no rest timer
        note: 'Skill opener, fresh.',
      },
      {
        name: 'Ring dips',
        sets: 3,
        reps: '10–12',
        restSeconds: 90,
      },
      {
        name: 'Archer / one-arm push-up progression',
        sets: 3,
        reps: '6–8/side',
        restSeconds: 90,
      },
      {
        name: 'Ring flys',
        sets: 3,
        reps: '12–15',
        restSeconds: 60,
      },
      {
        name: 'Ring triceps + lateral raises (bands)',
        sets: 3,
        reps: '12–15 each',
        restSeconds: 60,
      },
      {
        name: 'Planche lean',
        sets: 3,
        reps: '20s',
        restSeconds: 45,
      },
      {
        name: 'Dragon-flag negatives',
        sets: 3,
        reps: '5',
        restSeconds: 60,
      },
    ],
  },

  // ── WARMUP ───────────────────────────────────────────────────────────────────
  {
    name: 'Warmup',
    focus: 'Before every session',
    icon: 'warmup',
    exercises: [
      {
        name: 'Raise — jump-rope / jacks / high-knee jog',
        sets: 1,
        reps: '2 min',
        restSeconds: 0,
        note: 'Get the heart rate up.',
      },
      {
        name: 'Dynamic flow',
        sets: 1,
        reps: '2 min',
        restSeconds: 0,
        note: 'Cat-cow ×10, thoracic rotations ×8/side, leg swings ×10/side, arm swings.',
      },
      {
        name: 'Band shoulder prep',
        sets: 1,
        reps: '1 min',
        restSeconds: 0,
        note: 'Pull-aparts ×15, dislocates ×10, external rotations ×10/side, ring support hold ×15s.',
      },
      {
        name: 'Pull primer',
        sets: 1,
        reps: '1 set',
        restSeconds: 0,
        note: 'Scap pull-ups ×8 + scap ring rows ×8.',
      },
      {
        name: 'Push primer',
        sets: 1,
        reps: '1 set',
        restSeconds: 0,
        note: 'Wrist rocks ×10 each, scap push-ups ×8, planche-lean breaths, ring support ×15s.',
      },
      {
        name: 'Core primer',
        sets: 1,
        reps: '1 set',
        restSeconds: 0,
        note: 'Wrist prep.',
      },
    ],
  },
];

export default workouts;
