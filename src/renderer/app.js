const THREAT_TARGET_KINDS = ['system', 'pilot', 'corporation', 'alliance'];
const THREAT_TARGET_KIND_LABELS = {
  system: 'System',
  pilot: 'Pilot',
  corporation: 'Corp',
  alliance: 'Al'
};
const FRONT_CONTEXT_MODES = {
  weapon: 'Observed Weapon',
  source: 'Observed Source',
  balance: 'Repair Balance'
};

const state = {
  frame: {
    alwaysOnTop: false
  },
  unsubscribeCombatWitness: null,
  unsubscribePassiveTelemetry: null,
  unsubscribeClipboardSnapshots: null,
  unsubscribeTargetKindToggles: null,
  unsubscribePresentationPauses: null,
  clipboardPoll: null,
  clipboardStatePoll: null,
  lastClipboardCaptureKey: null,
  pendingPresentation: {},
  presentationPaused: false,
  presentationResumeTimer: null,
  threatGatewayTimer: null,
  threatGatewayActive: false,
  lastThreatSnapshot: null,
  watcherState: 'unavailable',
  liveIoEnabled: false,
  frontContextMode: loadFrontContextMode(),
  threatTargetKind: 'system',
  ctrlDown: false,
  slashDown: false
};

async function boot() {
  await bootFrame();
  await bootRuntimeHealth();
  await bootRuntimeControl();
  await bootWatcherControls();
  await bootCombatWitness();
  await bootPassiveTelemetry();
  await bootThreatIntel();
  bootPresentationSlots();
  bootKeyboardGlow();
}

async function bootRuntimeHealth() {
  const readiness = await window.aura.invokeService('seed.readiness');
  setText('runtime-health', readiness.ok ? 'Runtime ready' : 'Runtime blocked');
}

async function bootRuntimeControl() {
  await refreshRuntimeControl();
}

async function bootCombatWitness() {
  if (!window.auraCombatWitness) {
    renderUnavailableCombatWitness();
    return;
  }

  renderCombatWitness(await window.auraCombatWitness.getSnapshot());
  state.unsubscribeCombatWitness = window.auraCombatWitness.subscribeSnapshots(renderCombatWitness);
}

async function bootPassiveTelemetry() {
  if (!window.auraPassiveTelemetry) {
    renderPassiveTelemetry(null);
    return;
  }
  renderPassiveTelemetry(await window.auraPassiveTelemetry.getSnapshot());
  state.unsubscribePassiveTelemetry = window.auraPassiveTelemetry.subscribeSnapshots(renderPassiveTelemetry);
}

async function bootThreatIntel() {
  byId('threat-search').addEventListener('submit', submitThreatSearch);
  byId('threat-target').addEventListener('focus', () => renderThreatMessage('Manual fallback ready. Focus alone does not scan.'));
  byId('threat-kind-selector').addEventListener('click', selectThreatTargetKind);
  renderThreatTargetKind();

  if (!window.auraThreatIntel) {
    renderThreatSnapshot(null);
    renderClipboardState(null);
    renderShortcutStatus(null);
    return;
  }

  renderThreatSnapshot(await window.auraThreatIntel.getSnapshot());
  renderClipboardState(await window.auraThreatIntel.getClipboardState());
  if (window.auraThreatIntel.getShortcutStatus) {
    renderShortcutStatus(await window.auraThreatIntel.getShortcutStatus());
  }
  if (window.auraThreatIntel.subscribeClipboardSnapshots) {
    state.unsubscribeClipboardSnapshots = window.auraThreatIntel.subscribeClipboardSnapshots((snapshot) => {
      renderClipboardState(snapshot);
      consumeClipboardCapture(snapshot);
    });
  }
  if (window.auraThreatIntel.subscribeTargetKindToggles) {
    state.unsubscribeTargetKindToggles = window.auraThreatIntel.subscribeTargetKindToggles(() => {
      toggleThreatTargetKind({ source: 'shortcut' });
    });
  }
  state.clipboardStatePoll = setInterval(refreshClipboardState, 1000);
}

async function bootWatcherControls() {
  byId('watcher-controls').addEventListener('submit', startWatcher);
  byId('pick-gamelog-folder').addEventListener('click', pickGamelogFolder);
  const status = await window.aura.invokeService('combat.witness.status');
  renderWatcherStatus(status);
  if (currentGamelogFolder() && status?.watcher?.state !== 'watching') {
    await setWatcherRunning(true);
  }
}

async function refreshRuntimeControl() {
  const [settings, liveIo, diagnostics] = await Promise.all([
    window.aura.invokeService('runtime.settings.snapshot'),
    window.aura.invokeService('runtime.live-io.snapshot'),
    window.aura.invokeService('runtime.diagnostics.snapshot')
  ]);
  renderRuntimeSettings(settings);
  renderLiveIoPolicy(liveIo);
  renderDiagnostics(diagnostics);
}

async function bootFrame() {
  if (!window.auraWindow) {
    return;
  }
  state.frame = await window.auraWindow.getState();
  renderFrameState();
  byId('diagnostics-toggle').addEventListener('click', toggleDiagnostics);
  byId('diagnostics-close').addEventListener('click', closeDiagnostics);
  byId('live-io-toggle').addEventListener('click', toggleLiveIoPolicy);
  byId('top-live-io-toggle').addEventListener('click', toggleLiveIoPolicy);
  bootPresentationPause();
  byId('pin-window').addEventListener('click', toggleAlwaysOnTop);
  byId('minimize-window').addEventListener('click', () => window.auraWindow.minimize());
  byId('close-window').addEventListener('click', () => {
    state.unsubscribeCombatWitness?.();
    state.unsubscribePassiveTelemetry?.();
    state.unsubscribeClipboardSnapshots?.();
    state.unsubscribeTargetKindToggles?.();
    state.unsubscribePresentationPauses?.();
    if (state.clipboardPoll) {
      clearInterval(state.clipboardPoll);
    }
    if (state.clipboardStatePoll) {
      clearInterval(state.clipboardStatePoll);
    }
    window.auraWindow.close();
  });
}

function bootPresentationPause() {
  const dragRegion = document.querySelector('.frame-drag-region');
  dragRegion?.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    setPresentationPaused(true);
  });
  window.addEventListener('pointerup', () => {
    schedulePresentationResume();
  });
  window.addEventListener('blur', () => {
    schedulePresentationResume();
  });
  if (window.auraWindow?.subscribePresentationPauses) {
    state.unsubscribePresentationPauses = window.auraWindow.subscribePresentationPauses((payload) => {
      if (payload?.paused) {
        setPresentationPaused(true);
      } else {
        schedulePresentationResume();
      }
    });
  }
}

