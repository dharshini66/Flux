# FLUX — KNOW WHAT CHANGED.
> **Understand the movement.**

FLUX is an intelligent market watchlist engine designed to surface meaningful market shifts rather than overwhelming users with raw ticker noise. By comparing current market conditions against a user's previous check-in snapshot, FLUX isolates notable price velocity, unusual volume anomalies, volatility breaches, and critical price extremes into ranked, explainable signals.

*Built for the Code by Groww 2026 engineering challenge.*

---

## Preview

<!--
SCREENSHOT PLACEHOLDERS:
To display screenshots, place PNG captures in docs/screenshots/ and uncomment the markdown image links below:

### 1. Dashboard Overview & Signal Feed
![FLUX Dashboard Overview](docs/screenshots/dashboard_overview.png)

### 2. Market Pulse (Intraday Inflection Points)
![FLUX Market Pulse](docs/screenshots/market_pulse.png)

### 3. Factor Breakdown & Explainability ("Why This Matters")
![FLUX Explainability Drawer](docs/screenshots/explain_drawer.png)
-->

> [!NOTE]
> Screenshot assets are referenced in [`docs/screenshots/`](docs/screenshots/). Add dashboard captures to this directory to populate visual previews.

---

## Overview

### The Problem
Traditional market watchlists operate as raw data grids. They present rows of current quotes and fixed 24-hour percentage changes without historical or personal context. For an investor returning after two hours or three days, rolling 24-hour metrics fail to answer the most critical questions:
- *What changed since I last checked?*
- *Is this movement routine market chop or an actual momentum shift?*
- *Which stocks in my watchlist require my attention right now?*

### The FLUX Approach
FLUX shifts the paradigm from continuous observation to stateful session comparison:
1. **User Baseline Snapshots**: Every check-in captures the exact market state of the user's watchlist symbols.
2. **Session-to-Session Delta**: When the user returns, current quotes are evaluated directly against their prior personal baseline rather than an arbitrary 24-hour window.
3. **Multi-Factor Meaningful Change Engine**: Movements are evaluated across five dimensions (price velocity, volume ratio, volatility multiples, price-level boundaries, and contextual confluence) to separate genuine signals from routine market chop.
4. **Explainable Insights**: Every alert is accompanied by a quantitative factor breakdown explaining exactly why the movement was flagged.

---

## Key Features

- **Custom Watchlist Management**: Create and organize multiple watchlists, reorder entries, and toggle priority flags per symbol.
- **Stateful Baseline Snapshots**: Freezes watchlist quotes upon each user check-in to compute true personal delta over time.
- **Meaningful Change Detection**: Algorithmic scoring model that suppresses noise below a configurable threshold and ranks changes by significance.
- **Categorized Severity Tiers**: Signals classified into `NORMAL`, `MODERATE`, `HIGH`, and `CRITICAL` with visual 1–5 level meters.
- **Transparent Factor Breakdown**: Detailed scoring decomposition covering price velocity, volume multiples, volatility bands, and 52-week proximity.
- **Market Pulse Timeline**: Chronological tracking of notable intraday inflection points throughout trading hours.
- **Market Session Status**: Live indicator for market state (Open/Closed), active exchange (NSE), and current session timing.
- **Data Freshness Classification**: Explicit tags (`LIVE`, `RECENT`, `STALE`, `UNAVAILABLE`) reflecting provider latency.
- **Resilient Multi-Provider Handling**: Fallback aggregation handling provider timeouts, missing symbols, and cross-provider price conflicts.
- **Deterministic Demo Scenarios**: Built-in test scenarios (surges, market pullbacks, stale data, provider failures) for repeatable local evaluation.
- **JWT Authentication**: Secure user registration, login, and session persistence across client devices.

---

## How It Works

