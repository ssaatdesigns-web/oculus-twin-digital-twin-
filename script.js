// ═══════════════════════════════════════════════
//   OculusTwin — Eye Operation Digital Twin System
//   script.js
// ═══════════════════════════════════════════════

// ════════════════════════════════════════════
//  DATA DEFINITIONS
// ════════════════════════════════════════════

const SURGERIES = [
  {
    name: "Phacoemulsification",
    short: "Cataract Removal",
    phases: [
      { name: "Pre-Op Assessment", desc: "Twin calibration · biometry scan · IOP baseline", duration: 8000,
        vitals: { iop: [14,16], cct: [542,548], pupil: [7.5,8.0], perfusion: [85,90], aqFlow: [2.2,2.4], temp: [35.2,35.4] },
        actions: ["twin_calibrate","scan_cornea","iop_baseline","pupil_dilation"],
        eyeState: "normal"
      },
      { name: "Corneal Incision", desc: "2.4mm temporal clear cornea incision", duration: 6000,
        vitals: { iop: [8,12], cct: [520,535], pupil: [7.8,8.0], perfusion: [82,86], aqFlow: [1.8,2.0], temp: [35.0,35.3] },
        actions: ["incision_start","aq_outflow","probe_incision","viscoelastic_inject"],
        eyeState: "incision"
      },
      { name: "Phacoemulsification", desc: "Ultrasonic lens fragmentation & aspiration", duration: 10000,
        vitals: { iop: [22,28], cct: [530,545], pupil: [7.5,7.8], perfusion: [78,84], aqFlow: [1.2,1.8], temp: [35.5,36.2] },
        actions: ["us_energy_on","lens_fragment","aspirate_cortex","iop_spike_warn"],
        eyeState: "phaco"
      },
      { name: "IOL Insertion", desc: "Foldable intraocular lens deployment +21.0D", duration: 7000,
        vitals: { iop: [14,18], cct: [535,542], pupil: [7.2,7.5], perfusion: [83,88], aqFlow: [2.0,2.2], temp: [35.2,35.5] },
        actions: ["iol_cartridge","iol_inject","iol_unfold","iol_position"],
        eyeState: "iol"
      },
      { name: "Closure & Hydration", desc: "Wound hydration · BSS irrigation · IOP normalise", duration: 6000,
        vitals: { iop: [15,17], cct: [542,550], pupil: [6.8,7.0], perfusion: [85,89], aqFlow: [2.2,2.3], temp: [35.0,35.2] },
        actions: ["bss_hydration","wound_seal","iop_check","twin_post_record"],
        eyeState: "closure"
      }
    ]
  },
  {
    name: "LASIK",
    short: "Refractive Correction",
    phases: [
      { name: "Pre-Op Mapping", desc: "Corneal topography · wavefront aberrometry · pachymetry", duration: 8000,
        vitals: { iop: [13,15], cct: [554,562], pupil: [6.8,7.2], perfusion: [87,92], aqFlow: [2.3,2.5], temp: [35.1,35.3] },
        actions: ["topo_scan","aberrometry","pachymetry","twin_map"],
        eyeState: "normal"
      },
      { name: "Suction & Docking", desc: "Microkeratome suction ring placement · IOP elevation", duration: 5000,
        vitals: { iop: [55,70], cct: [548,558], pupil: [5.5,6.0], perfusion: [60,70], aqFlow: [0.8,1.2], temp: [35.3,35.6] },
        actions: ["suction_ring","iop_elevate","cornea_lock","suction_confirm"],
        eyeState: "suction"
      },
      { name: "Flap Creation", desc: "Femtosecond laser corneal flap 110μm depth", duration: 7000,
        vitals: { iop: [45,55], cct: [440,455], pupil: [5.8,6.2], perfusion: [65,72], aqFlow: [0.6,1.0], temp: [35.4,35.8] },
        actions: ["fs_laser_on","flap_cut","flap_lift","stromal_expose"],
        eyeState: "flap"
      },
      { name: "Excimer Ablation", desc: "193nm UV ablation · −4.25D correction · 45s", duration: 9000,
        vitals: { iop: [12,14], cct: [395,410], pupil: [7.0,7.2], perfusion: [82,88], aqFlow: [2.0,2.2], temp: [35.2,35.5] },
        actions: ["excimer_on","ablation_track","eye_tracking","ablation_complete"],
        eyeState: "laser"
      },
      { name: "Flap Reposition", desc: "Flap alignment · BSS irrigation · adherence check", duration: 6000,
        vitals: { iop: [14,16], cct: [508,515], pupil: [6.8,7.0], perfusion: [86,90], aqFlow: [2.2,2.4], temp: [35.0,35.2] },
        actions: ["flap_reposition","bss_irrigate","align_check","twin_post_record"],
        eyeState: "closure"
      }
    ]
  },
  {
    name: "Pars Plana Vitrectomy",
    short: "Retinal Repair",
    phases: [
      { name: "Pre-Op Imaging", desc: "OCT · fundus imaging · retinal mapping twin sync", duration: 8000,
        vitals: { iop: [14,16], cct: [540,548], pupil: [8.0,8.5], perfusion: [84,89], aqFlow: [2.1,2.3], temp: [35.1,35.4] },
        actions: ["oct_scan","fundus_image","retina_map","twin_3d_build"],
        eyeState: "normal"
      },
      { name: "Port Insertion", desc: "23g pars plana trocar · 3-port setup · ILM probe", duration: 7000,
        vitals: { iop: [18,22], cct: [540,546], pupil: [8.2,8.5], perfusion: [78,84], aqFlow: [1.5,1.8], temp: [35.2,35.5] },
        actions: ["trocar_insert","infusion_cannula","light_probe","vitrector_port"],
        eyeState: "ports"
      },
      { name: "Core Vitrectomy", desc: "Vitreous gel removal · 5000 cpm · posterior hyaloid", duration: 12000,
        vitals: { iop: [22,26], cct: [540,548], pupil: [8.0,8.3], perfusion: [72,80], aqFlow: [0.4,0.8], temp: [35.3,35.7] },
        actions: ["vitrector_on","core_vitreous","pvd_induce","posterior_hyaloid"],
        eyeState: "vitrectomy"
      },
      { name: "Retinal Repair", desc: "Endolaser photocoagulation · retinal tear sealing", duration: 9000,
        vitals: { iop: [20,24], cct: [540,546], pupil: [7.8,8.0], perfusion: [68,76], aqFlow: [0.3,0.6], temp: [35.5,36.0] },
        actions: ["endolaser_on","tear_seal","tamponade_inject","retina_flatten"],
        eyeState: "laser"
      },
      { name: "Tamponade & Close", desc: "Gas/oil tamponade · port removal · IOP normalise", duration: 7000,
        vitals: { iop: [15,18], cct: [540,548], pupil: [7.5,7.8], perfusion: [80,86], aqFlow: [1.8,2.2], temp: [35.1,35.4] },
        actions: ["tamponade_fill","port_remove","conjunctiva_close","twin_post_record"],
        eyeState: "closure"
      }
    ]
  }
];

