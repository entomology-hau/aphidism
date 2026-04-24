# AphidSim teaching edition: model notes


Active export: Example_Group_baseline_1843 (Baseline mesocosm), seed 1843.

This app creates synthetic daily observations for an aphid mesocosm tutorial. It is intended for teaching experimental design, data visualisation, and statistical analysis. It should not be used as a fitted biological forecast.

## Core structure

The simulated population has three classes: nymphs, apterous adults, and alate adults. Each simulated day updates temperature, host-plant condition, fecundity, maturation, mortality, and alate emigration. Exported counts include observation error to make the dataset more realistic for analysis exercises.

## Main variables

- Temperature performance is scaled from 0 to approximately 1 using lower, optimum, and upper thresholds of 4, 24, and 33 °C.
- Host quality is a non-linear function of plant hydration, nutrient status, and root health.
- Fecundity per adult is reduced by poor host quality, high density, extreme temperature, and natural enemy pressure.
- Maturation of nymphs depends on temperature performance and host quality.
- Alate production increases under crowding, declining host quality, and natural enemy pressure.
- Mortality increases under thermal stress, poor host quality, density stress, and natural enemy pressure.

## Suggested student tasks

1. Plot total observed aphids through time by scenario.
2. Compare final population size, peak population size, and alate fraction among scenarios.
3. Fit a simple model such as log(total aphids + 1) ~ day * scenario and interpret the interaction.
4. Discuss which variables are responses, which are treatments, and which may be mediators or confounders.
5. Compare the observed counts with the modelled counts to discuss measurement error.

## CSV variables

The CSV includes modelled and observed counts. For most tutorial analyses, use the observed count columns first, then use modelled counts to discuss process versus observation.