```
┌─────────────────┐       ┌────────────────────────┐       ┌──────────────────────┐
│  User Check-In  │ ────> │ Capture Baseline State │ ────> │ Store Snapshot in    │
│                 │       │ (Prices, Volume, 52W)  │       │ Database (User-tied) │
└─────────────────┘       └────────────────────────┘       └──────────────────────┘
                                                                       │
                                   User returns later                  │
                                                                       ▼
┌─────────────────┐       ┌────────────────────────┐       ┌──────────────────────┐
│ Ranked Signals  │ <──── │ Meaningful Change      │ <──── │ Fetch Current Market │
│ & Explanations  │       │ Scoring Engine         │       │ Quotes via Provider  │
└─────────────────┘       └────────────────────────┘       └──────────────────────┘
```

1. **First Visit**: An initial baseline snapshot is recorded for the user's watchlist symbols without generating false or fabricated alerts.
2. **Subsequent Visits**: The system queries current quotes for all tracked symbols, retrieves the user's most recent snapshot, and computes the delta vector for each stock.
3. **Evaluation**: The **Meaningful Change Engine** scores each stock against baseline thresholds, ensuring deterministic and reproducible scoring.
4. **Presentation**: Results are sorted descending by composite significance score, displaying prioritized change cards with editorial commentary and factor scores.

---

## Meaningful Change Engine

The core scoring engine is decoupled from storage and presentation logic. It evaluates market deltas through a composite mathematical model yielding a normalized score between `0.0` and `1.0`:

$$\text{Composite Score} = w_p S_p + w_v S_v + w_\sigma S_\sigma + w_l S_l + w_c S_c$$

### Implemented Factors & Weights

| Factor | Weight ($w$) | Metric Evaluated | Implementation Logic |
| :--- | :---: | :--- | :--- |
| **Price Velocity ($S_p$)** | **0.35** | Absolute % price change vs. baseline | Suppressed below **0.4%** (noise floor). Scaled linearly between **2.0%** (notable), **4.0%** (significant), and **6.0%+** (extreme). |
| **Volume Anomaly ($S_v$)** | **0.25** | Current volume vs. typical daily volume | Evaluates ratio against baseline average. Triggers at **1.5×** (notable), **2.2×** (high), and **3.5×** (extreme volume surge). |
| **Volatility Deviation ($S_\sigma$)** | **0.15** | Move divided by typical volatility band | Measures whether the price move exceeds **1.25×** the stock's typical session volatility / ATR band. |
| **Price Level Proximity ($S_l$)** | **0.15** | 52-week High/Low boundaries & Gap-opens | Awards maximum score for new 52W record breaks, elevated score within **1.5%** of boundary, or opening gaps $\ge \mathbf{2.0\%}$. |
| **Contextual Confluence ($S_c$)** | **0.10** | Co-occurrence of independent signals | Bonus awarded when 2 or more factors trigger simultaneously (compound movement). |

### Severity Classification

Based on the composite score, changes are categorized into four operational tiers:

| Severity Tier | Composite Score Cutoff | Signal Meter | Treatment in UI |
| :--- | :---: | :---: | :--- |
| **CRITICAL** | $\ge 0.80$ | `● ● ● ● ●` | Highlighted as primary alert; high price velocity with anomalous volume. |
| **HIGH** | $\ge 0.60$ | `● ● ● ● ○` | Significant directional catalyst or 52-week breakout boundary. |
| **MODERATE** | $\ge 0.35$ | `● ● ● ○ ○` | Activity noticeably above normal daily variance. |
| **NORMAL** | $< 0.35$ | `● ● ○ ○ ○` | Routine market movement; filtered from priority view by default. |

---

## Architecture

