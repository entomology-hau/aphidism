export const MODEL_VERSION = '2.1.0';

export const MODEL_PARAMETERS = Object.freeze({
  species: 'Myzus persicae teaching model',
  tMinC: 4,
  tOptC: 24,
  tMaxC: 33,
  baseMaturationRatePerDay: 0.115,
  maxDailyFecundity: 5.8,
  alateFecundityMultiplier: 0.25,
  baselineMortalityRate: 0.024,
  carryingCapacity: 1650,
  defaultDurationDays: 28,
  observationCountCv: 0.045
});

export const SCENARIOS = Object.freeze({
  baseline: {
    id: 'baseline',
    label: 'Baseline mesocosm',
    shortLabel: 'Baseline',
    description: 'A well-managed host plant under a fluctuating 20 °C incubator regime. This is the comparison treatment for the tutorial.',
    meanTemp: 20,
    tempAmplitude: 2.6,
    initialHydration: 78,
    initialNutrients: 82,
    initialRootHealth: 95,
    evaporationPenalty: 0,
    nutrientPenalty: 0,
    defaultManagement: 'standard',
    hypothesis: 'Population increase should be positive but constrained by host quality and density.'
  },
  warming: {
    id: 'warming',
    label: 'Warming pulse',
    shortLabel: 'Warming',
    description: 'A warmer treatment with a short heat pulse. It should accelerate reproduction early but create heat and plant-water stress later.',
    meanTemp: 23,
    tempAmplitude: 3.2,
    heatwaveStart: 12,
    heatwaveDuration: 6,
    heatwaveDelta: 4.8,
    initialHydration: 78,
    initialNutrients: 82,
    initialRootHealth: 95,
    evaporationPenalty: 0.8,
    nutrientPenalty: 0,
    defaultManagement: 'standard',
    hypothesis: 'Aphid numbers may rise rapidly before the heat pulse increases mortality and alate production.'
  },
  drought: {
    id: 'drought',
    label: 'Water-stressed host',
    shortLabel: 'Drought',
    description: 'Irrigation is restricted during the middle of the experiment, reducing host quality and aphid fecundity.',
    meanTemp: 22,
    tempAmplitude: 3.0,
    droughtStart: 7,
    droughtEnd: 18,
    initialHydration: 64,
    initialNutrients: 78,
    initialRootHealth: 93,
    evaporationPenalty: 2.3,
    nutrientPenalty: 0.4,
    defaultManagement: 'restricted',
    hypothesis: 'Water stress should lower host quality, increase mortality, and induce more alates.'
  },
  nutrient_stress: {
    id: 'nutrient_stress',
    label: 'Low-nitrogen host',
    shortLabel: 'Low N',
    description: 'The plant begins with poorer nutrient status and receives limited fertiliser. Aphid development and reproduction are host-limited.',
    meanTemp: 20,
    tempAmplitude: 2.8,
    initialHydration: 78,
    initialNutrients: 48,
    initialRootHealth: 95,
    evaporationPenalty: 0.2,
    nutrientPenalty: 1.7,
    defaultManagement: 'minimal',
    hypothesis: 'Population growth should be slower than the baseline despite similar temperatures.'
  },
  natural_enemy: {
    id: 'natural_enemy',
    label: 'Natural enemy incursion',
    shortLabel: 'Natural enemy',
    description: 'A parasitoid/predator pressure begins after establishment. This demonstrates top-down control and confounded population responses.',
    meanTemp: 21,
    tempAmplitude: 2.6,
    enemyStart: 9,
    enemyMaxPressure: 0.24,
    enemyRamp: 0.035,
    enemyLabel: 'Aphidius-like parasitoid pressure',
    initialHydration: 78,
    initialNutrients: 82,
    initialRootHealth: 95,
    evaporationPenalty: 0.1,
    nutrientPenalty: 0,
    defaultManagement: 'standard',
    hypothesis: 'Aphid population growth should flatten after the incursion even if host quality remains acceptable.'
  },
  student_design: {
    id: 'student_design',
    label: 'Student-designed regime',
    shortLabel: 'Design',
    description: 'Use the sliders to define a custom thermal regime while keeping the same deterministic simulation engine.',
    meanTemp: 21,
    tempAmplitude: 3,
    initialHydration: 78,
    initialNutrients: 78,
    initialRootHealth: 95,
    evaporationPenalty: 0.3,
    nutrientPenalty: 0.3,
    defaultManagement: 'standard',
    hypothesis: 'Use this treatment to make an explicit prediction before exporting the data.'
  }
});

