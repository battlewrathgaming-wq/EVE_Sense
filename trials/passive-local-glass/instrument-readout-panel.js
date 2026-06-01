(function () {
  const fallbackData = {
    meta: {
      boundary:
        'Sense-generated Passive trial fallback. This is fixture/static input only and is not a bridge or runtime contract.'
    },
    readouts: [
      {
        id: 'sense-fallback',
        label: 'Passive Telemetry',
        state: { id: 'fresh', label: 'Fresh context', marker: 'SENSE' },
        primaryValue: 'Jita',
        ageLabel: '0s old',
        basis: 'zKill + ESI + Static lookup',
        availability: { status: 'fresh', reason: 'Passive system context refreshed.' },
        coverage: {
          summary: 'Sense trial fields: readout, availability, warnings, gaps, and detail.',
          knownFields: ['readout', 'availability', 'warnings', 'gaps', 'detail', 'sourceAdapter']
        },
        gaps: [],
        warnings: [],
        sourceOwned: {
          owner: 'AURA-Sense Passive Telemetry',
          layer: 'Sense-local static trial input',
          terms: ['Fresh context', 'Passive Telemetry'],
          visibleLabel: 'Fresh context',
          qualification: 'Sense owns this fallback state label and fixture meaning.'
        },
        detail: {
          summary: 'Sense-local fallback used only if the generated JSON cannot be read.',
          rows: [
            { label: 'Boundary', value: 'Fixture/static Sense trial input only.' },
            { label: 'Mapper chain', value: 'Passive fixture snapshot -> mapPassiveTelemetryAdapter -> mapPassiveStaticHeadTrial.' }
          ]
        }
      }
    ]
  };

  const stateToneClass = {
    fresh: 'state-current',
    stale: 'state-aged',
    partial: 'state-source-owned-limited',
    capped: 'state-partial',
    blocked: 'state-source-owned-unavailable',
    degraded: 'state-source-owned-limited',
    unavailable: 'state-source-owned-absence'
  };

  const root = document.getElementById('readout-root');
  const select = document.getElementById('readout-select');
  const selectedReadoutId = document.body.dataset.readoutId || null;
  let readouts = fallbackData.readouts;

  init();

  async function init() {
    try {
      const response = await fetch('./sense-trial-readouts.json', { cache: 'no-store' });
      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json.readouts) && json.readouts.length > 0) {
          readouts = json.readouts;
        }
      }
    } catch (error) {
      // Plain file opening may block JSON fetches; fallback data keeps the reference inspectable.
    }

    if (select) {
      fillSelector();
      select.addEventListener('change', () => {
        const next = readouts.find((readout) => readout.id === select.value) || readouts[0];
        render(next);
      });
    }

    const selected = readouts.find((readout) => readout.id === selectedReadoutId) || readouts[0];
    if (select) select.value = selected.id;
    render(selected);
  }

  function fillSelector() {
    select.replaceChildren(
      ...readouts.map((readout) => {
        const option = document.createElement('option');
        option.value = readout.id;
        option.textContent = `${readout.state.label} - ${readout.label}`;
        return option;
      })
    );
  }

  function render(readout) {
    const panel = el('article', `readout-panel ${stateToneClass[readout.state.id] || ''}`);
    panel.setAttribute('aria-labelledby', 'readout-title');

    const top = el('div', 'readout-top');
    const labelWrap = el('div', 'readout-label');
    labelWrap.append(
      withText(el('h2'), readout.label, { id: 'readout-title' }),
      withText(el('p', 'readout-basis'), readout.basis)
    );

    const chip = el('div', 'state-chip');
    chip.append(withText(el('span', 'state-mark'), readout.state.marker), withText(el('span'), readout.state.label));
    top.append(labelWrap, chip);

    const body = el('div', 'readout-body');
    const primaryStack = el('div', 'primary-stack');
    primaryStack.append(
      withText(
        el('p', `primary-value ${readout.primaryValue ? '' : 'absent'}`),
        readout.primaryValue || readout.absenceLabel || readout.state.label
      )
    );
    if (readout.sourceOwned) {
      primaryStack.append(
        withText(
          el('p', 'source-owned-inline'),
          `Source-owned placeholder - ${readout.sourceOwned.owner}; ${readout.sourceOwned.layer}`
        )
      );
    }

    const meta = el('div', 'meta-grid');
    meta.append(row('Age', readout.ageLabel, 'meta'), row('Basis', readout.basis, 'meta'));
    if (!readout.displayPolicy || !readout.displayPolicy.coverageInDetailOnly) {
      meta.append(row('Coverage', readout.coverage.summary, 'meta'));
    }
    if (readout.fallbackBasis) {
      meta.append(row('Fallback', readout.fallbackBasis, 'meta'));
    }
    body.append(primaryStack, meta);

    const availability = withText(
      el('p', 'availability-line'),
      `${readout.availability.reason} (${readout.availability.status})`
    );

    const edge = el('div', 'edge-row');
    edge.append(
      withText(el('span', 'edge-pill gap'), `Gaps ${readout.gaps.length}`),
      withText(el('span', 'edge-pill warning'), `Warnings ${readout.warnings.length}`)
    );

    const detailWrap = el('div', 'detail-wrap');
    const detailId = `detail-${readout.id}`;
    const toggle = withText(el('button', 'detail-toggle'), 'Readout Detail');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', detailId);

    const detail = el('div', 'detail-body');
    detail.id = detailId;
    detail.hidden = true;
    detail.append(withText(el('p', 'detail-summary'), readout.detail.summary));
    detail.append(...detailRows(readout));

    if (readout.sourceOwned) {
      const sourceNote = el('div', 'source-note');
      sourceNote.append(
        withText(el('strong'), 'Source-owned placeholder qualification'),
        textNode(`${readout.sourceOwned.owner}; ${readout.sourceOwned.layer}. ${readout.sourceOwned.qualification}`)
      );
      detail.append(sourceNote);
    }

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      detail.hidden = isOpen;
    });

    detailWrap.append(toggle, detail);
    panel.append(top, body, availability, edge, detailWrap);
    root.replaceChildren(panel);
  }

  function detailRows(readout) {
    const rows = [
      row('Availability', readout.availability.reason, 'detail'),
      row('Freshness', readout.ageLabel, 'detail'),
      row('Coverage', readout.coverage.summary, 'detail'),
      row('Known fields', readout.coverage.knownFields.length ? readout.coverage.knownFields.join(', ') : 'None shown', 'detail')
    ];

    for (const gap of readout.gaps) rows.push(row('Gap', gap, 'detail'));
    for (const warning of readout.warnings) rows.push(row('Warning', warning, 'detail'));
    for (const item of readout.detail.rows) rows.push(row(item.label, item.value, 'detail'));

    return rows;
  }

  function row(label, value, kind) {
    const node = el('div', `${kind}-row`);
    node.append(withText(el('div', `${kind}-label`), label), withText(el('div', `${kind}-value`), value));
    return node;
  }

  function el(tag, className) {
    const node = document.createElement(tag);
    if (className) node.className = className.trim();
    return node;
  }

  function withText(node, value, attributes) {
    if (attributes) {
      for (const [key, attrValue] of Object.entries(attributes)) {
        node.setAttribute(key, attrValue);
      }
    }
    node.textContent = value;
    return node;
  }

  function textNode(value) {
    return document.createTextNode(value);
  }
})();