FLUX is organized as a modular application with clean separation of concerns:

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 18 + Vite + TypeScript)"]
        UI[Watchlist & Signal Feed]
        Pulse[Market Pulse Timeline]
        Drawer[Explainability Factor Drawer]
        DemoBar[Demo Scenario Selector]
    end

    subgraph API ["API Gateway (FastAPI)"]
        AuthRouter["/api/v1/auth"]
        WatchRouter["/api/v1/watchlists"]
        SnapRouter["/api/v1/snapshots & /changes"]
        MarketRouter["/api/v1/market & /stocks"]
    end

    subgraph ServiceLayer ["Application Services"]
        SnapService[SnapshotService]
        WatchService[WatchlistService]
        MarketService[MarketDataService]
        Engine[MeaningfulChangeEngine]
    end

    subgraph DataAccess ["Data & Aggregation"]
        Consensus[ConsensusMarketProvider]
        DemoProv[DemoMarketDataProvider]
        Cache[(In-Memory SharedCache)]
        DB[(Database via SQLAlchemy Async)]
    end

    UI -->|REST / HTTP| API
    Pulse -->|REST / HTTP| API
    Drawer -->|REST / HTTP| API
    DemoBar -->|REST / HTTP| API

    AuthRouter --> DB
    WatchRouter --> WatchService
    SnapRouter --> SnapService
    MarketRouter --> MarketService

    SnapService --> Engine
    SnapService --> MarketService
    SnapService --> DB
    WatchService --> DB
    MarketService --> Consensus
    Consensus --> Cache
    Consensus --> DemoProv
```

- **Client Layer**: Single Page Application built with React 18, TypeScript, and Vite, utilizing Tailwind CSS and Lucide React.
- **API Gateway**: Asynchronous FastAPI endpoints with CORS middleware, Pydantic v2 validation, and JWT authentication.
- **Service Layer**: Decoupled domain services isolating business logic (`SnapshotService`, `WatchlistService`, `MarketDataService`).
- **Engine**: Pure algorithmic evaluation with zero external database or HTTP dependencies.
- **Data Access**: Asynchronous SQLAlchemy 2.0 interface with SQLite (`aiosqlite`) default and an in-memory TTL cache.

---

## Data & State

### Database Models
The relational schema is managed through SQLAlchemy models:
- **`User`**: Account identity, hashed credentials, user role, and activity counters.
- **`Watchlist`**: User-owned watchlists with positioning and default flags.
- **`WatchlistStock`**: Join table mapping stocks to watchlists with an `is_priority` flag. Enforces a database-level unique constraint (`uq_watchlist_stock`) to prevent duplicate additions.
- **`Stock`**: Master stock directory containing reference baselines (52W high/low, typical daily volume, typical volatility %).
- **`MarketSnapshot`**: Records check-in metadata, timestamp, and meaningful change counts for a user (`ix_user_created_at` compound index).
- **`StockSnapshot`**: Frozen price, volume, and boundary values for each stock captured during a snapshot (`uq_snapshot_stock` unique constraint).
- **`MarketEvent` & `UserEvent`**: Historic log of detected signals and user interactions (read/bookmarked).

### Session & Cross-Device Persistence
- User state is stored server-side and authenticated via Bearer JWT tokens.
- Snapshots are persistent in the relational database rather than local client storage, ensuring consistent baseline comparisons whether a user logs in from desktop or mobile.

---

## Market Data Reliability

FLUX supports provider-backed market data when configured and includes a deterministic Demo Mode for local evaluation without external market-data dependencies.

```
                  ┌───────────────────────────────┐
                  │    ConsensusMarketProvider    │
                  └──────────────┬────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
    ┌─────────────────────────┐     ┌─────────────────────────┐
    │    Primary Provider     │     │   Secondary Provider    │
    │  (Attempts real-time)   │     │    (Graceful Fallback)  │
    └─────────────────────────┘     └─────────────────────────┘