export const MANAGEMENT_STRATEGIES = Object.freeze({
  standard: {
    id: 'standard',
    label: 'Standard husbandry',
    description: 'Water below 48% hydration and fertilise below 48% nutrients.'
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal inputs',
    description: 'Intervene only when plant condition becomes poor; useful for stress treatments.'
  },
  restricted: {
    id: 'restricted',
    label: 'Restricted irrigation',
    description: 'Allows a pronounced drought window before partial watering.'
  },
  intensive: {
    id: 'intensive',
    label: 'Intensive husbandry',
    description: 'Frequent small interventions that buffer plant stress without saturating the substrate.'
  }
});

export const DEFAULT_CONFIG = Object.freeze({
  studentId: 'Student_001',
  scenarioId: 'baseline',
  seed: 1843,
  days: MODEL_PARAMETERS.defaultDurationDays,
  initialAphids: 45,
  meanTemp: SCENARIOS.baseline.meanTemp,
  tempAmplitude: SCENARIOS.baseline.tempAmplitude,
  management: SCENARIOS.baseline.defaultManagement
});

export const CSV_COLUMNS = Object.freeze([
  'class_id',
  'replicate',
  'experiment_id',
  'student_id',
  'scenario',
  'scenario_label',
  'seed',
  'model_version',
  'day',
  'temperature_c',
  'thermal_performance',
  'degree_days',
  'cumulative_degree_days',
  'hydration_pct',
  'nutrient_pct',
  'root_health_pct',
  'plant_health_pct',
  'host_quality_index',
  'enemy_pressure',
  'nymphs_modelled',
  'apterous_adults_modelled',
  'alate_adults_modelled',
  'total_aphids_modelled',
  'nymphs_observed',
  'apterous_adults_observed',
  'alate_adults_observed',
  'total_aphids_observed',
  'fecundity_per_adult',
  'new_nymphs',
  'matured_nymphs',
  'alate_fraction',
  'mortality_rate',
  'mortality_count',
  'alate_emigrants',
  'lambda_from_day_0',
  'intervention',
  'event_note'
]);

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function round(value, digits = 2) {
  if (!Number.isFinite(value)) return value;
  const power = 10 ** digits;
  return Math.round(value * power) / power;
}