const ACTION_MESSAGES = {
  twin_calibrate:    { text: "Digital twin calibration initiated", type: "sync" },
  scan_cornea:       { text: "Corneal topography scan: 72,450 data points", type: "info" },
  iop_baseline:      { text: "IOP baseline recorded: 14.2 mmHg", type: "ok" },
  pupil_dilation:    { text: "Pharmacologic mydriasis: pupil 8.0mm", type: "info" },
  twin_map:          { text: "Twin wavefront map built: 8,192 Zernike modes", type: "sync" },
  twin_3d_build:     { text: "Retinal 3D mesh generated: 0.2μm resolution", type: "sync" },
  twin_post_record:  { text: "Post-op state recorded to digital twin archive", type: "sync" },
  incision_start:    { text: "Keratome entry: 2.4mm temporal clear cornea", type: "info" },
  aq_outflow:        { text: "Aqueous outflow detected — IOP drop 6 mmHg", type: "warn" },
  probe_incision:    { text: "Paracentesis port established at 10 o'clock", type: "info" },
  viscoelastic_inject:{ text: "OVD injected — anterior chamber maintained", type: "ok" },
  us_energy_on:      { text: "Phaco handpiece: 40kHz · 60% power · torsional mode", type: "info" },
  lens_fragment:     { text: "Nucleus fragmentation in progress — 4 quadrant chop", type: "info" },
  aspirate_cortex:   { text: "Cortical aspiration: I/A handpiece 25mmHg", type: "info" },
  iop_spike_warn:    { text: "⚠ IOP spike 26 mmHg — monitoring", type: "warn" },
  iol_cartridge:     { text: "IOL loaded: AcrySof IQ +21.0D aspheric", type: "info" },
  iol_inject:        { text: "IOL injecting through 2.4mm wound", type: "info" },
  iol_unfold:        { text: "IOL unfolding in capsular bag — twin confirms position", type: "sync" },
  iol_position:      { text: "IOL centred: pupil centration 0.12mm — OPTIMAL", type: "ok" },
  bss_hydration:     { text: "Wound hydration complete — watertight seal confirmed", type: "ok" },
  wound_seal:        { text: "Self-sealing architecture verified by twin model", type: "sync" },
  iop_check:         { text: "Final IOP: 16.2 mmHg — within normal range", type: "ok" },
  topo_scan:         { text: "Corneal topography: 25,600 points acquired", type: "info" },
  aberrometry:       { text: "Wavefront aberrometry: RMS 0.42μm · HOA 0.18μm", type: "info" },
  pachymetry:        { text: "Central corneal thickness: 558μm — adequate for ablation", type: "ok" },
  suction_ring:      { text: "Suction ring seated — negative pressure applied", type: "info" },
  iop_elevate:       { text: "⚠ IOP elevated: 65 mmHg (suction artifact — expected)", type: "warn" },
  cornea_lock:       { text: "Cornea immobilised — microkeratome docked", type: "info" },
  suction_confirm:   { text: "Suction loss threshold monitor: ACTIVE", type: "ok" },
  fs_laser_on:       { text: "Femtosecond laser: 150nJ · 7.8mm flap diameter", type: "info" },
  flap_cut:          { text: "Flap creation: 110μm depth · raster pattern complete", type: "info" },
  flap_lift:         { text: "Flap lifted and reflected — stroma exposed", type: "info" },
  stromal_expose:    { text: "Residual stromal bed: 368μm — safe for ablation", type: "ok" },
  excimer_on:        { text: "Excimer laser armed: 193nm · 95Hz · eye tracker locked", type: "info" },
  ablation_track:    { text: "Active eye tracking: 1000Hz latency <1ms", type: "sync" },
  eye_tracking:      { text: "Ablation 60% complete — pattern nominal", type: "info" },
  ablation_complete: { text: "Ablation complete: −4.25D · 45.2s · 67μm tissue removed", type: "ok" },
  flap_reposition:   { text: "Flap repositioned — edge aligned under slit lamp", type: "info" },
  bss_irrigate:      { text: "Sub-flap irrigation — interface debris cleared", type: "info" },
  align_check:       { text: "Flap striae test: NEGATIVE — adherence confirmed", type: "ok" },
  oct_scan:          { text: "OCT B-scan: retinal layers segmented — 512 A-scans", type: "info" },
  fundus_image:      { text: "Fundus imaging: temporal horseshoe tear identified", type: "warn" },
  retina_map:        { text: "Retinal thickness map: macular oedema 0.24mm", type: "warn" },
  trocar_insert:     { text: "23g trocar at 3.5mm posterior limbus — 3 ports set", type: "info" },
  infusion_cannula:  { text: "Infusion cannula confirmed intraocular — BSS flow on", type: "ok" },
  light_probe:       { text: "Endoilluminator: 3000K chandelier light active", type: "info" },
  vitrector_port:    { text: "Vitrector inserted — 23g ALCON CONSTELLATION", type: "info" },
  vitrector_on:      { text: "Vitrector: 5000 cpm · 0.04cc cut speed · vacuum 350mmHg", type: "info" },
  core_vitreous:     { text: "Core vitrectomy in progress — gel clearance 40%", type: "info" },
  pvd_induce:        { text: "Posterior vitreous detachment induced — posterior hyaloid elevated", type: "info" },
  posterior_hyaloid: { text: "Complete PVD confirmed — twin retinal surface clear", type: "ok" },
  endolaser_on:      { text: "Endolaser: 532nm · 200mW · 200ms · 8 spot rows", type: "info" },
  tear_seal:         { text: "Laser photocoagulation: 3 rows surrounding horseshoe tear", type: "info" },
  tamponade_inject:  { text: "20% SF6 gas tamponade injecting — fill 90%", type: "info" },
  retina_flatten:    { text: "Retina flat — twin confirms reattachment geometry", type: "sync" },
  tamponade_fill:    { text: "Gas fill complete: 90% — PFCL exchange complete", type: "ok" },
  port_remove:       { text: "Trocars removed — sclerotomies self-sealing confirmed", type: "info" },
  conjunctiva_close: { text: "Conjunctival peritomy closed — 8-0 vicryl × 3", type: "info" },
};