function schedulePresentationResume() {
  if (state.presentationResumeTimer) {
    clearTimeout(state.presentationResumeTimer);
  }
  state.presentationResumeTimer = setTimeout(() => {
    setPresentationPaused(false);
  }, 120);
}

function setPresentationPaused(paused) {
  const next = paused === true;
  if (state.presentationPaused === next) return;
  state.presentationPaused = next;
  document.body.classList.toggle('presentation-paused', next);
  if (!next) {
    flushPendingPresentation();
  }
}

function queuePresentationUpdate(key, payload, renderer) {
  if (!state.presentationPaused) return false;
  state.pendingPresentation[key] = { payload, renderer };
  return true;
}

function flushPendingPresentation() {
  const pending = state.pendingPresentation;
  state.pendingPresentation = {};
  for (const key of ['combatWitness', 'passiveTelemetry', 'threatSnapshot', 'clipboardState', 'shortcutStatus']) {
    if (pending[key]) {
      pending[key].renderer(pending[key].payload);
    }
  }
}

async function toggleAlwaysOnTop() {
  const pin = byId('pin-window');
  pin.disabled = true;
  try {
    state.frame = await window.auraWindow.setAlwaysOnTop(!state.frame.alwaysOnTop);
    renderFrameState();
  } finally {
    pin.disabled = false;
  }
}

function renderFrameState() {
  const pin = byId('pin-window');
  pin.classList.toggle('active', state.frame.alwaysOnTop === true);
  pin.textContent = state.frame.alwaysOnTop ? 'Pinned' : 'Pin';
}

function bootPresentationSlots() {
  renderFrontContextTile(null, null);
  byId('front-context-selector').addEventListener('click', (event) => {
    event.stopPropagation();
    toggleFrontContextMenu();
  });
  byId('front-context-menu').addEventListener('click', (event) => {
    const button = event.target.closest?.('[data-front-context-mode]');
    if (!button) return;
    setFrontContextMode(button.dataset.frontContextMode);
    closeFrontContextMenu();
  });
  document.addEventListener('click', closeFrontContextMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeFrontContextMenu();
  });
}

function toggleFrontContextMenu() {
  const menu = byId('front-context-menu');
  const nextOpen = menu.hidden === true;
  menu.hidden = !nextOpen;
  byId('front-context-selector').setAttribute('aria-expanded', String(nextOpen));
}

function closeFrontContextMenu() {
  byId('front-context-menu').hidden = true;
  byId('front-context-selector').setAttribute('aria-expanded', 'false');
}

function setFrontContextMode(mode) {
  if (!FRONT_CONTEXT_MODES[mode]) return;
  state.frontContextMode = mode;
  localStorage.setItem('auraSense.frontContextMode', mode);
  renderFrontContextTile(state.lastCombatIncoming || null, state.lastCombatBalance || null);
}

function loadFrontContextMode() {
  try {
    const mode = localStorage.getItem('auraSense.frontContextMode');
    return FRONT_CONTEXT_MODES[mode] ? mode : 'weapon';
  } catch (_error) {
    return 'weapon';
  }
}