```

1. **Provider Abstraction**: All market feeds adhere to the `MarketDataProvider` abstract interface, allowing pluggable data sources.
2. **Freshness Tracking**: Every quote is stamped with a `FreshnessStatus`:
   - `LIVE`: Data refreshed within the last 15 seconds.
   - `RECENT`: Data refreshed within the last 5 minutes.
   - `STALE`: Data older than 5 minutes (displays an explicit UI warning banner).
   - `UNAVAILABLE`: Data feed unreachable or symbol not found.
   - `DEMO`: Deterministically simulated market states for local offline evaluation.
3. **Multi-Provider Fallback**: The `ConsensusMarketProvider` attempts queries via primary feeds; if timeouts or exceptions occur, it fails over to secondary providers.
4. **Discrepancy Arbitration**: If concurrent provider quotes for the same symbol diverge by more than **0.5%**, the system logs an anomaly warning and arbitrates based on timestamp freshness.
5. **Fail-Safe Containment**: If all providers fail, the service returns an explicit `UNAVAILABLE` quote structure with descriptive failure context rather than raising unhandled 500 errors.

---

## Resilience & Edge Cases

The codebase includes explicit handling for common operational edge cases:

- **First-Time Users**: Initial check-in creates a baseline snapshot without generating phantom change alerts.
- **Market Closed**: The system inspects market hours (`09:15` to `15:30` IST) and surfaces the official session status to clarify static price behavior.
- **Duplicate Additions**: Handled both in application validation and via the `uq_watchlist_stock` database unique constraint.
- **Provider Timeouts**: Caught within the provider abstraction, returning fallback values without breaking the user session.
- **Stale Feed Warning**: Automatically alerts the user when incoming quotes exceed the freshness window.
- **Concurrent Ingestion**: Thread-safe shared caching primitives prevent redundant concurrent network roundtrips for identical symbols.

---

## Scalability Considerations

The current architecture reduces redundant provider requests through shared TTL caching and batch retrieval and is structured to support future horizontal scaling:

- **Shared In-Memory Cache with TTL**: In-memory caching with a 10-second TTL (`app/core/cache.py`) serves popular symbols across all user watchlists from a single upstream fetch, eliminating redundant queries.
- **Batch Processing**: The service layer uses batch operations (`get_quotes_batch` and `get_multi`) to fetch quote sets in bulk rather than executing individual queries per stock.
- **Asynchronous Non-Blocking I/O**: The entire backend pipeline—from FastAPI route handlers to SQLAlchemy database operations via `aiosqlite`—is asynchronous, allowing worker threads to remain non-blocked during database and provider queries.
- **Database Indexing**: Targeted indexing on foreign keys (`user_id`, `watchlist_id`, `snapshot_id`) and chronological compound indexes (`ix_user_created_at`) optimize snapshot retrieval for active users.

---

## Security

- **Password Security**: Passwords hashed using bcrypt through `passlib.context.CryptContext`.
- **Stateless Authentication**: Cryptographically signed JSON Web Tokens (PyJWT) using HMAC-SHA256 (`HS256`).
- **Endpoint Authorization**: Route protection via FastAPI dependencies (`get_current_user`) verifying token integrity.
- **Input Validation**: Strict request/response payload validation through Pydantic v2 schemas.
- **CORS Protection**: Explicitly configured `CORSMiddleware` restricting origins, allowed headers, and methods.
- **Config Management**: Environment variable isolation managed via `pydantic-settings` with local `.env` overrides.

---

## Environment Variables

Configuration is loaded from environment variables or a local `.env` file via `pydantic-settings`. A ready-to-use template is available in `.env.example`:

| Variable | Purpose | Default / Safe Value | Required |
| :--- | :--- | :--- | :---: |
| `ENVIRONMENT` | Runtime environment mode (`development` / `production`) | `development` | No |
| `DEBUG` | Enables verbose debug logs | `true` | No |
| `HOST` | Backend server binding host address | `0.0.0.0` | No |
| `PORT` | Backend server binding port | `8000` | No |
| `SECRET_KEY` | JWT signing key (override with 32+ random characters in production) | Development key | Yes (in prod) |
| `ALGORITHM` | JWT signature algorithm | `HS256` | No |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token lifespan in minutes | `10080` (7 days) | No |
| `DATABASE_URL` | Asynchronous database connection string | `sqlite+aiosqlite:///./flux_market.db` | No |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | `http://localhost:5173,http://127.0.0.1:5173,*` | No |
| `VITE_API_URL` | Base API URL for decoupled frontend hosting (Vercel/Netlify) | Blank (uses Vite dev proxy) | No |
| `FRESHNESS_LIVE_SEC` | Threshold in seconds for `LIVE` classification | `15` | No |
| `FRESHNESS_RECENT_SEC` | Threshold in seconds for `RECENT` classification | `300` | No |
| `FRESHNESS_STALE_SEC` | Threshold in seconds for `STALE` classification warning | `900` | No |

---

## Tech Stack