// ════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════

let selectedSurgery = 0;
let currentPhase    = -1;
let running         = false;
let paused          = false;
let speed           = 1;
let phaseTimer      = null;
let phaseProgress   = 0;
let elapsedMs       = 0;
let elapsedTimer    = null;
let vitalTimers     = [];
let anomalyCount    = 0;
let waveData        = [];
let waveCtx         = null;
let iopTarget       = 14;

// ════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════

window.onload = () => {
  const canvas = document.getElementById('waveCanvas');
  waveCtx = canvas.getContext('2d');
  waveData = new Array(110).fill(15);
  renderVitals();
  renderPhaseList();
  updateAlerts('idle');
  tickClock();
  setInterval(tickClock, 1000);
  setInterval(updateWaveform, 60);
  setInterval(jitterFidelity, 2000);
  addLog("Digital Twin OS v4.2 initialised", "sync");
  addLog("Patient ID-7741 loaded — biometry synced", "info");
  addLog("Awaiting surgery selection...", "info");
};

function tickClock() {
  const now = new Date();
  document.getElementById('clockBadge').textContent = now.toTimeString().slice(0, 8);
}

function jitterFidelity() {
  const val = (98.5 + Math.random() * 1.2).toFixed(1);
  document.getElementById('twinFidelity').textContent = val + '%';
  const lat = Math.floor(3 + Math.random() * 5);
  document.getElementById('syncLatency').textContent = lat + 'ms';
}