function renderFrontContextTile(incoming, balance) {
  state.lastCombatIncoming = incoming;
  state.lastCombatBalance = balance;
  const mode = FRONT_CONTEXT_MODES[state.frontContextMode] ? state.frontContextMode : 'weapon';
  setText('front-context-label', FRONT_CONTEXT_MODES[mode]);
  if (mode === 'source') {
    setText('front-context-value', observedCountLabel(incoming?.topSource, '--'));
  } else if (mode === 'balance') {
    setText('front-context-value', signedRate(balance?.receivedRepairMinusDamagePerSecond));
  } else {
    setText('front-context-value', observedCountLabel(incoming?.mostObservedWeaponType, '--'));
  }
  document.querySelectorAll('[data-front-context-mode]').forEach((button) => {
    const active = button.dataset.frontContextMode === mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function toggleDiagnostics() {
  const viewport = byId('integrated-viewport');
  const open = !viewport.classList.contains('diagnostics-open');
  viewport.classList.toggle('diagnostics-open', open);
  byId('diagnostics-toggle').classList.toggle('active', open);
  byId('diagnostics-toggle').setAttribute('aria-pressed', String(open));
  byId('diagnostics-toggle').setAttribute('aria-label', open ? 'Close diagnostics' : 'Open diagnostics');
}

function closeDiagnostics() {
  const viewport = byId('integrated-viewport');
  viewport.classList.remove('diagnostics-open');
  byId('diagnostics-toggle').classList.remove('active');
  byId('diagnostics-toggle').setAttribute('aria-pressed', 'false');
  byId('diagnostics-toggle').setAttribute('aria-label', 'Open diagnostics');
}

function renderCombatWitness(snapshot) {
  if (queuePresentationUpdate('combatWitness', snapshot, renderCombatWitness)) return;
  const watcher = snapshot?.operational?.watcher || {};
  const status = statusFromSnapshot(snapshot);
  const window5s = snapshot?.windows?.['5s'] || {};
  const window15s = snapshot?.windows?.['15s'] || {};
  const events = Array.isArray(snapshot?.eventStream) ? snapshot.eventStream.slice(0, 5) : [];
  const incoming = window15s.damage?.incoming || {};
  const repair = window15s.repair?.incoming || {};
  const balance = window15s.balance || {};
  const netPressure = Number(repair.perSecond) - Number(incoming.perSecond);

  setText('combat-signal', signalLabel(status));
  setText('combat-title', compactCombatTitle(status));
  setText('combat-summary', summaryForStatus(status));
  const detail = combatDetail(snapshot, status);
  setText('combat-detail', detail);
  setText('watcher-state', watcherLabel(watcher.state));
  setText('watcher-message', watcher.message || 'Log Watcher unavailable.');
  renderWatcherIndicator(watcher);
  setText('incoming-5s', formatNumber(window5s.damage?.incoming?.total));
  setText('repair-15s', formatNumber(window15s.repair?.incoming?.total));
  setText('event-count', formatNumber(snapshot?.freshness?.eventStreamCount));
  setText('incoming-pressure', formatNumber(incoming.perSecond));
  setText('repair-throughput', formatNumber(repair.perSecond));
  renderNetPressure(netPressure, incoming.perSecond, repair.perSecond);
  setText('repair-balance', signedRate(balance.receivedRepairMinusDamagePerSecond));
  setText('observed-source', observedCountLabel(incoming.topSource, 'Unobserved'));
  setText('front-observed-source', observedCountLabel(incoming.topSource, '--'));
  setText('observed-weapon', observedCountLabel(incoming.mostObservedWeaponType, 'Unobserved'));
  renderFrontContextTile(incoming, balance);
  renderMeter('incoming-bar', incoming.perSecond, 1000);
  renderMeter('repair-bar', repair.perSecond, 1000);
  toggleQuiet('incoming-pressure-row', !Number(incoming.perSecond));
  toggleQuiet('repair-throughput-row', !Number(repair.perSecond));
  renderEventList(events, status);
}

function renderUnavailableCombatWitness() {
  setText('combat-signal', 'Unavailable');
  setText('combat-title', 'Quiet');
  setText('combat-summary', 'Combat Witness bridge unavailable.');
  setText('combat-detail', 'Combat Witness bridge unavailable.');
  setText('watcher-state', 'Unavailable');
  setText('watcher-message', 'Log Watcher unavailable.');
  renderWatcherIndicator({ state: 'unavailable', message: 'Log Watcher unavailable.' });
  setText('incoming-5s', '0');
  setText('repair-15s', '0');
  setText('event-count', '0');
  setText('incoming-pressure', '0');
  setText('repair-throughput', '0');
  renderNetPressure(0, 0, 0);
  setText('repair-balance', '0 /s');
  setText('observed-source', 'Unobserved');
  setText('front-observed-source', '--');
  setText('observed-weapon', 'Unobserved');
  renderFrontContextTile(null, null);
  renderMeter('incoming-bar', 0, 1000);
  renderMeter('repair-bar', 0, 1000);
  renderEventList([], 'unavailable');
}

function renderPassiveTelemetry(snapshot) {
  if (queuePresentationUpdate('passiveTelemetry', snapshot, renderPassiveTelemetry)) return;
  const status = snapshot?.status || 'unavailable';
  const activity = snapshot?.activity || {};
  const hasSystem = Boolean(snapshot?.currentSystem?.label);
  const shipKills = Number(activity.shipKills) || 0;
  const jumps = Number(activity.jumps) || 0;
  const passiveReadout = passiveReadoutFromSnapshot(snapshot);

  setText('passive-state', passiveStateLabel(status));
  setText('passive-system', snapshot?.currentSystem?.label || '--');
  setText('system-shipkills', hasSystem ? formatNumber(shipKills) : '--');
  setText('system-jumps', hasSystem ? formatNumber(jumps) : '--');
  setText('system-ratio', hasSystem ? formatRatio(shipKills, jumps) : '--');
  setText('passive-sample', formatNumber(snapshot?.zkill?.sampleCount));
  setText('passive-activity', passiveActivity(snapshot));
  setText('passive-freshness', passiveStateLabel(snapshot?.freshness?.status || status));
  setText('passive-basis', passiveBasis(snapshot));
  setText('passive-age', passiveAgeLabel(snapshot));
  setText('passive-gap', passiveGapLabel(snapshot));
  renderPassiveReadout(passiveReadout);
  renderProviderPulse('passive', providerPulseFromPassive(snapshot));
  setText('passive-message', passiveMessage(snapshot));
  byId('system-ratio').classList.toggle('is-warm', hasSystem && shipKills > 0);
}

async function submitThreatSearch(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const input = byId('threat-target');
  input.disabled = true;
  try {
    const targetText = input.value;
    setThreatAcquisitionState('scanning', targetText || 'Manual fallback scan');
    const snapshot = await window.auraThreatIntel.scan({
      targetText,
      targetKind: state.threatTargetKind,
      inputSource: 'search'
    });
    renderThreatSnapshot(snapshot);
  } catch (error) {
    renderThreatSnapshot({ status: 'failed', message: error.message });
  } finally {
    input.disabled = false;
  }
}

async function armClipboardAcquisition() {
  try {
    setThreatBackPageOpen(true);
    setThreatAcquisitionState('pulling', 'Pulling clipboard target');
    const snapshot = await window.auraThreatIntel.armClipboard();
    renderClipboardState(snapshot);
    scheduleClipboardPoll();
  } finally {
    updateKeyGlow();
  }
}

function scheduleClipboardPoll() {
  if (state.clipboardPoll) {
    clearInterval(state.clipboardPoll);
  }
  state.clipboardPoll = setInterval(async () => {
    const snapshot = await window.auraThreatIntel.captureClipboard();
    renderClipboardState(snapshot);
    consumeClipboardCapture(snapshot);
    if (snapshot.lastCapture?.targetText) {
      byId('threat-target').value = snapshot.lastCapture.targetText;
      setThreatBackPageOpen(true);
      renderThreatSnapshot(snapshot.lastCapture.result);
    }
    if (snapshot.state !== 'listening') {
      clearInterval(state.clipboardPoll);
      state.clipboardPoll = null;
    }
  }, 400);
}

async function refreshClipboardState() {
  if (!window.auraThreatIntel) {
    return;
  }
  const snapshot = await window.auraThreatIntel.getClipboardState();
  renderClipboardState(snapshot);
  consumeClipboardCapture(snapshot);
  if (window.auraThreatIntel.getShortcutStatus) {
    renderShortcutStatus(await window.auraThreatIntel.getShortcutStatus());
  }
}

function consumeClipboardCapture(snapshot) {
  const capture = snapshot?.lastCapture;
  if (!capture?.targetText) {
    return;
  }
  const key = `${snapshot.state}:${snapshot.reason || ''}:${capture.targetText}`;
  if (state.lastClipboardCaptureKey === key) {
    return;
  }
  state.lastClipboardCaptureKey = key;
  byId('threat-target').value = capture.targetText;
  setThreatBackPageOpen(true);
  if (capture.result) {
    if (shouldRescanCaptureWithKind(capture.result)) {
      rescanClipboardCapture(capture.targetText);
    } else {
      renderThreatSnapshot(capture.result);
    }
  } else {
    setThreatAcquisitionState('scanning', capture.targetText);
    renderThreatMessage('Clipboard target captured; scan pending.');
  }
}

async function rescanClipboardCapture(targetText) {
  try {
    setThreatAcquisitionState('scanning', targetText);
    const snapshot = await window.auraThreatIntel.scan({
      targetText,
      targetKind: state.threatTargetKind,
      inputSource: 'clipboard'
    });
    renderThreatSnapshot(snapshot);
  } catch (error) {
    renderThreatSnapshot({ status: 'failed', message: error.message });
  }
}

function shouldRescanCaptureWithKind(result) {
  return state.threatTargetKind
    && result?.status !== 'succeeded'
    && result?.status !== 'partial'
    && result?.failure?.code !== 'THREAT_TARGET_UNSUPPORTED';
}

function renderThreatSnapshot(snapshot) {
  if (queuePresentationUpdate('threatSnapshot', snapshot, renderThreatSnapshot)) return;
  const status = snapshot?.status || 'empty';
  state.lastThreatSnapshot = snapshot || null;
  setText('threat-state', threatStateLabel(status));
  setText('threat-target-label', snapshot?.target?.label || '--');
  setText('threat-display-target', threatDisplayTarget(snapshot));
  renderThreatKindStatus(snapshot);
  setText('threat-provider', threatProviderLabel(snapshot, 'zKill'));
  setText('front-threat-provider', 'Back page');
  setText('threat-sample', threatSample(snapshot));
  setText('threat-basis', threatBasis(snapshot));
  renderProviderPulse('threat', providerPulseFromThreat(snapshot));
  renderThreatPulse(snapshot);
  renderThreatReport(snapshot);
  setThreatAcquisitionState(status === 'pending' ? 'scanning' : (status === 'blocked' ? 'blocked' : 'idle'), threatDisplayTarget(snapshot));
  renderThreatMessage(threatMessage(snapshot));
}

function renderThreatPulse(snapshot) {
  const pulse = byId('threat-pulse');
  const dots = Array.from(pulse.querySelectorAll('span'));
  const count = Number(snapshot?.zkill?.discoveredCount) || 0;
  const selected = Number(snapshot?.zkill?.selectedCount) || 0;
  const activeDots = count > 0 ? Math.max(1, Math.min(dots.length, Math.ceil((count / 10) * dots.length))) : 0;
  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index < activeDots);
    dot.classList.toggle('is-selected', selected > 0 && index < Math.min(dots.length, selected));
  });
  pulse.classList.toggle('is-empty', activeDots === 0);
  pulse.setAttribute('title', count > 0 ? `${formatNumber(count)} recent signals in ${lookbackLabel(snapshot.zkill.lookbackSeconds)}` : 'No pulse loaded');
}

