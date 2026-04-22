# DevPulse — Developer Productivity MVP

A focused full-stack MVP that helps developers move from raw metrics to understanding and action.

## What it does

- **IC Profile view** — pick any developer, see their 5 metrics, a health radar chart, and plain-English interpretation of what each metric means + one concrete next step
- **Team Summary view** — bar charts comparing all developers, plus a status table with overall health badges

## The 5 metrics (per assignment spec)

| Metric | Definition used |
|---|---|
| Lead Time | Avg days from PR opened → successful production deploy |
| Cycle Time | Avg days from issue In Progress → Done |
| Bug Rate | Escaped bugs ÷ issues completed in the month |
| Deploy Frequency | Count of successful production deploys in the month |
| PR Throughput | Count of merged PRs in the month |

## Stack

- **Frontend**: React.js + Recharts
- **Backend**: Python FastAPI
- **Data**: pandas reading Excel (matches assignment workbook structure)

## Setup

### 1. Backend
```
cd backend
python -m uvicorn main:app --reload --port 8000
```
Or double-click `start_backend.bat`

### 2. Frontend (new terminal)
```
cd frontend
npm start
```
Or double-click `start_frontend.bat`

App opens at http://localhost:3000

## Project structure

```
TheProductWorks_assignment/
├── backend/
│   ├── main.py          # FastAPI endpoints
│   ├── metrics.py       # Metric calculations + interpretation logic
│   ├── seed_data.py     # Generates Excel data file
│   └── data/
│       └── productivity_data.xlsx
├── frontend/
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── hooks/useFetch.js
│       └── components/
│           ├── ICProfile.js    # Main IC view
│           └── TeamSummary.js  # Manager view
├── start_backend.bat
└── start_frontend.bat
```

## API endpoints

| Endpoint | Description |
|---|---|
| `GET /developers` | List all developers |
| `GET /metrics/{dev_id}?month=2024-01` | Full metrics + interpretation for one developer |
| `GET /team-summary?month=2024-01` | Metrics for all developers |

## Key design decisions

1. **Interpretation over raw numbers** — every metric has a "story" (what it likely means) and a "next step" (what to do). This is the core product insight.
2. **Focused scope** — one IC journey done well beats five half-built views.
3. **Status thresholds** — good/ok/warn thresholds are simple and defensible (e.g. lead time ≤3d = good, ≤7d = ok, >7d = warn).
4. **Radar chart** — converts 5 metrics into a single visual health snapshot.