// ════════════════════════════════════════════
//  VITALS
// ════════════════════════════════════════════

const VITALS_DEF = [
  { key: 'iop',       name: 'IOP',           unit: 'mmHg',    normal: [8,21],   warn: [22,30],  crit: [31,99]   },
  { key: 'cct',       name: 'CCT',           unit: 'μm',      normal: [490,600],warn: [400,489],crit: [0,399]   },
  { key: 'pupil',     name: 'Pupil Ø',       unit: 'mm',      normal: [3,8.5],  warn: [1.5,2.9],crit: [0,1.4]  },
  { key: 'perfusion', name: 'Retinal Perf.', unit: '%',       normal: [80,100], warn: [60,79],  crit: [0,59]    },
  { key: 'aqFlow',    name: 'Aqueous Flow',  unit: 'μL/min',  normal: [1.5,3.0],warn: [0.5,1.4],crit: [0,0.4]  },
  { key: 'temp',      name: 'Ocular Temp.',  unit: '°C',      normal: [34.5,36.5],warn:[36.6,37.5],crit:[37.6,50]},
];

let currentVitals = { iop:14.5, cct:545, pupil:7.8, perfusion:87, aqFlow:2.3, temp:35.2 };
let targetVitals  = { ...currentVitals };

function renderVitals() {
  const container = document.getElementById('vitalsContainer');
  container.innerHTML = '';
  VITALS_DEF.forEach(def => {
    const val = currentVitals[def.key];
    const { color, status, pct } = getVitalStatus(def, val);
    container.innerHTML += `
    <div class="vital">
      <div class="vital-header">
        <span class="vital-name">${def.name}</span>
        <span class="vital-val" id="vval-${def.key}">${formatVal(val, def.key)} <span class="vital-unit">${def.unit}</span></span>
      </div>
      <div class="vital-bar-bg"><div class="vital-bar" id="vbar-${def.key}" style="width:${pct}%;background:${color}"></div></div>
      <div class="vital-status" id="vstat-${def.key}" style="color:${color}">${status}</div>
    </div>`;
  });
}

function formatVal(v, key) {
  if (key === 'iop' || key === 'cct' || key === 'perfusion') return Math.round(v);
  if (key === 'pupil' || key === 'aqFlow' || key === 'temp') return v.toFixed(1);
  return v;
}

function getVitalStatus(def, val) {
  const [nLo, nHi] = def.normal;
  const [wLo, wHi] = def.warn;
  let color, status, pct;
  if (val >= nLo && val <= nHi) {
    color = 'var(--green)'; status = '● NORMAL';
  } else if ((val >= wLo && val < nLo) || (val > nHi && val <= wHi)) {
    color = 'var(--amber)'; status = '▲ CAUTION';
  } else {
    color = 'var(--red)'; status = '■ CRITICAL';
  }
  const range = def.key === 'iop'       ? [5, 80]
              : def.key === 'cct'       ? [350, 620]
              : def.key === 'pupil'     ? [0, 10]
              : def.key === 'perfusion' ? [40, 100]
              : def.key === 'aqFlow'    ? [0, 3]
              : [33, 38];
  pct = Math.min(100, Math.max(0, (val - range[0]) / (range[1] - range[0]) * 100));
  return { color, status, pct };
}