### Frontend
- **Framework**: React 18 (TypeScript)
- **Tooling**: Vite, PostCSS, Autoprefixer
- **Styling**: Tailwind CSS
- **Charts & Visualization**: Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **ASGI Server**: Uvicorn
- **ORM & Database**: SQLAlchemy 2.0 (Async), aiosqlite, SQLite
- **Validation**: Pydantic v2, Pydantic Settings
- **Authentication**: PyJWT, passlib, bcrypt
- **HTTP Client**: HTTPX

### Testing & Tooling
- **Testing**: pytest, pytest-asyncio
- **Process & Dev**: Git, npm, pip

---

## Project Structure

```
Flux/
├── backend/
│   ├── app/
│   │   ├── api/v1/              # API Route Controllers (auth, watchlists, changes, market, stocks)
│   │   ├── core/                # Config, logging, JWT security, in-memory cache
│   │   ├── db/                  # Relational models, connection setup, database seed
│   │   ├── engine/              # MeaningfulChangeEngine & transparent factor breakdown
│   │   ├── services/            # SnapshotService, WatchlistService, MarketDataService
│   │   └── main.py              # Application entrypoint & FastAPI lifespan
│   ├── tests/                   # Automated unit, integration, and resilience tests
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Cards, changes feed, explainability drawer, demo bar, watchlist
│   │   ├── context/             # Auth, Market, Watchlist, and Mission contexts
│   │   ├── services/api.ts      # Typed API client with token storage
│   │   ├── types/               # TypeScript interfaces and data models
│   │   ├── App.tsx              # Root dashboard layout
│   │   └── main.tsx             # Application bootstrap
│   ├── package.json             # Frontend dependencies & build scripts
│   └── vite.config.ts           # Development proxy & compilation settings
│
├── docs/
│   └── screenshots/             # Visual dashboard captures
├── .env.example                 # Environment configuration template
├── pytest.ini                   # Pytest test execution configuration
└── README.md                    # Project documentation
```

---

## Getting Started

### Prerequisites
- **Python 3.10+** (Tested on Python 3.13)
- **Node.js 18+** and **npm**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/dharshini66/Flux.git
cd Flux
```

### 2. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Server: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`
- Healthcheck Endpoint: `http://127.0.0.1:8000/health`

### 3. Frontend Setup
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

### 4. Production Deployment

#### Option A: Docker Compose
```bash
docker-compose up --build
```

#### Option B: Cloud Hosting (Render / Railway / Vercel)
1. **Backend (FastAPI)** on Render / Railway / Fly.io:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables: Set `SECRET_KEY`, `CORS_ORIGINS`, and `DATABASE_URL`.
2. **Frontend (Vite / React SPA)** on Vercel / Netlify:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: `VITE_API_URL=https://your-backend-service.onrender.com`

---

## Demo Mode

For local evaluation and testing without depending on external market data feeds, FLUX includes a seeded **Demo Mode**. Demo scenarios use deterministic simulated market states and pass through the same application and change-detection pipeline:

- **Default (`default`)**: Balanced intraday session exhibiting mixed price movements and volume across core index stocks (INFY, TCS, HDFCBANK, RELIANCE).
- **Large Surge (`large_surge`)**: Upward velocity catalyst testing 52-week high breakout logic (INFY +7.3% on 4.2× volume).
- **Market Pullback (`market_crash`)**: Downward liquidity sweep testing support breach behavior across financial sector symbols (HDFCBANK -6.4%).
- **Stale Data (`stale_data`)**: Simulates a 14-minute data ingestion delay to verify freshness badge transitions and user warnings.
- **Provider Failure (`provider_failure`)**: Simulates a gateway timeout on specific symbols to demonstrate graceful error containment and fallback states.
- **Quiet Consolidation (`no_signal_quiet`)**: Confines stock price fluctuations below the 0.4% noise floor to demonstrate empty-state suppression.

*Note: Demo Mode enables repeatable offline verification while exercising all scoring, caching, and persistence pathways.*

---

## Testing

The backend includes an automated test suite verifying scoring algorithms, concurrency safety, multi-provider resilience, and snapshot persistence:

```bash
cd backend
python -m pytest -v
```

### Verified Test Results