function renderThreatMessage(message) {
  setText('threat-message', message);
}

function renderThreatReport(snapshot) {
  const status = snapshot?.status || 'empty';
  const target = threatDisplayTarget(snapshot);
  setText('threat-report-target', target);
  setText('threat-report-status', threatStateLabel(status));
  setText('threat-report-type', threatReportTargetType(snapshot));
  setText('threat-report-basis', threatBasis(snapshot));
  setText('threat-report-sample', threatReportSample(snapshot));
  setText('threat-report-state', threatReportState(snapshot));
  setText('threat-report-message', threatReportMessage(snapshot));
}

function threatDisplayTarget(snapshot) {
  return snapshot?.target?.label || snapshot?.request?.targetText || 'No scan';
}

function clipboardDisplayTarget(snapshot) {
  if (snapshot?.lastCapture?.targetText) return snapshot.lastCapture.targetText;
  if (state.lastThreatSnapshot) return threatDisplayTarget(state.lastThreatSnapshot);
  return 'No scan';
}

function threatReportMessage(snapshot) {
  if (!snapshot || snapshot.status === 'empty') return 'Report persists until the next scan.';
  if (snapshot.status === 'blocked') return snapshot.message || 'Live IO blocked.';
  if (snapshot.status === 'partial') return snapshot.failure?.message || snapshot.message || 'Partial sample; capped or incomplete provider coverage.';
  if (snapshot.status === 'failed') return snapshot.failure?.message || snapshot.message || 'Scan failed.';
  if (snapshot.status === 'ambiguous') return snapshot.message || 'Ambiguous target; no provider sample selected.';
  if (snapshot.status === 'unresolved' || snapshot.status === 'unsupported') return snapshot.message || 'No provider sample selected.';
  if (snapshot.status === 'succeeded') return snapshot.message || 'Scoped zKill sample refreshed; not complete coverage.';
  return snapshot.message || 'No provider result yet.';
}

function setThreatAcquisitionState(status, label) {
  const bar = byId('threat-acquisition-bar');
  const normalized = status === 'listening'
    ? 'listening'
    : (status === 'pulling' ? 'pulling' : (status === 'cooldown' ? 'cooldown' : (status === 'blocked' ? 'blocked' : (status === 'scanning' || status === 'pending' ? 'scanning' : 'idle'))));
  bar.classList.remove('is-idle', 'is-listening', 'is-pulling', 'is-scanning', 'is-cooldown', 'is-blocked');
  bar.classList.add(`is-${normalized}`);
  setText('threat-acquisition-status', threatAcquisitionLabel(status));
  if (normalized === 'scanning') {
    byId('clipboard-listen').classList.remove('is-listening');
  }
  if (label && label !== 'No scan') {
    setText('threat-display-target', label);
  }
}

function threatAcquisitionLabel(status) {
  if (status === 'listening') return 'Listening';
  if (status === 'pulling') return 'Pulling';
  if (status === 'cooldown') return 'Cooldown';
  if (status === 'scanning' || status === 'pending') return 'Scanning';
  if (status === 'blocked') return 'Blocked';
  return 'Idle';
}

function threatReportTargetType(snapshot) {
  return targetKindLabel(snapshot?.request?.targetKind || snapshot?.target?.kind || state.threatTargetKind);
}

function threatReportSample(snapshot) {
  const zkill = snapshot?.zkill;
  if (!zkill) return '0 / 0';
  return `${formatNumber(zkill.selectedCount)} / ${formatNumber(zkill.discoveredCount)}`;
}

function threatReportState(snapshot) {
  if (!snapshot || snapshot.status === 'empty') return 'No scan';
  if (snapshot.status === 'blocked') return 'Live IO blocked';
  if (snapshot.status === 'partial') return snapshot.zkill?.capped ? 'Capped partial sample' : 'Partial sample';
  if (snapshot.status === 'failed') return 'Provider failed';
  if (snapshot.status === 'ambiguous') return 'Ambiguous target';
  if (snapshot.status === 'unresolved') return 'Unresolved target';
  if (snapshot.status === 'unsupported') return 'Unsupported target';
  if (snapshot.status === 'succeeded') return snapshot.zkill?.capped ? 'Capped sample' : 'Scoped sample';
  return threatStateLabel(snapshot.status);
}

function renderClipboardState(snapshot) {
  if (queuePresentationUpdate('clipboardState', snapshot, renderClipboardState)) return;
  const status = snapshot?.state || 'idle';
  const listening = status === 'listening';
  const cooldown = status === 'cooldown';
  const blocked = status === 'blocked';
  setText('clipboard-state', clipboardStateLabel(status));
  byId('clipboard-listen').classList.toggle('is-listening', listening);
  byId('clipboard-listen').classList.toggle('is-cooldown', cooldown);
  byId('clipboard-listen').classList.toggle('is-unsupported', blocked || !state.liveIoEnabled);
  setThreatAcquisitionState(status, clipboardDisplayTarget(snapshot));
  if (blocked && snapshot?.message) {
    renderThreatMessage(snapshot.message);
  }
  updateKeyGlow();
}

