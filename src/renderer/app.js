const state = {
  frame: {
    alwaysOnTop: false
  },
  unsubscribeCombatWitness: null,
  unsubscribePassiveTelemetry: null,
  clipboardPoll: null,
  clipboardStatePoll: null
};

async function boot() {
  await bootFrame();
  await bootRuntimeHealth();
  await bootWatcherControls();
  await bootCombatWitness();
  await bootPassiveTelemetry();
  await bootThreatIntel();
}

async function bootRuntimeHealth() {
  const readiness = await window.aura.invokeService('seed.readiness');
  document.querySelector('#runtime-health').textContent = readiness.ok ? 'Runtime ready' : 'Runtime blocked';
}

async function bootCombatWitness() {
  if (!window.auraCombatWitness) {
    renderUnavailableCombatWitness();
    return;
  }

  const snapshot = await window.auraCombatWitness.getSnapshot();
  renderCombatWitness(snapshot);
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
  document.querySelector('#threat-search').addEventListener('submit', submitThreatSearch);
  document.querySelector('#clipboard-arm').addEventListener('click', armClipboardAcquisition);
  document.querySelector('#threat-target').addEventListener('focus', () => {
    renderThreatMessage('Ready for explicit scan submit.');
  });
  if (!window.auraThreatIntel) {
    renderThreatSnapshot(null);
    renderClipboardState(null);
    return;
  }
  renderThreatSnapshot(await window.auraThreatIntel.getSnapshot());
  renderClipboardState(await window.auraThreatIntel.getClipboardState());
  state.clipboardStatePoll = setInterval(refreshClipboardState, 1000);
}

async function bootWatcherControls() {
  document.querySelector('#watcher-controls').addEventListener('submit', startWatcher);
  document.querySelector('#stop-watcher').addEventListener('click', stopWatcher);
  const status = await window.aura.invokeService('combat.witness.status');
  renderWatcherStatus(status);
}

async function bootFrame() {
  if (!window.auraWindow) {
    return;
  }
  state.frame = await window.auraWindow.getState();
  renderFrameState();
  document.querySelector('#pin-window').addEventListener('click', toggleAlwaysOnTop);
  document.querySelector('#minimize-window').addEventListener('click', () => window.auraWindow.minimize());
  document.querySelector('#close-window').addEventListener('click', () => {
    state.unsubscribeCombatWitness?.();
    state.unsubscribePassiveTelemetry?.();
    if (state.clipboardPoll) {
      clearInterval(state.clipboardPoll);
    }
    if (state.clipboardStatePoll) {
      clearInterval(state.clipboardStatePoll);
    }
    window.auraWindow.close();
  });
}

async function toggleAlwaysOnTop() {
  const pin = document.querySelector('#pin-window');
  pin.disabled = true;
  try {
    state.frame = await window.auraWindow.setAlwaysOnTop(!state.frame.alwaysOnTop);
    renderFrameState();
  } finally {
    pin.disabled = false;
  }
}

function renderFrameState() {
  const pin = document.querySelector('#pin-window');
  pin.classList.toggle('active', state.frame.alwaysOnTop === true);
  pin.textContent = state.frame.alwaysOnTop ? 'Pinned' : 'Pin';
}

function renderCombatWitness(snapshot) {
  const watcher = snapshot?.operational?.watcher || {};
  const status = statusFromSnapshot(snapshot);
  const window5s = snapshot?.windows?.['5s'] || {};
  const window15s = snapshot?.windows?.['15s'] || {};
  const events = Array.isArray(snapshot?.eventStream) ? snapshot.eventStream.slice(0, 5) : [];

  document.querySelector('#combat-signal').textContent = signalLabel(status);
  document.querySelector('#combat-summary').textContent = summaryForStatus(status);
  document.querySelector('#watcher-state').textContent = watcherLabel(watcher.state);
  document.querySelector('#watcher-message').textContent = watcher.message || 'Combat Witness watcher unavailable.';
  document.querySelector('#incoming-5s').textContent = formatNumber(window5s.damage?.incoming?.total);
  document.querySelector('#repair-15s').textContent = formatNumber(window15s.repair?.incoming?.total);
  document.querySelector('#event-count').textContent = formatNumber(snapshot?.freshness?.eventStreamCount);
  renderEventList(events, status);
}

function renderUnavailableCombatWitness() {
  document.querySelector('#combat-signal').textContent = 'Unavailable';
  document.querySelector('#combat-summary').textContent = 'Combat Witness bridge unavailable.';
  document.querySelector('#watcher-state').textContent = 'Unavailable';
  document.querySelector('#watcher-message').textContent = 'Combat Witness watcher unavailable.';
  document.querySelector('#incoming-5s').textContent = '0';
  document.querySelector('#repair-15s').textContent = '0';
  document.querySelector('#event-count').textContent = '0';
  renderEventList([], 'unavailable');
}