```
tests/test_audit_comprehensive.py ......                                 [31%]
tests/test_auth_watchlist.py ..                                          [42%]
tests/test_change_engine.py ......                                       [73%]
tests/test_concurrency.py .                                              [78%]
tests/test_resilience.py ..                                              [89%]
tests/test_snapshots.py ..                                               [100%]

============================= 19 passed in 4.00s ==============================
```

- **`test_audit_comprehensive.py`**: End-to-end verification of auth lifecycle, watchlist CRUD and isolation, baseline snapshot immutability, mathematical engine boundaries, all demo scenarios, and health endpoints.
- **`test_change_engine.py`**: Validates noise suppression (<0.4%), volume multiplier escalation, 52W extreme triggers, and bounded score normalization ($0.0 \le S \le 1.0$).
- **`test_resilience.py`**: Verifies provider failover, stale data badge generation, and conflicting price arbitration.
- **`test_concurrency.py`**: Validates cache thread-safety and idempotency under simultaneous asynchronous worker requests.
- **`test_snapshots.py`**: Tests first-visit baseline establishment and returning-visit delta calculations.
- **`test_auth_watchlist.py`**: Tests user registration, JWT generation, watchlist CRUD operations, and duplicate entry rejection.

---

## Engineering Trade-offs

### 1. Snapshot-Based Comparison vs. Rolling 24-Hour Change
- **What**: Persistent user baseline snapshots captured at check-in rather than rolling 24-hour percentage change.
- **Why**: A user's meaningful comparison interval is not necessarily aligned with a calendar day. If an investor visits at 10:00 AM and returns at 2:30 PM, a 24-hour metric is irrelevant to what transpired during their absence.
- **Trade-off**: Requires database storage and writes on check-in, but delivers true session-to-session delta calculations.

### 2. Decoupled Algorithmic Engine vs. Database-Coupled Triggers
- **What**: Pure Python scoring engine taking a `StockDeltaContext` dataclass and returning an evaluation result.
- **Why**: Isolating mathematical scoring from database and HTTP frameworks allows unit testing without mocks, deterministic benchmarking, and easy portability to alternative worker pipelines.
- **Trade-off**: Requires passing complete market context to the engine in application memory, but eliminates database coupling and enables isolated algorithmic tuning.

### 3. Asynchronous SQLite vs. External Database Clusters
- **What**: Default asynchronous SQLite (`aiosqlite`) with an abstract SQLAlchemy 2.0 relational layer.
- **Why**: Enables zero-configuration local evaluation, reproducible testing, and single-command startup without requiring external container dependencies.
- **Trade-off**: SQLite concurrency is bounded under high write loads. The database layer is structured around SQLAlchemy and standard relational models, allowing migration to PostgreSQL with minimal application-level changes.

### 4. Modular Monolith vs. Distributed Microservices
- **What**: Cohesive modular application with cleanly separated domain boundaries (`api`, `services`, `engine`, `db`) within a single deployable unit.
- **Why**: Eliminates network serialization overhead, distributed tracing complexity, and multi-service deployment friction while maintaining clear internal boundaries.
- **Trade-off**: Services scale together rather than independently, but complexity remains low and maintainability high.

### 5. Configurable Thresholds vs. Scattered Magic Numbers
- **What**: Centralized configuration dataclass in `app/engine/thresholds.py` mapped to `app/core/config.py`.
- **Why**: Hardcoded heuristics scattered across business logic lead to calibration bugs and untestable edge cases.
- **Trade-off**: Slight initial setup indirection, but enables dynamic sensitivity tuning, scenario overrides, and auditable scoring criteria.

---

## Future Improvements

- **WebSocket Ingestion**: Real-time tick streaming via WebSockets for live intraday price updates.
- **Distributed Cache Layer**: Transitioning in-memory caching to a Redis cluster for multi-node deployments.
- **User-Defined Threshold Overrides**: Allowing individual users to customize signal sensitivity and volume multipliers per watchlist.
- **Direct Broker & Exchange Connectors**: Production integrations with official exchange market data feeds.

---

## License

This project is licensed under the [MIT License](LICENSE).
