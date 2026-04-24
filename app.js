import {
  DEFAULT_CONFIG,
  MANAGEMENT_STRATEGIES,
  MODEL_VERSION,
  SCENARIOS,
  generateClassDataset,
  modelNotesMarkdown,
  recordsToCsv,
  simulateExperiment,
  summariseRecords
} from './simulation.js';

const state = {
  currentResult: null,
  lastConfig: null
};

const els = {};

function $(id) {
  return document.getElementById(id);
}

function cacheElements() {
  [
    'studentId',
    'scenarioId',
    'seed',
    'days',
    'daysValue',
    'initialAphids',
    'initialAphidsValue',
    'meanTemp',
    'meanTempValue',
    'tempAmplitude',
    'tempAmplitudeValue',
    'management',
    'runSimulation',
    'resetDefaults',
    'newSeed',
    'downloadCsv',
    'downloadJson',
    'downloadClassCsv',
    'downloadNotes',
    'scenarioTitle',
    'scenarioDescription',
    'scenarioHypothesis',
    'managementDescription',
    'summaryCards',
    'populationChart',
    'environmentChart',
    'processChart',
    'dataTableBody',
    'dataRowCount',
    'interpretation',
    'metadataText',
    'statusMessage'
  ].forEach((id) => {
    els[id] = $(id);
  });
}

function populateSelectors() {
  els.scenarioId.innerHTML = Object.values(SCENARIOS)
    .map((scenario) => `<option value="${scenario.id}">${scenario.label}</option>`)
    .join('');

  els.management.innerHTML = Object.values(MANAGEMENT_STRATEGIES)
    .map((strategy) => `<option value="${strategy.id}">${strategy.label}</option>`)
    .join('');
}

function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem('aphidsim_config') || 'null');
    if (saved && typeof saved === 'object') {
      return { ...DEFAULT_CONFIG, ...saved };
    }
  } catch (error) {
    console.warn('Could not read saved AphidSim configuration.', error);
  }
  return { ...DEFAULT_CONFIG };
}

function setControls(config) {
  const scenario = SCENARIOS[config.scenarioId] || SCENARIOS.baseline;
  els.studentId.value = config.studentId || DEFAULT_CONFIG.studentId;
  els.scenarioId.value = scenario.id;
  els.seed.value = config.seed || DEFAULT_CONFIG.seed;
  els.days.value = config.days || DEFAULT_CONFIG.days;
  els.initialAphids.value = config.initialAphids || DEFAULT_CONFIG.initialAphids;
  els.meanTemp.value = config.meanTemp ?? scenario.meanTemp;
  els.tempAmplitude.value = config.tempAmplitude ?? scenario.tempAmplitude;
  els.management.value = config.management || scenario.defaultManagement;
  updateControlLabels();
  updateScenarioPanel();
}

function readConfig() {
  return {
    studentId: els.studentId.value.trim() || DEFAULT_CONFIG.studentId,
    scenarioId: els.scenarioId.value,
    seed: Number(els.seed.value) || DEFAULT_CONFIG.seed,
    days: Number(els.days.value),
    initialAphids: Number(els.initialAphids.value),
    meanTemp: Number(els.meanTemp.value),
    tempAmplitude: Number(els.tempAmplitude.value),
    management: els.management.value
  };
}

function applyScenarioDefaults() {
  const scenario = SCENARIOS[els.scenarioId.value] || SCENARIOS.baseline;
  els.meanTemp.value = scenario.meanTemp;
  els.tempAmplitude.value = scenario.tempAmplitude;
  els.management.value = scenario.defaultManagement;
  updateControlLabels();
  updateScenarioPanel();
}

function updateControlLabels() {
  els.daysValue.textContent = `${els.days.value} days`;
  els.initialAphidsValue.textContent = `${els.initialAphids.value} aphids`;
  els.meanTempValue.textContent = `${Number(els.meanTemp.value).toFixed(1)} °C`;
  els.tempAmplitudeValue.textContent = `±${Number(els.tempAmplitude.value).toFixed(1)} °C`;
  const strategy = MANAGEMENT_STRATEGIES[els.management.value];
  els.managementDescription.textContent = strategy ? strategy.description : '';
}