function renderShortcutStatus(status) {
  if (queuePresentationUpdate('shortcutStatus', status, renderShortcutStatus)) return;
  const shortcutLabel = status?.registered ? 'Ctrl+\\' : (status?.fallbackRegistered ? 'Ctrl+Alt+Space' : 'Manual');
  setText('shortcut-message', status?.message || 'Ctrl+\\ opens a 3 second clipboard scan window, then listening stops.');
  setText('clipboard-key-ctrl', shortcutLabel.startsWith('Ctrl') ? 'Ctrl' : 'Scan');
  setText('clipboard-key-slash', status?.fallbackRegistered ? 'Alt+Space' : '\\');
  byId('clipboard-listen').classList.toggle('is-unsupported', status?.registered === false);
}

function selectThreatTargetKind(event) {
  const button = event.target.closest?.('[data-threat-kind]');
  if (!button) return;
  const nextKind = button.dataset.threatKind;
  if (!THREAT_TARGET_KINDS.includes(nextKind)) return;
  state.threatTargetKind = nextKind;
  renderThreatTargetKind();
  pulseTargetKind();
  renderThreatMessage(`Target type set to ${targetKindLabel(nextKind)}. No scan started.`);
}

function toggleThreatTargetKind(_event = null) {
  const current = THREAT_TARGET_KINDS.indexOf(state.threatTargetKind);
  state.threatTargetKind = THREAT_TARGET_KINDS[(current + 1) % THREAT_TARGET_KINDS.length];
  renderThreatTargetKind();
  pulseTargetKind();
  renderThreatMessage(`Target type set to ${targetKindLabel(state.threatTargetKind)}. No scan started.`);
}