function renderPassiveTelemetry(snapshot) {
  const status = snapshot?.status || 'unavailable';
  document.querySelector('#passive-state').textContent = passiveStateLabel(status);
  document.querySelector('#passive-system').textContent = snapshot?.currentSystem?.label || 'Unobserved';
  document.querySelector('#passive-sample').textContent = formatNumber(snapshot?.zkill?.sampleCount);
  document.querySelector('#passive-activity').textContent = passiveActivity(snapshot);
  document.querySelector('#passive-freshness').textContent = passiveStateLabel(snapshot?.freshness?.status || status);
  document.querySelector('#passive-message').textContent = passiveMessage(snapshot);
}

async function submitThreatSearch(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const targetText = document.querySelector('#threat-target').value;
    const snapshot = await window.auraThreatIntel.scan({
      targetText,
      inputSource: 'search'
    });
    renderThreatSnapshot(snapshot);
  } catch (error) {
    renderThreatSnapshot({ status: 'failed', message: error.message });
  } finally {
    button.disabled = false;
  }
}

async function armClipboardAcquisition() {
  const button = document.querySelector('#clipboard-arm');
  button.disabled = true;
  try {
    const snapshot = await window.auraThreatIntel.armClipboard();
    renderClipboardState(snapshot);
    scheduleClipboardPoll();
  } finally {
    button.disabled = false;
  }
}