function updateScenarioPanel() {
  const scenario = SCENARIOS[els.scenarioId.value] || SCENARIOS.baseline;
  els.scenarioTitle.textContent = scenario.label;
  els.scenarioDescription.textContent = scenario.description;
  els.scenarioHypothesis.textContent = scenario.hypothesis;
}

function runSimulation() {
  const config = readConfig();
  const result = simulateExperiment(config);
  state.currentResult = result;
  state.lastConfig = config;
  localStorage.setItem('aphidsim_config', JSON.stringify(config));
  render(result);
  setStatus(`Simulation updated: ${result.records.length} daily records generated with seed ${config.seed}.`);
}

function setStatus(message) {
  els.statusMessage.textContent = message;
}

function formatNumber(value, digits = 0) {
  if (!Number.isFinite(Number(value))) return '–';
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function render(result) {
  const { records, metadata } = result;
  const summary = summariseRecords(records);
  renderSummary(summary);
  renderInterpretation(summary, records, metadata.scenario);
  renderTable(records);
  renderMetadata(metadata, summary);
  drawPopulationChart(records);
  drawEnvironmentChart(records);
  drawProcessChart(records);
}

function renderSummary(summary) {
  const cards = [
    { label: 'Final observed total', value: formatNumber(summary.finalTotal), note: `λ = ${summary.finalLambda}` },
    { label: 'Peak modelled total', value: formatNumber(summary.peakTotal), note: `Day ${summary.peakDay}` },
    { label: 'Final plant health', value: `${formatNumber(summary.finalPlantHealth)}%`, note: summary.finalPlantHealth < 45 ? 'host-limited' : 'usable host' },
    { label: 'Mean temperature', value: `${formatNumber(summary.meanTemp, 1)} °C`, note: `${summary.rows} rows` },
    { label: 'Final alate fraction', value: `${formatNumber(summary.finalAlatePct, 1)}%`, note: 'winged adults' },
    { label: 'Daily mortalities', value: formatNumber(summary.cumulativeMortality), note: 'cumulative modelled' }
  ];

  els.summaryCards.innerHTML = cards
    .map(
      (card) => `
      <article class="metric-card">
        <span>${card.label}</span>
        <strong>${card.value}</strong>
        <small>${card.note}</small>
      </article>`
    )
    .join('');
}

function renderInterpretation(summary, records, scenario) {
  const final = records[records.length - 1];
  const maxAlateFraction = Math.max(...records.map((row) => Number(row.alate_fraction || 0)));
  const notes = [];

  if (summary.finalLambda >= 25) {
    notes.push('The colony shows strong exponential establishment before density and host quality begin to limit growth.');
  } else if (summary.finalLambda >= 8) {
    notes.push('The colony grows substantially, but the treatment suppresses the final population relative to the best-performing regimes.');
  } else {
    notes.push('The colony is strongly constrained; this treatment would be suitable for discussing stress or top-down regulation.');
  }

  if (summary.finalPlantHealth < 40) {
    notes.push('Host condition is low by the end of the run, so final aphid numbers should not be interpreted as a pure temperature response.');
  }

  if (Number(final.enemy_pressure) > 0.1) {
    notes.push('Natural enemy pressure is active, adding a top-down mortality term and a reproductive penalty.');
  }

  if (maxAlateFraction > 0.35) {
    notes.push('Alate production becomes high during the run; exported alate counts may be lower than production because alate emigration is included.');
  }

  els.interpretation.innerHTML = `
    <h3>Interpretation prompts</h3>
    <p><strong>${scenario.label}:</strong> ${scenario.hypothesis}</p>
    <ul>${notes.map((note) => `<li>${note}</li>`).join('')}</ul>
  `;
}

function renderMetadata(metadata, summary) {
  els.metadataText.innerHTML = `
    <dl>
      <div><dt>Experiment ID</dt><dd>${metadata.experimentId}</dd></div>
      <div><dt>Model version</dt><dd>${metadata.modelVersion}</dd></div>
      <div><dt>Seed</dt><dd>${metadata.config.seed}</dd></div>
      <div><dt>Scenario</dt><dd>${metadata.scenario.label}</dd></div>
      <div><dt>Management</dt><dd>${MANAGEMENT_STRATEGIES[metadata.config.management]?.label || metadata.config.management}</dd></div>
      <div><dt>Rows</dt><dd>${summary.rows}</dd></div>
    </dl>
  `;
}

function renderTable(records) {
  els.dataRowCount.textContent = `${records.length} rows`;
  els.dataTableBody.innerHTML = records
    .map(
      (row) => `
      <tr>
        <td>${row.day}</td>
        <td>${formatNumber(row.temperature_c, 1)}</td>
        <td>${formatNumber(row.plant_health_pct, 1)}</td>
        <td>${formatNumber(row.total_aphids_observed)}</td>
        <td>${formatNumber(row.nymphs_observed)}</td>
        <td>${formatNumber(row.apterous_adults_observed)}</td>
        <td>${formatNumber(row.alate_adults_observed)}</td>
        <td>${formatNumber(row.fecundity_per_adult, 2)}</td>
        <td>${formatNumber(row.mortality_count, 1)}</td>
        <td>${formatNumber(row.alate_fraction * 100, 1)}%</td>
        <td>${row.intervention || ''}</td>
        <td>${row.event_note || ''}</td>
      </tr>`
    )
    .join('');
}

function downloadText(filename, mimeType, text) {
  const blob = new Blob([text], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadCurrentCsv() {
  if (!state.currentResult) runSimulation();
  const { records, metadata } = state.currentResult;
  downloadText(`${metadata.experimentId}.csv`, 'text/csv', recordsToCsv(records));
}

function downloadCurrentJson() {
  if (!state.currentResult) runSimulation();
  const { metadata } = state.currentResult;
  downloadText(`${metadata.experimentId}.json`, 'application/json', JSON.stringify(state.currentResult, null, 2));
}

function downloadClassCsv() {
  const config = readConfig();
  const classData = generateClassDataset({ baseSeed: config.seed, replicates: 8, days: config.days });
  downloadText('aphidsim_class_dataset.csv', 'text/csv', recordsToCsv(classData.records));
}

function downloadNotes() {
  if (!state.currentResult) runSimulation();
  downloadText('aphidsim_model_notes.md', 'text/markdown', modelNotesMarkdown(state.currentResult));
}

function svgHeader(width, height, label) {
  return `<svg role="img" aria-label="${label}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">`;
}

function gridLines({ width, height, margin, yTicks, yScale, labelFormatter = (v) => v }) {
  const plotWidth = width - margin.left - margin.right;
  return yTicks
    .map((tick) => {
      const y = yScale(tick);
      return `<line class="grid-line" x1="${margin.left}" x2="${margin.left + plotWidth}" y1="${y}" y2="${y}" />
        <text class="axis-label" x="${margin.left - 10}" y="${y + 4}" text-anchor="end">${labelFormatter(tick)}</text>`;
    })
    .join('');
}

function xAxisLabels(records, xScale, height, margin) {
  const maxDay = records[records.length - 1]?.day || 1;
  const ticks = Array.from(new Set([0, 7, 14, 21, 28, maxDay].filter((day) => day <= maxDay))).sort((a, b) => a - b);
  return ticks
    .map((tick) => `<text class="axis-label" x="${xScale(tick)}" y="${height - margin.bottom + 22}" text-anchor="middle">${tick}</text>`)
    .join('');
}

function areaPath(records, upperAccessor, lowerAccessor, xScale, yScale) {
  const upper = records.map((row) => `${xScale(row.day)},${yScale(upperAccessor(row))}`).join(' L ');
  const lower = [...records]
    .reverse()
    .map((row) => `${xScale(row.day)},${yScale(lowerAccessor(row))}`)
    .join(' L ');
  return `M ${upper} L ${lower} Z`;
}

function linePath(records, valueAccessor, xScale, yScale) {
  return records
    .map((row, index) => `${index === 0 ? 'M' : 'L'} ${xScale(row.day)},${yScale(valueAccessor(row))}`)
    .join(' ');
}

function chartScales(records, width, height, margin, yMax) {
  const maxDay = Math.max(1, records[records.length - 1]?.day || 1);
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  return {
    xScale: (day) => margin.left + (day / maxDay) * plotWidth,
    yScale: (value) => height - margin.bottom - (value / yMax) * plotHeight
  };
}

function drawPopulationChart(records) {
  const width = 760;
  const height = 320;
  const margin = { top: 24, right: 28, bottom: 44, left: 58 };
  const yMax = Math.max(20, ...records.map((row) => row.total_aphids_modelled)) * 1.08;
  const { xScale, yScale } = chartScales(records, width, height, margin, yMax);
  const ticks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  const nymphUpper = (row) => row.nymphs_modelled;
  const adultUpper = (row) => row.nymphs_modelled + row.apterous_adults_modelled;
  const totalUpper = (row) => row.total_aphids_modelled;

  els.populationChart.innerHTML = `
    ${svgHeader(width, height, 'Stacked area chart showing aphid life stages')}
      ${gridLines({ width, height, margin, yTicks: ticks, yScale, labelFormatter: (v) => formatNumber(v) })}
      <path class="area area-nymph" d="${areaPath(records, nymphUpper, () => 0, xScale, yScale)}"></path>
      <path class="area area-apterous" d="${areaPath(records, adultUpper, nymphUpper, xScale, yScale)}"></path>
      <path class="area area-alate" d="${areaPath(records, totalUpper, adultUpper, xScale, yScale)}"></path>
      <line class="axis-line" x1="${margin.left}" x2="${width - margin.right}" y1="${height - margin.bottom}" y2="${height - margin.bottom}" />
      <line class="axis-line" x1="${margin.left}" x2="${margin.left}" y1="${margin.top}" y2="${height - margin.bottom}" />
      ${xAxisLabels(records, xScale, height, margin)}
      <text class="axis-title" x="${margin.left}" y="18">Modelled aphids</text>
      <text class="axis-title" x="${width - margin.right}" y="${height - 8}" text-anchor="end">Day</text>
    </svg>
    <div class="legend"><span class="legend-nymph"></span>Nymphs <span class="legend-apterous"></span>Apterous adults <span class="legend-alate"></span>Alate adults</div>
  `;
}

function drawEnvironmentChart(records) {
  const width = 760;
  const height = 320;
  const margin = { top: 24, right: 62, bottom: 44, left: 58 };
  const leftMax = 100;
  const tempMax = Math.max(35, Math.ceil(Math.max(...records.map((row) => row.temperature_c)) + 2));
  const maxDay = Math.max(1, records[records.length - 1]?.day || 1);
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const xScale = (day) => margin.left + (day / maxDay) * plotWidth;
  const leftY = (value) => height - margin.bottom - (value / leftMax) * plotHeight;
  const tempY = (value) => height - margin.bottom - (value / tempMax) * plotHeight;
  const yTicks = [0, 25, 50, 75, 100];
  const tempTicks = [0, Math.round(tempMax / 2), tempMax];

  els.environmentChart.innerHTML = `
    ${svgHeader(width, height, 'Line chart showing plant condition and temperature')}
      ${gridLines({ width, height, margin, yTicks, yScale: leftY, labelFormatter: (v) => `${v}%` })}
      <path class="line line-plant" d="${linePath(records, (row) => row.plant_health_pct, xScale, leftY)}"></path>
      <path class="line line-water" d="${linePath(records, (row) => row.hydration_pct, xScale, leftY)}"></path>
      <path class="line line-temp" d="${linePath(records, (row) => row.temperature_c, xScale, tempY)}"></path>
      <line class="axis-line" x1="${margin.left}" x2="${width - margin.right}" y1="${height - margin.bottom}" y2="${height - margin.bottom}" />
      <line class="axis-line" x1="${margin.left}" x2="${margin.left}" y1="${margin.top}" y2="${height - margin.bottom}" />
      <line class="axis-line" x1="${width - margin.right}" x2="${width - margin.right}" y1="${margin.top}" y2="${height - margin.bottom}" />
      ${xAxisLabels(records, xScale, height, margin)}
      ${tempTicks.map((tick) => `<text class="axis-label" x="${width - margin.right + 10}" y="${tempY(tick) + 4}">${tick}°C</text>`).join('')}
      <text class="axis-title" x="${margin.left}" y="18">Plant / water index</text>
      <text class="axis-title" x="${width - margin.right}" y="18" text-anchor="end">Temperature</text>
    </svg>
    <div class="legend"><span class="legend-plant"></span>Plant health <span class="legend-water"></span>Hydration <span class="legend-temp"></span>Temperature</div>
  `;
}

function drawProcessChart(records) {
  const width = 760;
  const height = 320;
  const margin = { top: 24, right: 40, bottom: 44, left: 58 };
  const yMax = Math.max(
    10,
    ...records.map((row) => Math.max(row.new_nymphs, row.mortality_count, row.alate_emigrants))
  ) * 1.08;
  const { xScale, yScale } = chartScales(records, width, height, margin, yMax);
  const ticks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  els.processChart.innerHTML = `
    ${svgHeader(width, height, 'Line chart showing daily reproduction, mortality, and alate emigration')}
      ${gridLines({ width, height, margin, yTicks: ticks, yScale, labelFormatter: (v) => formatNumber(v) })}
      <path class="line line-births" d="${linePath(records, (row) => row.new_nymphs, xScale, yScale)}"></path>
      <path class="line line-mortality" d="${linePath(records, (row) => row.mortality_count, xScale, yScale)}"></path>
      <path class="line line-emigration" d="${linePath(records, (row) => row.alate_emigrants, xScale, yScale)}"></path>
      <line class="axis-line" x1="${margin.left}" x2="${width - margin.right}" y1="${height - margin.bottom}" y2="${height - margin.bottom}" />
      <line class="axis-line" x1="${margin.left}" x2="${margin.left}" y1="${margin.top}" y2="${height - margin.bottom}" />
      ${xAxisLabels(records, xScale, height, margin)}
      <text class="axis-title" x="${margin.left}" y="18">Daily count</text>
      <text class="axis-title" x="${width - margin.right}" y="${height - 8}" text-anchor="end">Day</text>
    </svg>
    <div class="legend"><span class="legend-births"></span>New nymphs <span class="legend-mortality"></span>Mortalities <span class="legend-emigration"></span>Alate emigrants</div>
  `;
}

function attachListeners() {
  els.scenarioId.addEventListener('change', () => {
    applyScenarioDefaults();
    runSimulation();
  });

  ['days', 'initialAphids', 'meanTemp', 'tempAmplitude', 'management'].forEach((id) => {
    els[id].addEventListener('input', updateControlLabels);
    els[id].addEventListener('change', runSimulation);
  });

  ['studentId', 'seed'].forEach((id) => {
    els[id].addEventListener('change', runSimulation);
  });

  els.runSimulation.addEventListener('click', runSimulation);
  els.resetDefaults.addEventListener('click', () => {
    setControls(DEFAULT_CONFIG);
    runSimulation();
  });
  els.newSeed.addEventListener('click', () => {
    els.seed.value = Math.floor(1000 + Math.random() * 900000);
    runSimulation();
  });
  els.downloadCsv.addEventListener('click', downloadCurrentCsv);
  els.downloadJson.addEventListener('click', downloadCurrentJson);
  els.downloadClassCsv.addEventListener('click', downloadClassCsv);
  els.downloadNotes.addEventListener('click', downloadNotes);
}

function init() {
  cacheElements();
  populateSelectors();
  setControls(loadConfig());
  attachListeners();
  runSimulation();
  setStatus(`AphidSim ${MODEL_VERSION} ready. Data are generated locally in the browser.`);
}

init();