function renderThreatTargetKind() {
  const label = targetKindLabel(state.threatTargetKind);
  setText('threat-kind-status', label);
  byId('threat-kind-selector').setAttribute('title', `Alt+\\ cycles target kind. Current: ${label}`);
  document.querySelectorAll('[data-threat-kind]').forEach((button) => {
    const active = button.dataset.threatKind === state.threatTargetKind;
    button.classList.toggle('is-on', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function pulseTargetKind() {
  const selector = byId('threat-kind-selector');
  selector.classList.add('is-local-change');
  setTimeout(() => selector.classList.remove('is-local-change'), 280);
}

function renderThreatKindStatus(snapshot) {
  if (isWrongThreatKind(snapshot)) {
    setText('threat-kind-status', 'Wrong type');
  } else {
    setText('threat-kind-status', targetKindLabel(state.threatTargetKind));
  }
}

function isWrongThreatKind(snapshot) {
  return Boolean(snapshot?.request?.targetKind)
    && (snapshot.status === 'unresolved' || snapshot.status === 'ambiguous')
    && snapshot.failure?.code !== 'THREAT_TARGET_EMPTY';
}

function targetKindLabel(kind) {
  return THREAT_TARGET_KIND_LABELS[kind] || 'System';
}

async function startWatcher(event) {
  event.preventDefault();
  await setWatcherRunning(state.watcherState !== 'watching');
}

async function setWatcherRunning(enabled) {
  const folder = currentGamelogFolder();
  const status = enabled
    ? await window.aura.invokeService('combat.witness.start', { gamelogFolder: folder })
    : await window.aura.invokeService('combat.witness.stop');
  renderWatcherStatus(status);
  await refreshRuntimeControl();
}

async function stopWatcher() {
  await setWatcherRunning(false);
}

async function pickGamelogFolder() {
  setSetupButtonsDisabled(true);
  try {
    const result = await window.aura.invokeService('runtime.gamelog-folder.pick');
    if (result.canceled) {
      setText('watcher-message', result.message || 'Folder selection cancelled.');
      return;
    }
    byId('gamelog-folder').value = result.gamelogFolder || result.status?.configuredPath || '';
    renderWatcherStatus(result.status);
    await setWatcherRunning(true);
  } catch (error) {
    setText('watcher-message', error.message);
  } finally {
    setSetupButtonsDisabled(false);
  }
}

function renderWatcherStatus(status) {
  const watcher = status?.watcher || {};
  state.watcherState = watcher.state || 'unavailable';
  setText('watcher-state', watcherLabel(watcher.state));
  setText('watcher-message', watcher.message || 'Log Watcher unavailable.');
  renderSetupToggle('watcher-toggle');
  renderWatcherIndicator(watcher);
  if (status?.configuredPath) {
    byId('gamelog-folder').value = status.configuredPath;
  }
}

function renderSetupToggle(id) {
  const toggle = byId(id);
  toggle.textContent = state.watcherState === 'watching' ? 'Stop' : 'Start';
  toggle.classList.toggle('is-on', state.watcherState === 'watching');
}

function currentGamelogFolder() {
  return byId('gamelog-folder').value.trim();
}

function setSetupButtonsDisabled(disabled) {
  byId('pick-gamelog-folder').disabled = disabled;
}

function renderWatcherIndicator(watcher = {}) {
  const state = watcher.state || 'unavailable';
  const label = watcherLabel(state);
  const indicator = byId('watcher-indicator');
  indicator.classList.toggle('is-watching', state === 'watching');
  indicator.classList.toggle('is-degraded', state === 'degraded');
  indicator.classList.toggle('is-blocked', state === 'blocked');
  indicator.title = `Log Watcher: ${label}${watcher.message ? ` - ${watcher.message}` : ''}`;
  indicator.setAttribute('aria-label', `Log Watcher ${label}`);
}

function renderRuntimeSettings(snapshot) {
  setText('settings-state', runtimeSettingsLabel(snapshot?.status));
  if (snapshot?.settings?.gamelogFolder) {
    byId('gamelog-folder').value = snapshot.settings.gamelogFolder;
  }
}

function renderLiveIoPolicy(snapshot) {
  const enabled = Boolean(snapshot?.passive?.enabled || snapshot?.threat?.enabled);
  state.liveIoEnabled = enabled;
  byId('integrated-viewport').classList.toggle('io-off', !enabled);
  setText('live-io-state', enabled ? 'On - network and clipboard enabled' : 'Off - network and clipboard blocked');
  setText('live-io-toggle', enabled ? 'Disable IO' : 'Enable IO');
  setText('top-live-io-toggle', enabled ? 'IO' : 'IO');
  byId('live-io-toggle').classList.toggle('is-on', enabled);
  byId('top-live-io-toggle').classList.toggle('is-on', enabled);
  byId('top-live-io-toggle').setAttribute('aria-pressed', String(enabled));
  byId('top-live-io-toggle').setAttribute('aria-label', enabled ? 'Disable IO authority' : 'Enable IO authority');
  byId('top-live-io-toggle').setAttribute('title', enabled ? 'IO authority on' : 'IO authority off');
  byId('clipboard-listen').classList.toggle('is-unsupported', !enabled);
  if (!enabled) {
    setThreatBackPageOpen(false);
  }
}

async function toggleLiveIoPolicy() {
  const buttons = [byId('live-io-toggle'), byId('top-live-io-toggle')];
  buttons.forEach((button) => {
    button.disabled = true;
  });
  try {
    const snapshot = await window.aura.invokeService('runtime.live-io.set-enabled', {
      lane: 'all',
      enabled: !state.liveIoEnabled,
      reason: 'Operator changed IO authority'
    });
    renderLiveIoPolicy(snapshot);
    if (window.auraThreatIntel?.getShortcutStatus) {
      renderShortcutStatus(await window.auraThreatIntel.getShortcutStatus());
    }
  } finally {
    buttons.forEach((button) => {
      button.disabled = false;
    });
  }
}

function renderDiagnostics(snapshot) {
  setText('diagnostics-state', snapshot?.count ? `${snapshot.count} noted` : 'Quiet');
}

function renderEventList(events, status) {
  const list = byId('event-list');
  list.replaceChildren();
  if (!events.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-event';
    empty.textContent = status === 'empty' ? 'No combat events observed yet.' : 'Event stream unavailable.';
    list.appendChild(empty);
    return;
  }
  for (const event of events) {
    const item = document.createElement('li');
    const label = document.createElement('span');
    const detail = document.createElement('strong');
    label.textContent = eventLabel(event);
    detail.textContent = eventDetail(event);
    item.append(label, detail);
    list.appendChild(item);
  }
}

function bootKeyboardGlow() {
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === '\\' && !event.repeat) {
      event.preventDefault();
      setThreatBackPageOpen(true);
      armClipboardAcquisition();
      return;
    }
    if (event.altKey && event.key === '\\') {
      event.preventDefault();
      toggleThreatTargetKind({ source: 'focused-shortcut' });
      return;
    }
    if (event.key === '\\' && !event.repeat) {
      setThreatBackPageOpen(true);
    }
    if (event.key === 'Control') {
      state.ctrlDown = true;
    }
    if (event.key === '\\') {
      state.slashDown = true;
    }
    updateKeyGlow();
  });
  document.addEventListener('keyup', (event) => {
    if (event.key === 'Control') {
      state.ctrlDown = false;
    }
    if (event.key === '\\') {
      state.slashDown = false;
    }
    updateKeyGlow();
  });
}

function setThreatBackPageOpen(open) {
  const drawer = byId('threat-drawer');
  state.threatGatewayActive = open === true;
  drawer.open = state.threatGatewayActive;
  drawer.classList.toggle('is-gateway-active', state.threatGatewayActive);
  byId('threat-gateway').classList.toggle('is-active', state.threatGatewayActive);
  byId('threat-gateway-summary').classList.toggle('is-active', state.threatGatewayActive);
  if (state.threatGatewayTimer) {
    clearTimeout(state.threatGatewayTimer);
    state.threatGatewayTimer = null;
  }
}

function updateKeyGlow() {
  const listening = byId('clipboard-listen').classList.contains('is-listening');
  const cooldown = byId('clipboard-listen').classList.contains('is-cooldown');
  byId('clipboard-key-ctrl').classList.toggle('is-active', state.ctrlDown || listening);
  byId('clipboard-key-slash').classList.toggle('is-active', state.slashDown || listening || state.threatGatewayActive);
  byId('clipboard-key-ctrl').classList.toggle('is-authority', listening);
  byId('clipboard-key-slash').classList.toggle('is-authority', listening);
  byId('clipboard-key-slash').classList.toggle('is-cooldown', cooldown);
}

function statusFromSnapshot(snapshot) {
  if (!snapshot) return 'unavailable';
  const watcherState = snapshot?.operational?.watcher?.state;
  if (watcherState === 'degraded') return 'degraded';
  if (watcherState === 'unavailable' || watcherState === 'blocked') return 'unavailable';
  return snapshot?.freshness?.status || 'empty';
}

function signalLabel(status) {
  if (status === 'recent') return 'Recent';
  if (status === 'witnessed') return 'Witnessed';
  if (status === 'degraded') return 'Degraded';
  if (status === 'stale') return 'Stale';
  if (status === 'empty') return 'Empty';
  return 'Unavailable';
}

function compactCombatTitle(status) {
  if (status === 'recent' || status === 'witnessed') return 'Activity';
  if (status === 'degraded') return 'Degraded';
  if (status === 'stale') return 'Stale';
  return 'Quiet';
}

function summaryForStatus(status) {
  if (status === 'recent' || status === 'witnessed') return 'Combat activity witnessed recently.';
  if (status === 'degraded') return 'Log Watcher is degraded.';
  if (status === 'stale') return 'Last witnessed activity is stale.';
  if (status === 'empty') return 'No combat activity witnessed yet.';
  return 'Combat Witness snapshot is unavailable.';
}

function watcherLabel(status) {
  if (status === 'watching') return 'Watching';
  if (status === 'degraded') return 'Degraded';
  if (status === 'blocked') return 'Blocked';
  if (status === 'stopped') return 'Stopped';
  return 'Unavailable';
}

function passiveStateLabel(status) {
  if (status === 'fresh') return 'Fresh context';
  if (status === 'partial') return 'Partial sample';
  if (status === 'stale') return 'Stale context';
  if (status === 'degraded') return 'Degraded';
  if (status === 'blocked') return 'Live IO blocked';
  if (status === 'pending') return 'Provider pending';
  return 'No observation';
}

function threatStateLabel(status) {
  if (status === 'succeeded') return 'Sampled';
  if (status === 'partial') return 'Partial';
  if (status === 'blocked') return 'Blocked';
  if (status === 'failed') return 'Degraded';
  if (status === 'ambiguous') return 'Ambiguous';
  if (status === 'unresolved' || status === 'unsupported' || status === 'empty') return 'Idle';
  return 'Pending';
}

function threatMessage(snapshot) {
  if (!snapshot) return 'Threat Intel bridge unavailable.';
  if (snapshot.status === 'blocked') return snapshot.message || 'Threat Intel live IO is blocked.';
  if (snapshot.status === 'succeeded' || snapshot.status === 'partial') {
    return snapshot.message || (snapshot.zkill
      ? `${formatNumber(snapshot.zkill.discoveredCount)} / ${lookbackLabel(snapshot.zkill.lookbackSeconds)}`
      : 'No count');
  }
  return snapshot.message || 'Copy a target, then press Ctrl+\\.';
}

function clipboardStateLabel(status) {
  if (status === 'listening') return 'Pulling';
  if (status === 'cooldown') return 'Cooldown';
  if (status === 'blocked') return 'IO Off';
  return 'Idle';
}

function runtimeSettingsLabel(status) {
  if (status === 'ready') return 'Ready';
  if (status === 'recovered') return 'Recovered';
  if (status === 'degraded') return 'Degraded';
  return 'Missing';
}

function passiveMessage(snapshot) {
  if (!snapshot) return 'Passive Telemetry bridge unavailable.';
  if (snapshot.status === 'fresh' || snapshot.status === 'partial') {
    if (snapshot.zkill?.capped) return 'Capped sample from scoped zKill context.';
    if (snapshot.status === 'partial') return 'Partial sample from provider context.';
    return 'Fresh context from scoped provider sample.';
  }
  if (snapshot.status === 'stale' && snapshot.zkill?.partial) return 'Partial sample is stale.';
  if (snapshot.status === 'stale') return 'Passive context is stale.';
  if (snapshot.status === 'blocked') return snapshot.message || 'Live IO blocked.';
  if (snapshot.status === 'degraded') return snapshot.failure?.message || snapshot.message || 'Passive Telemetry degraded.';
  return snapshot.message || 'Waiting for a future observed system change.';
}

function combatDetail(snapshot, status) {
  if (!snapshot) return 'No Combat Witness snapshot is available.';
  if (status === 'unavailable') return 'Log Watcher state is unavailable.';
  if (status === 'degraded') return 'Log Watcher state is degraded.';
  if (status === 'stale') return 'Last observed combat event is stale.';
  if (status === 'empty') return 'No bounded combat events have been observed.';
  return '15s rolling observed window: incoming DPS, repair HPS, and observed balance only.';
}

function passiveBasis(snapshot) {
  if (!snapshot) return 'No provider sample yet';
  if (snapshot.status === 'blocked') return 'Live IO blocked';
  if (!snapshot.currentSystem) return 'No provider sample yet';
  const zkill = snapshot.zkill ? `zKill ${formatNumber(snapshot.zkill.sampleCount)}` : null;
  const activity = snapshot.activity ? `ESI ${formatNumber(snapshot.activity.shipKills)} / ${formatNumber(snapshot.activity.jumps)}` : null;
  const lookup = snapshot.currentSystem?.resolverSource === 'local-static' ? 'Static lookup' : null;
  const basis = [zkill, activity, lookup].filter(Boolean).join(' + ');
  if (snapshot.zkill?.capped) return basis ? `${basis} - Capped sample` : 'Capped sample';
  if (snapshot.zkill?.partial || snapshot.activity?.partial || snapshot.status === 'partial') {
    return basis ? `${basis} - Partial sample` : 'Partial sample';
  }
  return basis || 'No provider sample yet';
}

function passiveReadoutFromSnapshot(snapshot) {
  if (!snapshot) {
    return {
      state: 'unavailable',
      label: 'No observation',
      basis: 'Passive Telemetry bridge unavailable.'
    };
  }
  const state = passiveReadoutState(snapshot);
  return {
    state,
    label: passiveStateLabel(state),
    basis: passiveBasis(snapshot)
  };
}

function passiveReadoutState(snapshot) {
  if (!snapshot?.currentSystem) return 'unavailable';
  if (snapshot.status === 'blocked') return 'blocked';
  if (snapshot.status === 'degraded') return 'degraded';
  if (snapshot.status === 'stale' || snapshot.freshness?.status === 'stale') return 'stale';
  if (snapshot.status === 'partial' || snapshot.zkill?.partial || snapshot.activity?.partial) {
    return snapshot.zkill?.capped ? 'capped' : 'partial';
  }
  if (snapshot.zkill?.capped) return 'capped';
  if (snapshot.activity?.cache?.state === 'hit' || snapshot.activity?.cache?.state === 'revalidated') return 'cached';
  if (snapshot.status === 'fresh') return 'fresh';
  if (snapshot.currentSystem && !snapshot.zkill && !snapshot.activity) return 'pending';
  return snapshot.status || 'unavailable';
}

function renderPassiveReadout(readout) {
  const stateClass = `is-${readout.state || 'unavailable'}`;
  const chip = byId('passive-readout-state');
  chip.className = `readout-state ${stateClass}`;
  chip.textContent = readout.label;
  setText('passive-readout-basis', readout.basis);
  byId('passive-readout-basis').setAttribute('title', readout.basis);
}

function passiveAgeLabel(snapshot) {
  const ageMs = Number(snapshot?.freshness?.cacheAgeMs);
  if (!Number.isFinite(ageMs)) return 'No age';
  return `${durationLabel(ageMs)} old`;
}

function passiveGapLabel(snapshot) {
  if (!snapshot?.currentSystem) return 'No observation';
  if (snapshot.status === 'blocked') return 'Live IO blocked';
  if (snapshot.status === 'degraded') return snapshot.failure?.message || snapshot.message || 'Degraded';
  if (snapshot.status === 'stale' && (snapshot.zkill?.partial || snapshot.activity?.partial)) return 'Partial sample is stale';
  if (snapshot.status === 'stale') return 'Stale context';
  if (snapshot.zkill?.capped) return 'Capped sample';
  if (snapshot.zkill?.partial || snapshot.activity?.partial || snapshot.status === 'partial') return 'Partial sample';
  if (!snapshot.zkill && !snapshot.activity) return 'No provider sample yet';
  return snapshot.currentSystem?.resolverSource === 'local-static' ? 'Static lookup' : 'None';
}

function threatBasis(snapshot) {
  if (!snapshot) return 'No scan';
  if (snapshot.status === 'blocked') return 'Live IO blocked';
  if (snapshot.zkill) {
    const provider = snapshot.zkill.provider || 'zKill';
    const lookback = lookbackLabel(snapshot.zkill.lookbackSeconds);
    if (snapshot.status === 'partial') return `${provider} ${lookback} partial`;
    if (snapshot.zkill.capped) return `${provider} ${lookback} capped`;
    return `${provider} ${lookback} sample`;
  }
  return snapshot.status === 'empty' ? 'No scan' : 'No provider';
}

function providerPulseFromPassive(snapshot) {
  if (!snapshot) {
    return {
      state: 'unavailable',
      label: 'No observation',
      detail: 'Passive Telemetry bridge unavailable'
    };
  }
  if (snapshot.status === 'blocked') {
    return {
      state: 'blocked',
      label: 'Live IO blocked',
      detail: snapshot.message || 'Live IO blocked'
    };
  }
  if (snapshot.status === 'degraded') {
    return {
      state: 'degraded',
      label: 'Degraded',
      detail: snapshot.failure?.message || snapshot.message || 'Passive provider degraded'
    };
  }
  if (snapshot.status === 'partial' || snapshot.zkill?.partial || snapshot.activity?.partial) {
    return {
      state: snapshot.zkill?.capped ? 'capped' : 'partial',
      label: snapshot.zkill?.capped ? 'Capped sample' : 'Partial sample',
      detail: passiveBasis(snapshot)
    };
  }
  if (snapshot.status === 'stale' || snapshot.freshness?.status === 'stale') {
    return {
      state: 'stale',
      label: 'Stale context',
      detail: snapshot.message || 'Passive provider context stale'
    };
  }
  const cacheState = snapshot.activity?.cache?.state;
  if (cacheState === 'hit' || cacheState === 'revalidated') {
    return {
      state: 'cached',
      label: 'Cached activity',
      detail: passiveBasis(snapshot)
    };
  }
  if (snapshot.status === 'fresh') {
    return {
      state: 'fresh',
      label: 'Fresh context',
      detail: passiveBasis(snapshot)
    };
  }
  if (snapshot.currentSystem && !snapshot.zkill && !snapshot.activity) {
    return {
      state: 'pending',
      label: 'Provider pending',
      detail: snapshot.message || 'Passive provider fetch pending'
    };
  }
  return {
    state: 'unavailable',
    label: 'No observation',
    detail: snapshot.message || 'No passive provider context'
  };
}

function providerPulseFromThreat(snapshot) {
  if (!snapshot || snapshot.status === 'empty') {
    return {
      state: 'empty',
      label: 'Threat --',
      detail: 'No Threat Intel scan'
    };
  }
  if (snapshot.status === 'pending') {
    return {
      state: 'pending',
      label: 'Threat pending',
      detail: snapshot.message || 'Threat provider scan pending'
    };
  }
  if (snapshot.status === 'blocked') {
    return {
      state: 'blocked',
      label: 'Threat blocked',
      detail: snapshot.message || 'Threat Intel live IO blocked'
    };
  }
  if (snapshot.status === 'failed') {
    return {
      state: 'failed',
      label: 'Threat failed',
      detail: snapshot.failure?.message || snapshot.message || 'Threat provider failed'
    };
  }
  if (snapshot.status === 'partial') {
    return {
      state: snapshot.zkill?.capped ? 'capped' : 'partial',
      label: snapshot.zkill?.capped ? 'Threat capped' : 'Threat partial',
      detail: threatBasis(snapshot)
    };
  }
  if (snapshot.status === 'succeeded') {
    return {
      state: snapshot.zkill?.capped ? 'capped' : 'succeeded',
      label: snapshot.zkill?.capped ? 'Threat capped' : 'Threat sampled',
      detail: threatBasis(snapshot)
    };
  }
  return {
    state: 'unavailable',
    label: 'Threat --',
    detail: snapshot.message || 'No threat provider context'
  };
}

function renderProviderPulse(lane, pulse) {
  const chip = byId(`${lane}-provider-pulse`);
  const detail = byId(`${lane}-pulse-detail`);
  const stateClass = `is-${pulse.state || 'unavailable'}`;
  chip.className = `provider-pulse ${stateClass}`;
  chip.textContent = pulse.label;
  chip.title = pulse.detail;
  detail.textContent = pulse.detail;
}

function passiveActivity(snapshot) {
  if (!snapshot?.activity) return '0 / 0';
  return `${formatNumber(snapshot.activity.shipKills)} / ${formatNumber(snapshot.activity.jumps)}`;
}

function threatSample(snapshot) {
  if (!snapshot?.zkill) return '0';
  return formatNumber(snapshot.zkill.discoveredCount);
}

function threatProviderLabel(snapshot, fallback) {
  if (!snapshot?.zkill) return fallback;
  return 'zKill';
}

function lookbackLabel(seconds) {
  const value = Number(seconds);
  if (value === 3600) return '1h';
  if (value > 0 && value % 3600 === 0) return `${value / 3600}h`;
  if (value > 0 && value % 60 === 0) return `${value / 60}m`;
  return `${value || 0}s`;
}

function durationLabel(ms) {
  const value = Number(ms);
  if (!Number.isFinite(value)) return 'unknown';
  const seconds = Math.max(0, Math.round(value / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.round(minutes / 60)}h`;
}

function eventLabel(event) {
  if (event.kind === 'combat.damage') return `${capitalize(event.direction)} damage`;
  if (event.kind === 'combat.repair') return `${capitalize(event.direction)} repair`;
  if (event.kind === 'combat.miss') return `${capitalize(event.direction)} miss`;
  return 'Combat event';
}

function eventDetail(event) {
  const actors = [event.sourceLabel, event.targetLabel].filter(Boolean).join(' -> ');
  const amount = event.amount == null ? '' : ` ${formatNumber(event.amount)}`;
  return `${actors || 'Observed'}${amount}`;
}

function observedCountLabel(item, fallback) {
  if (!item?.label) return fallback;
  return item.count ? `${item.label} (${formatNumber(item.count)})` : item.label;
}

function signedRate(value) {
  if (!Number.isFinite(value)) return '0 /s';
  const rounded = Math.round(value);
  return `${rounded > 0 ? '+' : ''}${rounded} /s`;
}

function formatRatio(kills, jumps) {
  if (!jumps && !kills) return '0.00';
  if (!jumps) return 'HIGH';
  return (kills / jumps).toFixed(2);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return '0';
  return String(Math.round(value));
}

function renderMeter(id, value, max) {
  const percent = Math.max(0, Math.min(100, (Number(value) || 0) / max * 100));
  byId(id).style.width = `${percent}%`;
}

function renderNetPressure(netPressure, incoming, repair) {
  const gauge = byId('net-pressure-gauge');
  const net = Number.isFinite(netPressure) ? netPressure : 0;
  const damageArc = Math.max(0, Math.min(112, (Number(incoming) || 0) / 1000 * 112));
  const repairArc = Math.max(0, Math.min(112, (Number(repair) || 0) / 1000 * 112));
  gauge.style.setProperty('--damage-arc', `${damageArc}deg`);
  gauge.style.setProperty('--repair-arc', `${repairArc}deg`);
  gauge.classList.toggle('is-danger', net < 0);
  gauge.classList.toggle('is-stable', net > 0);
  setText('net-pressure-label', 'Observed balance');
  setText('net-pressure-value', signedRate(net));
}

function toggleQuiet(id, quiet) {
  byId(id).classList.toggle('is-quiet', quiet);
}

function capitalize(value) {
  if (!value) return 'Observed';
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function setText(id, value) {
  byId(id).textContent = value == null ? '' : String(value);
}

function byId(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing renderer element: ${id}`);
  }
  return element;
}

boot().catch((error) => {
  setText('runtime-health', error.message);
  renderUnavailableCombatWitness();
});
