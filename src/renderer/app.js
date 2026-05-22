const state = {
  frame: {
    alwaysOnTop: false
  },
  unsubscribeCombatWitness: null
};

async function boot() {
  await bootFrame();
  await bootRuntimeHealth();
  await bootWatcherControls();
  await bootCombatWitness();
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
  return 'Unavailable';
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