function updateVitalDisplay() {
  VITALS_DEF.forEach(def => {
    const val = currentVitals[def.key];
    const { color, status, pct } = getVitalStatus(def, val);
    const el   = document.getElementById('vval-'  + def.key);
    const bar  = document.getElementById('vbar-'  + def.key);
    const stat = document.getElementById('vstat-' + def.key);
    if (el)   el.innerHTML = `${formatVal(val, def.key)} <span class="vital-unit">${def.unit}</span>`;
    if (bar)  { bar.style.width = pct + '%'; bar.style.background = color; }
    if (stat) { stat.textContent = status; stat.style.color = color; }
  });
}

// ════════════════════════════════════════════
//  SURGERY / PHASE
// ════════════════════════════════════════════

function selectSurgery(idx, el) {
  if (running) return;
  selectedSurgery = idx;
  document.querySelectorAll('.surg-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  currentPhase = -1;
  renderPhaseList();
  document.getElementById('currentPhaseName').textContent  = SURGERIES[idx].name.toUpperCase();
  document.getElementById('currentPhaseDesc').textContent  = SURGERIES[idx].short + ' — Ready to begin simulation';
  document.getElementById('progressFill').style.width      = '0%';
  document.getElementById('progressLabel').textContent     = '0% — PRESS START';
  resetEyeState();
  addLog('Surgery selected: ' + SURGERIES[idx].name, 'sync');
}

function renderPhaseList() {
  const surg = SURGERIES[selectedSurgery];
  const container = document.getElementById('phaseList');
  container.innerHTML = '';
  surg.phases.forEach((ph, i) => {
    const state = i < currentPhase ? 'done' : i === currentPhase ? 'active' : '';
    container.innerHTML += `<div class="phase-item ${state}" id="phase-item-${i}">
      <div class="phase-dot" id="phase-dot-${i}"></div>
      <span>${ph.name}</span>
      <span class="phase-num">${String(i + 1).padStart(2, '0')}</span>
    </div>`;
  });
}

function startOperation() {
  if (running) return;
  running = true; paused = false; currentPhase = 0; elapsedMs = 0;
  document.getElementById('btnStart').disabled = true;
  document.getElementById('btnNext').disabled  = false;
  document.getElementById('btnPause').disabled = false;
  document.getElementById('topStatus').textContent   = 'OPERATING';
  document.getElementById('topStatus').style.color   = 'var(--cyan)';
  startElapsed();
  runPhase();
  addLog('⬛ SIMULATION STARTED — ' + SURGERIES[selectedSurgery].name, 'sync');
}

function runPhase() {
  const surg = SURGERIES[selectedSurgery];
  if (currentPhase >= surg.phases.length) { endOperation(); return; }
  const phase = surg.phases[currentPhase];

  renderPhaseList();
  document.getElementById('currentPhaseName').textContent = phase.name;
  document.getElementById('currentPhaseDesc').textContent = phase.desc;

  const totalPhases = surg.phases.length;
  const phasePct    = (currentPhase / totalPhases) * 100;
  document.getElementById('progressFill').style.width   = phasePct + '%';
  document.getElementById('progressLabel').textContent  = Math.round(phasePct) + '% — Phase ' + (currentPhase + 1) + ' of ' + totalPhases;
  document.getElementById('phaseProgress').textContent  = 'Phase ' + (currentPhase + 1) + '/' + totalPhases;

  // Animate eye
  applyEyeState(phase.eyeState, phase.vitals);

  // Stream action messages
  const dur = phase.duration / speed;
  phase.actions.forEach((a, i) => {
    const delay = (i + 1) * (dur / (phase.actions.length + 1));
    setTimeout(() => {
      if (!running || paused) return;
      const msg = ACTION_MESSAGES[a];
      if (msg) { addLog(msg.text, msg.type); checkAnomaly(msg.type); }
    }, delay);
  });

  // Animate vitals
  startVitalAnimation(dur, phase.vitals);
  iopTarget = (phase.vitals.iop[0] + phase.vitals.iop[1]) / 2;

  // Alerts
  const avgIop = (phase.vitals.iop[0] + phase.vitals.iop[1]) / 2;
  if      (avgIop > 30) updateAlerts('crit', 'IOP critically elevated: ' + Math.round(avgIop) + ' mmHg — risk of optic nerve damage');
  else if (avgIop > 21) updateAlerts('warn', 'IOP above normal: ' + Math.round(avgIop) + ' mmHg — monitoring closely');
  else                  updateAlerts('ok');

  // Auto-advance
  phaseTimer = setTimeout(() => {
    if (running && !paused) nextPhase();
  }, dur);
}

function nextPhase() {
  clearTimeout(phaseTimer);
  clearVitalTimers();
  const surg = SURGERIES[selectedSurgery];
  currentPhase++;
  if (currentPhase >= surg.phases.length) { endOperation(); return; }
  runPhase();
}

function togglePause() {
  paused = !paused;
  document.getElementById('btnPause').textContent = paused ? '▶ RESUME' : '⏸ PAUSE';
  if (paused) {
    clearTimeout(phaseTimer);
    clearVitalTimers();
    stopElapsed();
    addLog('Simulation paused', 'warn');
  } else {
    runPhase();
    startElapsed();
    addLog('Simulation resumed', 'info');
  }
}

function resetOperation() {
  running = false; paused = false; currentPhase = -1;
  clearTimeout(phaseTimer); clearVitalTimers(); stopElapsed();
  elapsedMs = 0; anomalyCount = 0;
  document.getElementById('elapsedTime').textContent   = '00:00:00';
  document.getElementById('anomalyCount').textContent  = '0';
  document.getElementById('anomalyCount').style.color  = 'var(--text)';
  document.getElementById('btnStart').disabled         = false;
  document.getElementById('btnNext').disabled          = true;
  document.getElementById('btnPause').disabled         = true;
  document.getElementById('btnPause').textContent      = '⏸ PAUSE';
  document.getElementById('topStatus').textContent     = 'READY';
  document.getElementById('topStatus').style.color     = 'var(--teal)';
  document.getElementById('currentPhaseName').textContent = 'RESET — SELECT SURGERY';
  document.getElementById('currentPhaseDesc').textContent = 'Operation reset. Ready for new simulation.';
  document.getElementById('progressFill').style.width  = '0%';
  document.getElementById('progressLabel').textContent = '0% — PRESS START';
  document.getElementById('phaseProgress').textContent = '—';
  currentVitals = { iop:14.5, cct:545, pupil:7.8, perfusion:87, aqFlow:2.3, temp:35.2 };
  updateVitalDisplay();
  renderPhaseList();
  resetEyeState();
  updateAlerts('idle');
  addLog('System reset. Ready for new simulation.', 'sync');
}

function endOperation() {
  running = false;
  stopElapsed();
  const surg = SURGERIES[selectedSurgery];
  document.getElementById('currentPhaseName').textContent = 'PROCEDURE COMPLETE';
  document.getElementById('currentPhaseDesc').textContent = surg.name + ' — all phases completed successfully';
  document.getElementById('progressFill').style.width     = '100%';
  document.getElementById('progressLabel').textContent    = '100% — COMPLETE';
  document.getElementById('topStatus').textContent        = 'COMPLETE';
  document.getElementById('topStatus').style.color        = 'var(--green)';
  document.getElementById('btnNext').disabled             = true;
  document.getElementById('btnPause').disabled            = true;
  updateAlerts('ok');
  renderPhaseList();
  addLog('✓ Surgery complete — twin post-op state archived', 'ok');
  addLog('Total anomalies detected: ' + anomalyCount, anomalyCount > 2 ? 'warn' : 'ok');
}

function setSpeed(s, btn) {
  speed = s;
  document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ════════════════════════════════════════════
//  VITALS ANIMATION
// ════════════════════════════════════════════

function startVitalAnimation(dur, phaseVitals) {
  clearVitalTimers();
  const steps     = 40;
  const interval  = dur / steps;
  let   step      = 0;
  const startVals = { ...currentVitals };
  const endVals   = {};

  Object.keys(phaseVitals).forEach(k => {
    const [lo, hi] = phaseVitals[k];
    endVals[k] = lo + Math.random() * (hi - lo);
  });

  const t = setInterval(() => {
    step++;
    const progress = step / steps;
    const ease     = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    Object.keys(endVals).forEach(k => {
      const jitterScale = { iop:0.5, cct:1, pupil:0.05, perfusion:0.5, aqFlow:0.05, temp:0.05 };
      currentVitals[k] = startVals[k] + (endVals[k] - startVals[k]) * ease
        + (Math.random() - 0.5) * (jitterScale[k] || 0.1);
    });
    updateVitalDisplay();
    if (step >= steps) clearInterval(t);
  }, interval);

  vitalTimers.push(t);
}

function clearVitalTimers() {
  vitalTimers.forEach(t => clearInterval(t));
  vitalTimers = [];
}

// ════════════════════════════════════════════
//  ELAPSED TIME
// ════════════════════════════════════════════

function startElapsed() {
  stopElapsed();
  elapsedTimer = setInterval(() => {
    elapsedMs += 1000;
    const h = Math.floor(elapsedMs / 3600000);
    const m = Math.floor((elapsedMs % 3600000) / 60000);
    const s = Math.floor((elapsedMs % 60000) / 1000);
    document.getElementById('elapsedTime').textContent =
      String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  }, 1000);
}

function stopElapsed() {
  if (elapsedTimer) { clearInterval(elapsedTimer); elapsedTimer = null; }
}

// ════════════════════════════════════════════
//  EVENT LOG
// ════════════════════════════════════════════

function addLog(text, type = 'info') {
  const container = document.getElementById('eventLog');
  const time      = new Date().toTimeString().slice(0, 8);
  const entry     = document.createElement('div');
  entry.className = 'log-entry ' + type;
  entry.innerHTML = `<span class="log-time">${time}</span><span class="log-text">${text}</span>`;
  container.prepend(entry);
  if (container.children.length > 80) container.lastChild.remove();
}

function checkAnomaly(type) {
  if (type === 'warn' || type === 'alert') {
    anomalyCount++;
    const el = document.getElementById('anomalyCount');
    el.textContent  = anomalyCount;
    el.style.color  = anomalyCount > 3 ? 'var(--red)' : 'var(--amber)';
  }
}

// ════════════════════════════════════════════
//  ALERTS
// ════════════════════════════════════════════

function updateAlerts(state, msg) {
  document.getElementById('alertWarn').classList.remove('visible');
  document.getElementById('alertCrit').classList.remove('visible');
  document.getElementById('alertOk').style.display = 'none';

  if      (state === 'warn') {
    document.getElementById('alertWarnMsg').textContent = msg || 'Parameter outside normal range';
    document.getElementById('alertWarn').classList.add('visible');
  } else if (state === 'crit') {
    document.getElementById('alertCritMsg').textContent = msg || 'Immediate review required';
    document.getElementById('alertCrit').classList.add('visible');
  } else if (state === 'ok') {
    document.getElementById('alertOk').style.display = 'flex';
  }
}

// ════════════════════════════════════════════
//  IOP WAVEFORM (Canvas)
// ════════════════════════════════════════════

function updateWaveform() {
  const canvas = document.getElementById('waveCanvas');
  const ctx    = waveCtx;
  const W = canvas.width, H = canvas.height;

  waveData.push(currentVitals.iop + (Math.random() - 0.5) * 2 + Math.sin(Date.now() / 300) * 1.5);
  if (waveData.length > 110) waveData.shift();

  ctx.clearRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(15,32,53,1)';
  ctx.lineWidth = 0.5;
  for (let y = 0; y < H; y += 10) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Normal band (8–21 mmHg)
  const minV = 5, maxV = 40;
  const yHi  = H - (21 - minV) / (maxV - minV) * H;
  const yLo  = H - (8  - minV) / (maxV - minV) * H;
  ctx.fillStyle = 'rgba(0,232,122,0.05)';
  ctx.fillRect(0, yHi, W, yLo - yHi);

  // Waveform line
  ctx.beginPath();
  waveData.forEach((v, i) => {
    const x = (i / (waveData.length - 1)) * W;
    const y = H - (v - minV) / (maxV - minV) * H;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });

  const curIop    = waveData[waveData.length - 1];
  const warnColor = curIop > 30 ? '#ff3355' : curIop > 21 ? '#ffb800' : '#00ffc8';
  ctx.strokeStyle = warnColor;
  ctx.lineWidth   = 1.5;
  ctx.shadowColor = warnColor;
  ctx.shadowBlur  = 4;
  ctx.stroke();
  ctx.shadowBlur  = 0;

  // Current value label
  ctx.fillStyle = warnColor;
  ctx.font      = '9px Space Mono';
  ctx.fillText(Math.round(curIop) + ' mmHg', W - 52, 10);
}

// ════════════════════════════════════════════
//  EYE SVG STATE ENGINE
// ════════════════════════════════════════════

function resetEyeState() {
  const ids = ['pupil','iris','lens','cornea','scanOverlay','iolHighlight','probeGroup','retinaHighlight','laserBeam','bloodVessels','vitreous'];
  const el  = id => document.getElementById(id);

  el('pupil')         && el('pupil').setAttribute('r', '28');
  el('iris')          && el('iris').setAttribute('r', '52');
  el('iris')          && el('iris').setAttribute('fill', 'url(#irisGrad)');
  el('lens')          && el('lens').setAttribute('opacity', '1');
  el('cornea')        && el('cornea').setAttribute('stroke', 'rgba(200,240,255,0.6)');
  el('cornea')        && el('cornea').setAttribute('stroke-width', '0.8');
  el('cornea')        && el('cornea').setAttribute('opacity', '1');
  el('scanOverlay')   && el('scanOverlay').setAttribute('opacity', '0');
  el('iolHighlight')  && el('iolHighlight').setAttribute('opacity', '0');
  el('probeGroup')    && el('probeGroup').setAttribute('opacity', '0');
  el('retinaHighlight')&& el('retinaHighlight').setAttribute('opacity', '0');
  el('bloodVessels')  && el('bloodVessels').setAttribute('opacity', '0.6');
  el('vitreous')      && el('vitreous').setAttribute('opacity', '1');

  if (el('laserBeam')) {
    el('laserBeam').style.opacity = '0';
    el('laserBeam').style.height  = '0px';
    el('laserBeam').classList.remove('flicker');
  }
}

function applyEyeState(state, vitals) {
  resetEyeState();
  const el = id => document.getElementById(id);

  const avgPupil = (vitals.pupil[0] + vitals.pupil[1]) / 2;
  const pupilR   = Math.round(10 + (avgPupil / 10) * 24);
  el('pupil').setAttribute('r', pupilR);
  el('scanOverlay').setAttribute('opacity', '0.8');

  switch (state) {
    case 'incision':
      el('cornea').setAttribute('stroke', 'rgba(255,184,0,0.8)');
      el('cornea').setAttribute('stroke-width', '1.5');
      break;

    case 'suction':
      el('cornea').setAttribute('stroke', 'rgba(255,184,0,0.9)');
      el('cornea').setAttribute('stroke-width', '2');
      el('iris').setAttribute('fill', '#2a4a30');
      el('pupil').setAttribute('r', Math.round(pupilR * 0.7));
      break;

    case 'flap':
      el('cornea').setAttribute('stroke', 'rgba(255,184,0,0.9)');
      el('cornea').setAttribute('stroke-width', '2');
      el('cornea').setAttribute('opacity', '0.5');
      break;

    case 'phaco':
      el('lens').setAttribute('opacity', '0.2');
      el('iolHighlight').setAttribute('opacity', '1');
      el('iolHighlight').setAttribute('stroke', 'var(--amber)');
      break;

    case 'laser':
      el('laserBeam').style.opacity    = '0.9';
      el('laserBeam').style.height     = '80px';
      el('laserBeam').style.background = 'linear-gradient(to bottom, transparent, var(--cyan), rgba(0,229,255,0.2))';
      el('laserBeam').classList.add('flicker');
      break;

    case 'iol':
      el('lens').setAttribute('opacity', '0');
      el('iolHighlight').setAttribute('opacity', '1');
      el('iolHighlight').setAttribute('stroke', 'var(--cyan)');
      break;

    case 'ports':
      el('probeGroup').setAttribute('opacity', '0.8');
      break;

    case 'vitrectomy':
      el('probeGroup').setAttribute('opacity', '1');
      el('vitreous').setAttribute('opacity', '0.3');
      break;

    case 'closure':
      el('cornea').setAttribute('stroke', 'rgba(0,232,122,0.6)');
      el('cornea').setAttribute('stroke-width', '1.2');
      el('iolHighlight').setAttribute('opacity', '0.5');
      el('iolHighlight').setAttribute('stroke', 'var(--green)');
      break;

    case 'normal':
    default:
      break;
  }
}