function scheduleClipboardPoll() {
  if (state.clipboardPoll) {
    clearInterval(state.clipboardPoll);
  }
  state.clipboardPoll = setInterval(async () => {
    const snapshot = await window.auraThreatIntel.captureClipboard();
    renderClipboardState(snapshot);
    if (snapshot.lastCapture?.targetText) {
      document.querySelector('#threat-target').value = snapshot.lastCapture.targetText;
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
  renderClipboardState(await window.auraThreatIntel.getClipboardState());
}

function renderThreatSnapshot(snapshot) {
  const status = snapshot?.status || 'empty';
  document.querySelector('#threat-state').textContent = threatStateLabel(status);
  document.querySelector('#threat-target-label').textContent = snapshot?.target?.label || 'Unselected';
  document.querySelector('#threat-provider').textContent = snapshot?.zkill
    ? `${snapshot.zkill.provider} ${formatNumber(snapshot.zkill.lookbackSeconds)}s`
    : 'None';
  document.querySelector('#threat-sample').textContent = snapshot?.zkill
    ? `${formatNumber(snapshot.zkill.selectedCount)} / ${formatNumber(snapshot.zkill.discoveredCount)}`
    : '0 / 0';
  document.querySelector('#threat-message').textContent = threatMessage(snapshot);
}

function renderClipboardState(snapshot) {
  document.querySelector('#clipboard-state').textContent = clipboardStateLabel(snapshot?.state);
}

function renderThreatMessage(message) {
  document.querySelector('#threat-message').textContent = message;
}

async function startWatcher(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const startButton = form.querySelector('button[type="submit"]');
  startButton.disabled = true;
  try {
    const gamelogFolder = document.querySelector('#gamelog-folder').value;
    const status = await window.aura.invokeService('combat.witness.start', { gamelogFolder });
    renderWatcherStatus(status);
    renderCombatWitness(await window.auraCombatWitness.getSnapshot());
  } catch (error) {
    renderWatcherStatus({
      watcher: {
        state: 'degraded',
        message: error.message
      }
    });
  } finally {
    startButton.disabled = false;
  }
}

async function stopWatcher() {
  const button = document.querySelector('#stop-watcher');
  button.disabled = true;
  try {
    const status = await window.aura.invokeService('combat.witness.stop');
    renderWatcherStatus(status);
    renderCombatWitness(await window.auraCombatWitness.getSnapshot());
  } finally {
    button.disabled = false;
  }
}

function renderWatcherStatus(status = {}) {
  const watcher = status.watcher || {};
  document.querySelector('#watcher-state').textContent = watcherLabel(watcher.state);
  document.querySelector('#watcher-message').textContent = watcher.message || 'Combat Witness watcher unavailable.';
  if (watcher.path) {
    document.querySelector('#gamelog-folder').value = watcher.path;
  }
}

function statusFromSnapshot(snapshot = {}) {
  const watcherState = snapshot.operational?.watcher?.state || 'unavailable';
  if (watcherState === 'degraded') {
    return 'degraded';
  }
  if (watcherState !== 'watching') {
    return 'unavailable';
  }
  if ((snapshot.freshness?.eventStreamCount || 0) > 0 && snapshot.freshness?.status === 'recent') {
    return 'witnessed';
  }
  return snapshot.freshness?.status || 'empty';
}

function renderEventList(events, status) {
  const list = document.querySelector('#event-list');
  list.textContent = '';

  if (events.length === 0) {
    const item = document.createElement('li');
    item.className = 'empty-event';
    item.textContent = status === 'unavailable' ? 'Snapshot unavailable.' : 'No recent combat events witnessed.';
    list.appendChild(item);
    return;
  }

  for (const event of events) {
    const item = document.createElement('li');
    const label = document.createElement('strong');
    const detail = document.createElement('span');
    label.textContent = eventLabel(event);
    detail.textContent = eventDetail(event);
    item.append(label, detail);
    list.appendChild(item);
  }
}

function signalLabel(status) {
  if (status === 'recent') {
    return 'Recent';
  }
  if (status === 'witnessed') {
    return 'Witnessed';
  }
  if (status === 'degraded') {
    return 'Degraded';
  }
  if (status === 'stale') {
    return 'Stale';
  }
  if (status === 'empty') {
    return 'Empty';
  }
  return 'Unavailable';
}

function summaryForStatus(status) {
  if (status === 'recent') {
    return 'Combat activity witnessed recently.';
  }
  if (status === 'witnessed') {
    return 'Combat activity witnessed recently.';
  }
  if (status === 'degraded') {
    return 'Combat Witness watcher is degraded.';
  }
  if (status === 'stale') {
    return 'Last witnessed activity is stale.';
  }
  if (status === 'empty') {
    return 'No combat activity witnessed yet.';
  }
  return 'Combat Witness snapshot is unavailable.';
}

function watcherLabel(status) {
  if (status === 'watching') {
    return 'Watching';
  }
  if (status === 'degraded') {
    return 'Degraded';
  }
  if (status === 'blocked') {
    return 'Blocked';
  }
  return 'Unavailable';
}

function passiveStateLabel(status) {
  if (status === 'fresh') {
    return 'Fresh';
  }
  if (status === 'partial') {
    return 'Partial';
  }
  if (status === 'stale') {
    return 'Stale';
  }
  if (status === 'degraded') {
    return 'Degraded';
  }
  return 'Unavailable';
}

function threatStateLabel(status) {
  if (status === 'succeeded') {
    return 'Sampled';
  }
  if (status === 'partial') {
    return 'Partial';
  }
  if (status === 'blocked') {
    return 'Blocked';
  }
  if (status === 'failed') {
    return 'Degraded';
  }
  if (status === 'ambiguous') {
    return 'Ambiguous';
  }
  if (status === 'unresolved' || status === 'unsupported' || status === 'empty') {
    return 'Idle';
  }
  return 'Pending';
}

function threatMessage(snapshot) {
  if (!snapshot) {
    return 'Threat Intel bridge unavailable.';
  }
  if (snapshot.status === 'blocked') {
    return snapshot.message || 'Threat Intel live IO is blocked.';
  }
  if (snapshot.status === 'succeeded' || snapshot.status === 'partial') {
    return snapshot.zkill?.capped ? 'Scoped zKill sample is capped.' : 'Scoped zKill sample refreshed.';
  }
  return snapshot.message || 'Submit a target to run a scoped scan.';
}

function clipboardStateLabel(status) {
  if (status === 'listening') {
    return 'Listening';
  }
  if (status === 'cooldown') {
    return 'Cooldown';
  }
  return 'Idle';
}

function passiveMessage(snapshot) {
  if (!snapshot) {
    return 'Passive Telemetry bridge unavailable.';
  }
  if (snapshot.status === 'fresh' || snapshot.status === 'partial') {
    return snapshot.zkill?.capped ? 'Scoped zKill context is capped.' : 'Scoped zKill context refreshed.';
  }
  if (snapshot.status === 'stale' && snapshot.zkill?.partial) {
    return 'Partial passive context is stale.';
  }
  if (snapshot.status === 'blocked') {
    return snapshot.message || 'Passive live IO is blocked.';
  }
  return snapshot.message || 'Waiting for a future observed system change.';
}

function passiveActivity(snapshot) {
  if (!snapshot?.activity) {
    return '0 / 0';
  }
  return `${formatNumber(snapshot.activity.shipKills)} / ${formatNumber(snapshot.activity.jumps)}`;
}

function eventLabel(event) {
  if (event.kind === 'combat.damage') {
    return `${capitalize(event.direction)} damage`;
  }
  if (event.kind === 'combat.repair') {
    return `${capitalize(event.direction)} repair`;
  }
  if (event.kind === 'combat.miss') {
    return `${capitalize(event.direction)} miss`;
  }
  return 'Combat event';
}

function eventDetail(event) {
  const actors = [event.sourceLabel, event.targetLabel].filter(Boolean).join(' -> ');
  const amount = event.amount == null ? '' : ` ${formatNumber(event.amount)}`;
  return `${actors || 'Observed'}${amount}`;
}

function capitalize(value) {
  if (!value) {
    return 'Observed';
  }
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return '0';
  }
  return String(Math.round(value));
}

boot().catch((error) => {
  document.querySelector('#runtime-health').textContent = error.message;
  renderUnavailableCombatWitness();
});