function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function seedHash() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a) {
  return function rng() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rngFromSeed(seed) {
  const seedFn = xmur3(String(seed));
  return mulberry32(seedFn());
}

function randomNormal(rng, mean = 0, sd = 1) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + sd * z;
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export function thermalPerformance(tempC) {
  const { tMinC, tOptC, tMaxC } = MODEL_PARAMETERS;
  if (tempC <= tMinC || tempC >= tMaxC) return 0;
  const rise = sigmoid(0.62 * (tempC - 10));
  const fall = 1 / (1 + Math.exp(0.92 * (tempC - 30)));
  const optRise = sigmoid(0.62 * (tOptC - 10));
  const optFall = 1 / (1 + Math.exp(0.92 * (tOptC - 30)));
  const normalised = (rise * fall) / (optRise * optFall);
  const boundaryPenalty = Math.sin(Math.PI * (tempC - tMinC) / (tMaxC - tMinC));
  return clamp(normalised * Math.pow(boundaryPenalty, 0.18), 0, 1.06);
}

export function plantHealthIndex(state) {
  return clamp(
    state.hydration * 0.33 + state.nutrients * 0.42 + state.rootHealth * 0.25,
    0,
    100
  );
}

export function hostQualityFromPlantHealth(plantHealthPct) {
  return clamp(Math.pow(plantHealthPct / 100, 1.45), 0.08, 1.05);
}

function normaliseConfig(userConfig = {}) {
  const scenario = SCENARIOS[userConfig.scenarioId] || SCENARIOS.baseline;
  const meanTemp = Number.isFinite(Number(userConfig.meanTemp))
    ? Number(userConfig.meanTemp)
    : scenario.meanTemp;
  const tempAmplitude = Number.isFinite(Number(userConfig.tempAmplitude))
    ? Number(userConfig.tempAmplitude)
    : scenario.tempAmplitude;

  return {
    studentId: String(userConfig.studentId || DEFAULT_CONFIG.studentId).trim() || DEFAULT_CONFIG.studentId,
    scenarioId: scenario.id,
    seed: Number.isFinite(Number(userConfig.seed)) ? Math.round(Number(userConfig.seed)) : DEFAULT_CONFIG.seed,
    days: clamp(Math.round(Number(userConfig.days) || MODEL_PARAMETERS.defaultDurationDays), 7, 42),
    initialAphids: clamp(Math.round(Number(userConfig.initialAphids) || DEFAULT_CONFIG.initialAphids), 10, 250),
    meanTemp: clamp(meanTemp, 8, 31),
    tempAmplitude: clamp(tempAmplitude, 0, 8),
    management: MANAGEMENT_STRATEGIES[userConfig.management]
      ? userConfig.management
      : scenario.defaultManagement,
    classId: userConfig.classId || '',
    replicate: userConfig.replicate || ''
  };
}

function experimentId(config) {
  const safeStudent = config.studentId.replace(/[^a-z0-9_-]+/gi, '_').slice(0, 40);
  return `${safeStudent}_${config.scenarioId}_${config.seed}`;
}

function dailyTemperature(day, scenario, config, rng) {
  const phaseA = Math.sin((day + 1.7) / 3.35);
  const phaseB = 0.38 * Math.sin((day + 4.2) / 1.9);
  let temp = config.meanTemp + config.tempAmplitude * phaseA + phaseB + randomNormal(rng, 0, 0.45);

  if (
    Number.isFinite(scenario.heatwaveStart) &&
    day >= scenario.heatwaveStart &&
    day < scenario.heatwaveStart + scenario.heatwaveDuration
  ) {
    const heatDay = day - scenario.heatwaveStart;
    const ramp = heatDay < 2 ? 0.7 + heatDay * 0.15 : 1;
    temp += scenario.heatwaveDelta * ramp;
  }

  return round(clamp(temp, 2, 38), 1);
}

function enemyPressureForDay(day, scenario, rng) {
  if (!Number.isFinite(scenario.enemyStart) || day < scenario.enemyStart) return 0;
  const ramped = Math.min(scenario.enemyMaxPressure, (day - scenario.enemyStart + 1) * scenario.enemyRamp);
  return round(clamp(ramped * (1 + randomNormal(rng, 0, 0.055)), 0, scenario.enemyMaxPressure), 3);
}

function isDroughtWindow(day, scenario) {
  return (
    Number.isFinite(scenario.droughtStart) &&
    Number.isFinite(scenario.droughtEnd) &&
    day >= scenario.droughtStart &&
    day <= scenario.droughtEnd
  );
}

function applyManagement(state, day, scenario, strategyId) {
  const actions = [];
  const droughtWindow = isDroughtWindow(day, scenario);

  if (strategyId === 'intensive') {
    if (state.hydration < 66) {
      const amount = state.hydration < 45 ? 30 : 18;
      state.hydration = clamp(state.hydration + amount, 0, 90);
      actions.push(`water +${amount}%`);
    }
    if (state.nutrients < 58) {
      state.nutrients = clamp(state.nutrients + 18, 0, 95);
      actions.push('fertiliser +18%');
    }
  } else if (strategyId === 'minimal') {
    if (state.hydration < 28) {
      state.hydration = clamp(state.hydration + 24, 0, 86);
      actions.push('rescue water +24%');
    }
    if (state.nutrients < 28) {
      state.nutrients = clamp(state.nutrients + 16, 0, 82);
      actions.push('rescue fertiliser +16%');
    }
  } else if (strategyId === 'restricted') {
    if (state.hydration < (droughtWindow ? 16 : 35)) {
      const amount = droughtWindow ? 14 : 25;
      state.hydration = clamp(state.hydration + amount, 0, droughtWindow ? 58 : 84);
      actions.push(droughtWindow ? 'restricted water +14%' : 'water +25%');
    }
    if (state.nutrients < 38 && day % 7 === 0) {
      state.nutrients = clamp(state.nutrients + 14, 0, 82);
      actions.push('low-dose fertiliser +14%');
    }
  } else {
    if (state.hydration < 48) {
      state.hydration = clamp(state.hydration + 32, 0, 88);
      actions.push('water +32%');
    }
    if (state.nutrients < 48 || day === 14) {
      state.nutrients = clamp(state.nutrients + 22, 0, 92);
      actions.push('fertiliser +22%');
    }
  }

  return actions.join('; ');
}

function buildEventNote(day, scenario, intervention, plantHealth, enemyPressure) {
  const notes = [];
  if (day === 0) notes.push('setup observation');
  if (Number.isFinite(scenario.heatwaveStart) && day === scenario.heatwaveStart) notes.push('heat pulse begins');
  if (
    Number.isFinite(scenario.heatwaveStart) &&
    day === scenario.heatwaveStart + scenario.heatwaveDuration
  ) {
    notes.push('heat pulse ends');
  }
  if (Number.isFinite(scenario.droughtStart) && day === scenario.droughtStart) notes.push('irrigation restriction begins');
  if (Number.isFinite(scenario.droughtEnd) && day === scenario.droughtEnd + 1) notes.push('irrigation restriction ends');
  if (Number.isFinite(scenario.enemyStart) && day === scenario.enemyStart) notes.push(scenario.enemyLabel || 'natural enemy detected');
  if (plantHealth < 35) notes.push('host plant visibly stressed');
  if (enemyPressure > 0.18) notes.push('high natural enemy pressure');
  if (intervention) notes.push(`intervention: ${intervention}`);
  return notes.join('; ');
}

function observeCount(value, rng, cv = MODEL_PARAMETERS.observationCountCv) {
  const noisy = value * (1 + randomNormal(rng, 0, cv)) + randomNormal(rng, 0, 1.4);
  return Math.max(0, Math.round(noisy));
}

function makeRecord(context) {
  const {
    config,
    scenario,
    state,
    day,
    temp,
    thermal,
    degreeDays,
    plantHealth,
    hostQuality,
    enemyPressure,
    fecundityPerAdult,
    newNymphs,
    maturedNymphs,
    alateFraction,
    mortalityRate,
    mortalityCount,
    alateEmigrants,
    intervention,
    eventNote,
    rng
  } = context;
  const observedNymphs = observeCount(state.nymphs, rng);
  const observedApterous = observeCount(state.apterousAdults, rng);
  const observedAlates = observeCount(state.alateAdults, rng);
  const total = state.nymphs + state.apterousAdults + state.alateAdults;
  const observedTotal = observedNymphs + observedApterous + observedAlates;

  return {
    class_id: config.classId || '',
    replicate: config.replicate || '',
    experiment_id: experimentId(config),
    student_id: config.studentId,
    scenario: scenario.id,
    scenario_label: scenario.label,
    seed: config.seed,
    model_version: MODEL_VERSION,
    day,
    temperature_c: round(temp, 1),
    thermal_performance: round(thermal, 3),
    degree_days: round(degreeDays, 2),
    cumulative_degree_days: round(state.cumulativeDegreeDays, 2),
    hydration_pct: round(state.hydration, 1),
    nutrient_pct: round(state.nutrients, 1),
    root_health_pct: round(state.rootHealth, 1),
    plant_health_pct: round(plantHealth, 1),
    host_quality_index: round(hostQuality, 3),
    enemy_pressure: round(enemyPressure, 3),
    nymphs_modelled: round(state.nymphs, 2),
    apterous_adults_modelled: round(state.apterousAdults, 2),
    alate_adults_modelled: round(state.alateAdults, 2),
    total_aphids_modelled: round(total, 2),
    nymphs_observed: observedNymphs,
    apterous_adults_observed: observedApterous,
    alate_adults_observed: observedAlates,
    total_aphids_observed: observedTotal,
    fecundity_per_adult: round(fecundityPerAdult, 3),
    new_nymphs: round(newNymphs, 2),
    matured_nymphs: round(maturedNymphs, 2),
    alate_fraction: round(alateFraction, 3),
    mortality_rate: round(mortalityRate, 4),
    mortality_count: round(mortalityCount, 2),
    alate_emigrants: round(alateEmigrants, 2),
    lambda_from_day_0: round(total / config.initialAphids, 3),
    intervention,
    event_note: eventNote
  };
}

export function simulateExperiment(userConfig = {}) {
  const config = normaliseConfig(userConfig);
  const scenario = SCENARIOS[config.scenarioId];
  const rng = rngFromSeed(`${config.seed}:${config.studentId}:${config.scenarioId}`);

  const state = {
    nymphs: config.initialAphids * 0.54,
    apterousAdults: config.initialAphids * 0.46,
    alateAdults: 0,
    hydration: scenario.initialHydration,
    nutrients: scenario.initialNutrients,
    rootHealth: scenario.initialRootHealth,
    cumulativeDegreeDays: 0,
    cumulativeFecundity: 0,
    cumulativeMortality: 0,
    cumulativeAlateEmigration: 0
  };

  const records = [];
  let temp = config.meanTemp;
  let thermal = thermalPerformance(temp);
  let plantHealth = plantHealthIndex(state);
  let hostQuality = hostQualityFromPlantHealth(plantHealth);

  records.push(
    makeRecord({
      config,
      scenario,
      state,
      day: 0,
      temp,
      thermal,
      degreeDays: 0,
      plantHealth,
      hostQuality,
      enemyPressure: 0,
      fecundityPerAdult: 0,
      newNymphs: 0,
      maturedNymphs: 0,
      alateFraction: 0,
      mortalityRate: 0,
      mortalityCount: 0,
      alateEmigrants: 0,
      intervention: '',
      eventNote: buildEventNote(0, scenario, '', plantHealth, 0),
      rng
    })
  );

  for (let day = 1; day <= config.days; day += 1) {
    const intervention = applyManagement(state, day, scenario, config.management);
    temp = dailyTemperature(day, scenario, config, rng);
    const degreeDays = Math.max(0, temp - MODEL_PARAMETERS.tMinC);
    state.cumulativeDegreeDays += degreeDays;

    plantHealth = plantHealthIndex(state);
    hostQuality = hostQualityFromPlantHealth(plantHealth);
    thermal = thermalPerformance(temp);
    const enemyPressure = enemyPressureForDay(day, scenario, rng);
    const totalBefore = state.nymphs + state.apterousAdults + state.alateAdults;
    const density = clamp(totalBefore / MODEL_PARAMETERS.carryingCapacity, 0, 2.5);
    const densityPenalty = clamp(1 - Math.pow(density, 1.18), 0.08, 1);
    const heatStress = temp > 28 ? Math.pow((temp - 28) / 6, 2) * 0.12 : 0;
    const coldStress = temp < 9 ? Math.pow((9 - temp) / 7, 2) * 0.09 : 0;
    const plantStress = (1 - hostQuality) * 0.07;
    const densityStress = Math.pow(density, 1.7) * 0.045;
    const mortalityRate = clamp(
      MODEL_PARAMETERS.baselineMortalityRate + heatStress + coldStress + plantStress + densityStress + enemyPressure * 0.28,
      0.006,
      0.88
    );

    const fecundityNoise = Math.exp(randomNormal(rng, -0.5 * 0.12 ** 2, 0.12));
    const fecundityPerAdult = clamp(
      MODEL_PARAMETERS.maxDailyFecundity * thermal * hostQuality * densityPenalty * (1 - enemyPressure * 0.55) * fecundityNoise,
      0,
      MODEL_PARAMETERS.maxDailyFecundity * 1.1
    );

    const effectiveAdults = state.apterousAdults + state.alateAdults * MODEL_PARAMETERS.alateFecundityMultiplier;
    const newNymphs = Math.max(0, effectiveAdults * fecundityPerAdult);
    const maturationRate = clamp(
      MODEL_PARAMETERS.baseMaturationRatePerDay * thermal * hostQuality * (1 - density * 0.08),
      0,
      0.22
    );
    const maturedNymphs = Math.min(state.nymphs, state.nymphs * maturationRate);
    const alateFraction = clamp(
      0.015 + sigmoid((density - 0.35) * 6) * 0.28 + (1 - hostQuality) * 0.22 + enemyPressure * 0.18,
      0.015,
      0.72
    );

    const nymphMortality = Math.min(state.nymphs, state.nymphs * clamp(mortalityRate * 1.08, 0, 0.95));
    const apterousMortality = Math.min(state.apterousAdults, state.apterousAdults * clamp(mortalityRate * 0.86, 0, 0.95));
    const alateMortality = Math.min(state.alateAdults, state.alateAdults * clamp(mortalityRate * 1.05, 0, 0.95));
    const alateEmigrants = Math.min(state.alateAdults, state.alateAdults * clamp(0.05 + alateFraction * 0.20, 0.02, 0.25));
    const mortalityCount = nymphMortality + apterousMortality + alateMortality;

    state.nymphs = Math.max(0, state.nymphs + newNymphs - maturedNymphs - nymphMortality);
    state.apterousAdults = Math.max(0, state.apterousAdults + maturedNymphs * (1 - alateFraction) - apterousMortality);
    state.alateAdults = Math.max(0, state.alateAdults + maturedNymphs * alateFraction - alateMortality - alateEmigrants);
    state.cumulativeFecundity += newNymphs;
    state.cumulativeMortality += mortalityCount;
    state.cumulativeAlateEmigration += alateEmigrants;

    const totalAfter = state.nymphs + state.apterousAdults + state.alateAdults;
    const droughtPenalty = isDroughtWindow(day, scenario) ? 2.6 : 0;
    const aphidWaterUse = Math.min(8, (totalAfter / 520) * 1.8);
    const aphidNutrientUse = Math.min(7, (totalAfter / 520) * 1.45);
    state.hydration = clamp(
      state.hydration - (4.9 + Math.max(0, temp - 18) * 0.33 + aphidWaterUse + scenario.evaporationPenalty + droughtPenalty),
      0,
      100
    );
    state.nutrients = clamp(
      state.nutrients - (1.9 + aphidNutrientUse + scenario.nutrientPenalty),
      0,
      100
    );

    if (state.hydration > 92) {
      state.rootHealth = clamp(state.rootHealth - 4.8, 0, 100);
    } else if (state.hydration < 22) {
      state.rootHealth = clamp(state.rootHealth - 2.4, 0, 100);
    } else if (state.hydration >= 45 && state.hydration <= 82) {
      state.rootHealth = clamp(state.rootHealth + 0.9, 0, 100);
    } else {
      state.rootHealth = clamp(state.rootHealth - 0.25, 0, 100);
    }

    plantHealth = plantHealthIndex(state);
    hostQuality = hostQualityFromPlantHealth(plantHealth);
    const eventNote = buildEventNote(day, scenario, intervention, plantHealth, enemyPressure);

    records.push(
      makeRecord({
        config,
        scenario,
        state,
        day,
        temp,
        thermal,
        degreeDays,
        plantHealth,
        hostQuality,
        enemyPressure,
        fecundityPerAdult,
        newNymphs,
        maturedNymphs,
        alateFraction,
        mortalityRate,
        mortalityCount,
        alateEmigrants,
        intervention,
        eventNote,
        rng
      })
    );
  }

  return {
    metadata: {
      app: 'AphidSim teaching edition',
      modelVersion: MODEL_VERSION,
      createdAt: new Date().toISOString(),
      note: 'Synthetic data for teaching. The model is mechanistic and deterministic for a given seed, but it is not a fitted forecast for any particular aphid clone, host cultivar, or controlled-environment facility.',
      species: MODEL_PARAMETERS.species,
      experimentId: experimentId(config),
      config,
      scenario: {
        id: scenario.id,
        label: scenario.label,
        description: scenario.description,
        hypothesis: scenario.hypothesis
      },
      parameters: MODEL_PARAMETERS
    },
    records
  };
}

export function summariseRecords(records) {
  if (!records || records.length === 0) {
    return {
      rows: 0,
      finalTotal: 0,
      peakTotal: 0,
      peakDay: 0,
      finalLambda: 0,
      meanTemp: 0,
      finalPlantHealth: 0,
      finalAlatePct: 0,
      cumulativeMortality: 0
    };
  }
  const first = records[0];
  const final = records[records.length - 1];
  const peak = records.reduce((best, row) =>
    row.total_aphids_modelled > best.total_aphids_modelled ? row : best
  , records[0]);
  const cumulativeMortality = records.reduce((sum, row) => sum + Number(row.mortality_count || 0), 0);
  const meanTemp = records.reduce((sum, row) => sum + Number(row.temperature_c || 0), 0) / records.length;
  const finalObservedTotal = Number(final.total_aphids_observed || 0);
  const initialObservedTotal = Math.max(1, Number(first.total_aphids_observed || first.total_aphids_modelled || 1));
  const finalModelledTotal = Number(final.total_aphids_modelled || 0);
  const finalAlates = Number(final.alate_adults_modelled || 0);

  return {
    rows: records.length,
    finalTotal: round(finalObservedTotal, 0),
    finalModelledTotal: round(finalModelledTotal, 0),
    peakTotal: round(peak.total_aphids_modelled, 0),
    peakDay: peak.day,
    finalLambda: round(finalObservedTotal / initialObservedTotal, 2),
    meanTemp: round(meanTemp, 1),
    finalPlantHealth: round(final.plant_health_pct, 0),
    finalAlatePct: round(finalModelledTotal > 0 ? (finalAlates / finalModelledTotal) * 100 : 0, 1),
    cumulativeMortality: round(cumulativeMortality, 0)
  };
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (/[",\n\r]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

export function recordsToCsv(records) {
  const extraColumns = records.reduce((cols, row) => {
    Object.keys(row).forEach((key) => {
      if (!CSV_COLUMNS.includes(key) && !cols.includes(key)) cols.push(key);
    });
    return cols;
  }, []);
  const columns = [...CSV_COLUMNS, ...extraColumns];
  const body = records.map((row) => columns.map((column) => csvEscape(row[column])).join(','));
  return [columns.join(','), ...body].join('\n');
}

export function generateClassDataset(options = {}) {
  const baseSeed = Number.isFinite(Number(options.baseSeed)) ? Number(options.baseSeed) : 2604;
  const replicates = clamp(Math.round(Number(options.replicates) || 8), 2, 20);
  const days = clamp(Math.round(Number(options.days) || 28), 7, 42);
  const scenarioIds = options.scenarioIds || ['baseline', 'warming', 'drought', 'nutrient_stress', 'natural_enemy'];
  const classId = options.classId || 'aphidsim_tutorial';
  const records = [];

  scenarioIds.forEach((scenarioId, scenarioIndex) => {
    for (let rep = 1; rep <= replicates; rep += 1) {
      const seed = baseSeed + scenarioIndex * 1009 + rep * 83;
      const rng = rngFromSeed(`class:${seed}:${scenarioId}`);
      const scenario = SCENARIOS[scenarioId];
      const initialAphids = Math.round(32 + rng() * 35);
      const meanTemp = round(scenario.meanTemp + randomNormal(rng, 0, 0.7), 1);
      const tempAmplitude = round(Math.max(0.8, scenario.tempAmplitude + randomNormal(rng, 0, 0.35)), 1);
      const result = simulateExperiment({
        studentId: `${scenario.shortLabel.replace(/\s+/g, '')}_${String(rep).padStart(2, '0')}`,
        scenarioId,
        seed,
        days,
        initialAphids,
        meanTemp,
        tempAmplitude,
        management: scenario.defaultManagement,
        classId,
        replicate: rep
      });
      records.push(...result.records);
    }
  });

  return {
    metadata: {
      app: 'AphidSim teaching edition',
      modelVersion: MODEL_VERSION,
      createdAt: new Date().toISOString(),
      classId,
      baseSeed,
      replicatesPerScenario: replicates,
      days,
      scenarios: scenarioIds.map((id) => ({
        id,
        label: SCENARIOS[id].label,
        hypothesis: SCENARIOS[id].hypothesis
      })),
      note: 'Synthetic class dataset generated by the same deterministic engine as the browser app.'
    },
    records
  };
}

export function modelNotesMarkdown(result = null) {
  const active = result?.metadata;
  const scenarioLine = active
    ? `\nActive export: ${active.experimentId} (${active.scenario.label}), seed ${active.config.seed}.\n`
    : '';

  return `# AphidSim teaching edition: model notes\n\n${scenarioLine}\nThis app creates synthetic daily observations for an aphid mesocosm tutorial. It is intended for teaching experimental design, data visualisation, and statistical analysis. It should not be used as a fitted biological forecast.\n\n## Core structure\n\nThe simulated population has three classes: nymphs, apterous adults, and alate adults. Each simulated day updates temperature, host-plant condition, fecundity, maturation, mortality, and alate emigration. Exported counts include observation error to make the dataset more realistic for analysis exercises.\n\n## Main variables\n\n- Temperature performance is scaled from 0 to approximately 1 using lower, optimum, and upper thresholds of ${MODEL_PARAMETERS.tMinC}, ${MODEL_PARAMETERS.tOptC}, and ${MODEL_PARAMETERS.tMaxC} °C.\n- Host quality is a non-linear function of plant hydration, nutrient status, and root health.\n- Fecundity per adult is reduced by poor host quality, high density, extreme temperature, and natural enemy pressure.\n- Maturation of nymphs depends on temperature performance and host quality.\n- Alate production increases under crowding, declining host quality, and natural enemy pressure.\n- Mortality increases under thermal stress, poor host quality, density stress, and natural enemy pressure.\n\n## Suggested student tasks\n\n1. Plot total observed aphids through time by scenario.\n2. Compare final population size, peak population size, and alate fraction among scenarios.\n3. Fit a simple model such as log(total aphids + 1) ~ day * scenario and interpret the interaction.\n4. Discuss which variables are responses, which are treatments, and which may be mediators or confounders.\n5. Compare the observed counts with the modelled counts to discuss measurement error.\n\n## CSV variables\n\nThe CSV includes modelled and observed counts. For most tutorial analyses, use the observed count columns first, then use modelled counts to discuss process versus observation.\n`;
}
