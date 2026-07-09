# ⚫ BlackCloud Testing Strategy

> Tools, structure, and conventions for testing the full stack.

---

## Stack Overview

| Layer                     | Tool                        | Version | Purpose                            |
| ------------------------- | --------------------------- | ------- | ---------------------------------- |
| Python (unit/integration) | pytest                      | 9.x+    | Test runner                        |
| Python (async)            | pytest-asyncio              | latest  | Async FastAPI/celery tests         |
| Python (API client)       | httpx2                      | 2.5+    | Async test client for FastAPI      |
| Python (coverage)         | pytest-cov                  | latest  | Coverage reporting                 |
| Python (linter)           | ruff                        | 1.x+    | Lint + format (already configured) |
| Frontend (unit)           | vitest                      | 4.x+    | Fast unit tests                    |
| Frontend (components)     | @testing-library/react      | 16.x+   | DOM-centric component tests        |
| Frontend (matchers)       | @testing-library/jest-dom   | latest  | Custom DOM matchers                |
| Frontend (events)         | @testing-library/user-event | latest  | Realistic user interactions        |
| Frontend (E2E)            | @playwright/test            | 1.61+   | Cross-browser E2E tests            |

---

## Python Backend

### Test structure

```text
backend/
└── tests/
    ├── conftest.py          # Shared fixtures (DB session, client, auth)
    ├── test_api/
    │   ├── test_auth.py     # Auth endpoints
    │   ├── test_projects.py # Project CRUD
    │   └── test_canvas.py   # Nodes & edges
    ├── test_services/
    │   ├── test_validation.py # Architecture validation logic
    │   └── test_export.py     # Export engine
    └── test_workers/
        └── test_migration.py  # Celery tasks
```

### Configuration

Add to `pyproject.toml`:

```toml
[project.optional-dependencies]
test = [
    "pytest>=9.0.0",
    "pytest-asyncio>=0.26.0",
    "pytest-cov>=7.0.0",
]

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["backend/tests"]
pythonpath = ["backend"]

[tool.coverage.run]
source = ["backend"]
```

### Fixtures (`conftest.py`)

```python
import pytest
from httpx2 import AsyncClient, ASGITransport
from app.main import app
from app.db import get_db

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def db_session():
    # In-memory SQLite for speed, swap to test PG if needed
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        yield AsyncSession(conn)
        await conn.run_sync(Base.metadata.drop_all)
```

### Running tests

```bash
# Install test deps
uv add --group test pytest pytest-asyncio pytest-cov

# Run all tests
uv run pytest

# With coverage
uv run pytest --cov=backend --cov-report=term-missing

# Specific file
uv run pytest backend/tests/test_api/test_canvas.py -v

# FastAPI test client targets
uv run pytest -k "api" -v
```

### What to test (by priority)

1. **API endpoints** — every route gets a happy-path + error-case test
2. **Validation engine** — architecture rules (ALB→RDS invalid, ALB→ECS→RDS valid)
3. **Export engine** — PNG, SVG, JSON output correctness
4. **AI integration** — mock LLM responses, test prompt construction & parsing
5. **Migration parser** — Terraform/CloudFormation → internal graph
6. **Celery tasks** — task execution, retry logic

### What NOT to test (defer)

- Pydantic models in isolation (covered by API tests)
- SQLAlchemy internals (trust the ORM)
- External provider pricing API responses (integration test in CI only)

---

## Frontend (unit + component)

### Test structure

```text
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── store/
│   └── services/
└── tests/
    ├── setup.ts              # Global test setup
    ├── components/
    │   ├── NodePalette.test.tsx
    │   ├── Canvas.test.tsx
    │   └── Inspector.test.tsx
    ├── hooks/
    │   └── useCanvas.test.ts
    ├── store/
    │   └── projectStore.test.ts
    └── services/
        └── api.test.ts
```

### Install

```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Configuration

Add to `frontend/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

`frontend/tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Add to `frontend/package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

### Running tests

```bash
bun test                    # single run
bun test:watch              # watch mode
bun test -- --coverage      # coverage
```

### What to test (by priority)

1. **Zustand stores** — canvas state (add/remove/move nodes, undo/redo)
2. **Service API layer** — request/response serialization with TanStack Query
3. **Components** — NodePalette, Inspector, validation warnings
4. **Canvas interactions** — drag, connect, select (simulated via Testing Library)
5. **AI report rendering** — snapshot/dom tests

### What NOT to test (defer)

- React Flow internals (trust the library)
- Exact pixel/visual output (covered by Playwright E2E)
- Animation behavior (motion, GSAP)

---

## Frontend (E2E with Playwright)

### Install

```bash
bun add -d @playwright/test
bunx playwright install
```

### Configuration (untracked)

`frontend/playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
})
```

### Test structure

```text
frontend/
└── tests-e2e/
    ├── auth.setup.ts         # Login once, reuse session
    ├── auth.spec.ts          # Login / logout flows
    ├── canvas.spec.ts        # Create, drag, delete nodes
    ├── export.spec.ts        # Export as PNG/SVG
    └── ai.spec.ts            # AI architect flow
```

### Running

```bash
bunx playwright test                   # headless
bunx playwright test --ui              # UI mode (recommended for dev)
bunx playwright test --project=chromium
```

### What to test

1. **Auth flow** — signup, login, logout, session expiry
2. **Canvas CRUD** — add node, connect, drag, delete, undo
3. **Architecture validation** — invalid connection shows warning
4. **Save & reopen** — persistence correctness
5. **Export** — file download works
6. **AI assistant** — prompt → response → render
7. **Responsive** — desktop + tablet layout

### What NOT to test

- Visual regressions (add Percy/Loki later if needed)
- Animations (snapshot would be flaky)
- 3D/Three.js scenes (unit test game logic instead)

---

## CI Integration (GitHub Actions)

`.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v6
      - run: uv sync --group test
      - run: uv run ruff check backend/
      - run: uv run pytest --cov=backend --cov-report=term

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
        working-directory: frontend
      - run: bun test
        working-directory: frontend

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
        working-directory: frontend
      - run: bunx playwright install --with-deps
        working-directory: frontend
      - run: bunx playwright test
        working-directory: frontend
```

---

## Coverage Targets

| Layer                 | Minimum          | Stretch  |
| --------------------- | ---------------- | -------- |
| Backend API endpoints | 90%              | 95%      |
| Validation engine     | 95%              | 100%     |
| Export engine         | 90%              | 95%      |
| Frontend stores       | 85%              | 95%      |
| Frontend components   | 70%              | 85%      |
| Frontend E2E paths    | 5 critical flows | 10 flows |

Coverage is a guide, not a gate. Uncovered happy paths are a problem. Uncovered defensive `if` branches usually aren't.

---

## ponytail: Deferrals

- **Snapshot testing** (Percy/Loki) — add only if visual regressions become a problem
- **Load testing** (k6/locust) — add before Phase 3 (Migration Ground) public launch
- **Property-based testing** (Hypothesis) — add if validation engine grows complex rules
- **Component storybook** — not needed while team < 3 people
