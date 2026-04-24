# AphidSim teaching edition

AphidSim is a static, GitHub Pages-ready teaching app for a student practical on aphid population dynamics under changing environmental conditions. It generates reproducible synthetic datasets for analysis in R, Python, Excel, or similar tools.

The app is designed for undergraduate or MSc practical classes where students need to connect invertebrate biology, host-plant quality, climate stress, natural enemies, and data analysis.

## What this version improves

- Replaces the previous build-dependent prototype with a static site that can be served directly from GitHub Pages.
- Removes runtime dependencies on React, Vite, Tailwind, Font Awesome, and third-party chart libraries.
- Adds a deterministic simulation engine with seed-controlled stochastic observation error.
- Adds biologically interpretable scenarios: baseline, warming pulse, drought, low-nitrogen host, natural enemy incursion, and student-designed regime.
- Adds export buttons for current-run CSV, current-run JSON with metadata, pooled class CSV, and model notes.
- Adds a pre-generated tutorial dataset at `data/aphid_tutorial_dataset.csv`.
- Adds explanatory variables suitable for analysis: plant health, host quality, thermal performance, degree days, fecundity, mortality, alate fraction, natural enemy pressure, interventions, and event notes.

## Repository structure

```text
.
├── index.html                         # App shell
├── styles.css                         # Styling
├── app.js                             # User interface, charts, downloads
├── simulation.js                      # Deterministic aphid/host-plant simulation engine
├── data/
│   ├── aphid_tutorial_dataset.csv     # Pre-generated class dataset
│   ├── aphid_tutorial_dataset_metadata.json
│   └── model_notes.md                 # Model assumptions and suggested tasks
├── .github/workflows/deploy.yml       # Optional GitHub Pages deployment workflow
├── .nojekyll                          # Ensures GitHub Pages serves files unchanged
└── README.md
```

## Run locally

Because the app uses ES modules, serve it over HTTP rather than opening `index.html` directly from the file system.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Deploy on GitHub Pages

Use either route below.

### Option 1: Deploy from branch root

1. Commit all files to a GitHub repository.
2. Open repository **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Select the `main` branch and `/root` folder.
5. Save.

### Option 2: Use the included GitHub Actions workflow

1. Commit all files to the `main` branch.
2. Open repository **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main`; the included `.github/workflows/deploy.yml` deploys the static site.

## Suggested practical workflow

1. Ask students to write a prediction for one scenario before running it.
2. Students run the app, adjust one factor, and download their current CSV.
3. The class also downloads or uses the pooled class dataset.
4. Students visualise population trajectories and compare scenario outcomes.
5. Students discuss which variables are treatments, responses, mediators, and confounders.

## R starter code

```r
library(readr)
library(ggplot2)
library(dplyr)

aphids <- read_csv("data/aphid_tutorial_dataset.csv")

ggplot(aphids, aes(day, total_aphids_observed, colour = scenario)) +
  geom_line(aes(group = experiment_id), alpha = 0.35) +
  geom_smooth(se = FALSE, linewidth = 1.2) +
  scale_y_continuous(trans = "log1p") +
  labs(x = "Day", y = "Observed aphids, log1p scale", colour = "Scenario")

finals <- aphids |>
  group_by(experiment_id, scenario) |>
  filter(day == max(day)) |>
  ungroup()

finals |>
  group_by(scenario) |>
  summarise(
    n = n(),
    mean_final_total = mean(total_aphids_observed),
    mean_final_plant_health = mean(plant_health_pct),
    mean_final_alate_fraction = mean(alate_fraction),
    .groups = "drop"
  )

model <- lm(log1p(total_aphids_observed) ~ day * scenario, data = aphids)
summary(model)
```

## Model caveat

This is a teaching simulator. The equations are mechanistic and biologically motivated, but they are not fitted to a specific aphid clone, host cultivar, or controlled-environment facility. Treat the output as synthetic data for learning experimental design, visualisation, reproducibility, and statistical analysis.
