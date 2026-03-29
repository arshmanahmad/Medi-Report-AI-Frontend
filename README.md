# Medi Report AI

A full-stack health report analysis system: users enter lab values (Glucose, Urea, Creatinine, Hemoglobin, Platelets, etc.), select a disease to check, and get AI-powered risk prediction, diet plans, medicine recommendations, and recovery timeline. Reports can be downloaded as PDF or Excel.

## Architecture

- **Frontend** (`Medi-Report-AI-Frontend`): React + Vite + TypeScript. User input, results, history dashboard with charts.
- **Backend** (`Medi-Report-AI-Backend`): Node.js + Express + TypeScript. REST API; forwards prediction requests to the Python AI service.
- **AI Service** (`Medi-Report-AI-Backend/ai-services`): Python Flask app. Rule-based (and trainable) disease prediction, diet, medicines, recovery timeline.

**Flow:** Frontend → User input → Prediction request → Express backend → Python AI service → Predictions & observations → Backend saves to history → Frontend shows results and allows PDF/Excel download.

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+ (for ai-services)
- Two terminals (one for backend, one for AI service; or run AI service in background)

---

## 1. AI Service (Python)

The AI logic runs in `Medi-Report-AI-Backend/ai-services`. It must be running for predictions to work.

### Setup

```bash
cd Medi-Report-AI-Backend/ai-services
```

Create and activate a virtual environment:

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Run

```bash
python app.py
```

By default the Flask app runs at **http://127.0.0.1:5001** (port **5000** is avoided because PostgreSQL often uses it on Windows). Keep this terminal open.

(Optional) To retrain the ML model later: add labeled samples to `data/training_data.json`, then run `python train_model.py`.)

---

## 2. Backend (Node.js + TypeScript)

Express server that the frontend calls and which calls the Python AI service.

### Setup

```bash
cd Medi-Report-AI-Backend
npm install
```

### Seed default user + admin

Creates or updates **`john.doe@example.com`** (user) and **`admin@example.com`** (admin) in `data/app-state.json` (merge by email; existing history is kept). Optional env: `SEED_USER_PASSWORD`, `SEED_ADMIN_PASSWORD` (defaults: `user12345`, `admin12345`).

```bash
npm run seed
```

Restart the backend after seeding so it reloads users from disk.

### Run (development)

```bash
npm run dev
```

Backend runs at **http://localhost:4000** by default. It expects the AI service at **http://127.0.0.1:5001**. To use another URL:

```bash
set AI_SERVICE_URL=http://127.0.0.1:5001
npm run dev
```

(On macOS/Linux use `export AI_SERVICE_URL=...`.)

### Build for production

```bash
npm run build
npm start
```

---

## 3. Frontend (React + Vite)

### Setup

```bash
cd Medi-Report-AI-Frontend
npm install
```

### Run (development)

```bash
npm run dev
```

Frontend runs at **http://localhost:5173** (or the port Vite shows). It uses the backend at **http://localhost:4000** by default. To override:

Create `.env` in `Medi-Report-AI-Frontend`:

```
VITE_API_URL=http://localhost:4000
```

Then restart `npm run dev`.

### Build for production

```bash
npm run build
npm run preview
```

---

## Startup Order (full stack)

1. **Terminal 1 – AI service**
   ```bash
   cd Medi-Report-AI-Backend/ai-services
   python -m venv venv
   .\venv\Scripts\Activate.ps1   # or source venv/bin/activate on macOS/Linux
   pip install -r requirements.txt
   python app.py
   ```

2. **Terminal 2 – Backend**
   ```bash
   cd Medi-Report-AI-Backend
   npm install
   npm run dev
   ```

3. **Terminal 3 – Frontend**
   ```bash
   cd Medi-Report-AI-Frontend
   npm install
   npm run dev
   ```

4. Open **http://localhost:5173** in the browser. Log in with seeded accounts: **`john.doe@example.com` / `user12345`** (user) or **`admin@example.com` / `admin12345`** (admin). Data persists in `Medi-Report-AI-Backend/data/app-state.json` while the backend runs. Then go to **Verify Report**, enter test values, select a disease (or “All Diseases”), and run the prediction.

---

## Features

- **Input:** Lab values (Glucose, Urea, Creatinine, Hemoglobin, Platelets, WBC, RBC, ALT, AST, Bilirubin, Albumin, Sodium, Potassium, Cholesterol, HDL, LDL, Triglycerides) with normal-range hints.
- **Disease selection:** Diabetes, Hypertension, Kidney Disorder, Liver Disorder, Heart Disease, Anemia, Infection, or All Diseases.
- **AI prediction:** Risk level (Low / Moderate / High), probability, and short medical explanation per disease.
- **Diet plan:** Foods to eat/avoid, daily routine, hydration, duration; optional meal plan.
- **Medicine (salt) recommendations:** Salt name, usage, dosage, when needed, cautions and warnings for sensitive patients.
- **Recovery timeline:** Estimated duration and milestones.
- **Reports:** Download full report as **PDF** or **Excel** (predictions, diet, risks, recommendations).
- **Health history:** Dashboard and History page with previous reports and **charts** (risk distribution, key metrics over time).

---

## Project layout

```
Medi-Report-AI/
├── README.md
├── Medi-Report-AI-Frontend/     # React app
│   ├── src/
│   │   ├── services/            # api.ts, backend.ts, reportGenerator.ts
│   │   ├── pages/               # Dashboard, VerifyReport, Results, History, etc.
│   │   └── ...
│   └── package.json
└── Medi-Report-AI-Backend/      # Express + AI service
    ├── src/                     # Express routes, aiService, history store
    ├── ai-services/             # Python Flask AI
    │   ├── app.py               # Flask /health, /predict
    │   ├── prediction.py       # Rule-based (and trainable) logic
    │   ├── requirements.txt
    │   ├── data/
    │   │   └── training_data.json
    │   ├── models/              # Optional ML model output
    │   ├── train_model.py       # Optional retrain script
    │   └── venv/                # Create with python -m venv venv
    ├── package.json
    └── tsconfig.json
```

---

## .gitignore

- **Root / Backend:** `node_modules`, `dist`, `*.log`, `.env`, `ai-services/venv`, `ai-services/__pycache__`.
- **Frontend:** `node_modules`, `dist`, `*.log`, `.env`, `.env.local`.
- **ai-services:** `venv`, `__pycache__`, `*.pyc`, `models/*.joblib`, `.env`.

Ensure each folder’s `.gitignore` is updated so `venv`, `node_modules`, and build artifacts are not committed.

---

## Notes

- Predictions are for **informational use** only; they do not replace a doctor’s diagnosis.
- Auth uses **hashed passwords**; users and prediction **history** are stored on disk (`data/app-state.json`). For production, use a real database and hardened auth.
- **Learning:** Each prediction appends a weak label to `ai-services/data/training_data.json`. After enough rows, retraining can run automatically (see `ai-services/learning.py`). You can still run `python train_model.py` manually in `ai-services`.
