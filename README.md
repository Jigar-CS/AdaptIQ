# 🎓 AdaptIQ — Adaptive Placement Preparation Platform

> An intelligent, rule-based adaptive learning platform that personalizes MCQ practice difficulty in real-time based on student performance — purpose-built for placement exam preparation.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Adaptive Engine](#-adaptive-engine)
- [Placement Readiness Score](#-placement-readiness-score)
- [Development Phases](#-development-phases)
- [Getting Started](#-getting-started)
- [Security](#-security)
- [Documentation](#-documentation)

---

## 🧠 Overview

AdaptIQ is a full-stack web application that helps engineering students prepare for placement exams through adaptive MCQ practice. Unlike static question banks, AdaptIQ continuously evaluates student performance in real-time and adjusts question difficulty every 5 questions — making practice sessions smarter and more efficient.

**Core Differentiator:** The adaptive engine is entirely rule-based (no ML/AI), making it transparent, debuggable, and fast — every difficulty decision is logged and explainable.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔄 **Adaptive Testing** | Difficulty auto-adjusts every 5 questions in **all** test modes — topic-wise and full adaptive — using the same rule-based engine |
| 📊 **Placement Readiness Score** | Composite score (0–100) gating access to company mock tests |
| 🏢 **Company Mock Tests** | Timed tests modeled on TCS, Infosys, Accenture, etc. (score-gated at 80% + min 5 misc tests) |
| 📥 **Bulk CSV Import** | Admin uploads up to 600+ questions per topic with full validation & duplicate detection |
| 📈 **Performance Analytics** | Accuracy charts, topic breakdowns, score trend graphs via Recharts |
| 💡 **Smart Recommendations** | Rule-based suggestions highlighting weak topics and difficulty gaps |
| 🔐 **Role-Based Access** | Separate Student and Admin roles with JWT-protected routes |
| 🛡️ **Security First** | Parameterized queries, bcrypt, helmet.js, rate limiting on auth endpoints |
| 👤 **Profile Completion Gate** | After 3 topic-wise tests, students must upload photo & resume and fill placement details before continuing |

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.x-22B5BF)

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing + route guards |
| Axios | API client with interceptors |
| Context API | Auth state & session management |
| Recharts | Performance dashboard charts |
| Tailwind CSS / CSS | Styling |

### Backend
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| mysql2 | Database driver with connection pooling |
| JWT (jsonwebtoken) | Access + refresh token auth |
| bcrypt | Password hashing |
| multer + csv-parser | File upload & streaming CSV parse |
| express-validator | Input validation |
| helmet.js | HTTP security headers |
| express-rate-limit | Brute-force protection on auth |
| Morgan | Request logging |

### Database & Dev Tools
| Technology | Purpose |
|---|---|
| MySQL 8 (via XAMPP) | Relational database |
| phpMyAdmin | DB management UI |
| dotenv | Environment variable management |
| Jest + Supertest | Unit & integration testing |
| Nodemon | Dev server hot-reload |
| Postman / Thunder Client | API testing |

---

## 📁 Project Structure

```
AdaptIQ/
├── backend/
│   ├── config/
│   │   ├── db.js                   # MySQL connection pool
│   │   └── env.js                  # .env validation
│   ├── controllers/                # Thin HTTP handlers (no business logic)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── topicController.js
│   │   ├── questionController.js
│   │   ├── practiceController.js
│   │   ├── adaptiveController.js
│   │   ├── placementScoreController.js
│   │   ├── companyTestController.js
│   │   ├── performanceController.js
│   │   └── recommendationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── practiceRoutes.js
│   │   ├── adaptiveRoutes.js
│   │   ├── companyTestRoutes.js
│   │   ├── performanceRoutes.js
│   │   └── index.js                # Aggregates all routers under /api
│   ├── middleware/
│   │   ├── authenticate.js         # JWT verification
│   │   ├── authorize.js            # Role-based guard
│   │   ├── validate.js             # express-validator wrapper
│   │   ├── errorHandler.js         # Global error handler
│   │   └── rateLimiter.js
│   ├── services/                   # All business logic lives here
│   │   ├── authService.js
│   │   ├── csvImportService.js     # Parse → Validate → Batch insert
│   │   ├── adaptiveEngine.js       # Core rule-based difficulty engine
│   │   ├── placementScoreService.js
│   │   ├── performanceService.js
│   │   └── recommendationService.js
│   ├── models/                     # Data-access layer (SQL queries only)
│   │   ├── User.js
│   │   ├── Topic.js
│   │   ├── Question.js
│   │   ├── Test.js
│   │   ├── UserAnswer.js
│   │   ├── Performance.js
│   │   ├── PlacementScore.js
│   │   ├── CompanyTest.js
│   │   └── ActivityLog.js
│   ├── utils/
│   │   ├── hashUtils.js            # bcrypt wrappers
│   │   ├── jwtUtils.js
│   │   ├── questionHash.js         # SHA-256 for duplicate detection
│   │   └── responseFormatter.js   # Consistent success/error envelope
│   ├── uploads/                    # Temp CSV storage pre-import
│   ├── tests/                      # Jest/Supertest test files
│   ├── app.js                      # Express app + middleware setup
│   └── server.js                   # Entry point
│
├── frontend/src/
│   ├── components/
│   │   ├── common/                 # Button, Card, Modal, LoadingSpinner
│   │   ├── charts/                 # AccuracyPieChart, TopicBarChart, ScoreTrendLine
│   │   ├── questions/              # QuestionCard, OptionSelector, Timer
│   │   └── layout/                 # Navbar, Sidebar, DashboardLayout
│   ├── pages/
│   │   ├── auth/                   # Login, Register, ForgotPassword
│   │   ├── student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TopicPractice.jsx
│   │   │   ├── AdaptiveTest.jsx
│   │   │   ├── CompanyTests.jsx
│   │   │   ├── PerformanceDashboard.jsx
│   │   │   └── Profile.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── TopicManagement.jsx
│   │       ├── QuestionManagement.jsx
│   │       ├── CsvImport.jsx
│   │       ├── UserManagement.jsx
│   │       └── Analytics.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js               # Axios wrapper with token injection
│   │   └── useAdaptiveTest.js      # Manages batch state client-side
│   ├── services/                   # API call isolation (no direct axios in components)
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   ├── questionService.js
│   │   ├── adaptiveService.js
│   │   └── performanceService.js
│   ├── context/
│   │   ├── AuthContext.jsx         # user, token, login/logout
│   │   └── ThemeContext.jsx
│   └── routes/
│       ├── AppRouter.jsx
│       ├── ProtectedRoute.jsx      # Redirects unauthenticated users
│       └── RoleRoute.jsx           # Restricts by role
│
├── database/
│   ├── schema.sql                  # Full CREATE TABLE statements
│   └── seed.sql                    # Sample data for development
│
├── docs/
│   ├── plan.md                     # Full 12-phase build plan
│   ├── skills.md                   # Technology learning roadmap
│   ├── database-schema.md          # Annotated schema with design notes
│   ├── api-endpoints.md            # Complete REST API specification
│   └── folder-structure.md        # Detailed folder annotations
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema

AdaptIQ uses **12 relational tables** in MySQL (3NF normalized, with intentional denormalization in `performance` for read speed).

### Entity Relationship Overview

```
users ──────────┬──< tests
                ├──< user_answers
                ├──< performance
                ├──< placement_score
                ├──< recommendations
                └──< activity_logs

topics ─────────┬──< questions
                └──< performance

tests ──────────┬──< test_questions
                ├──< user_answers
                └──>  company_tests (nullable)

questions ──────┬──< test_questions
                ├──< user_answers
                └──< company_questions

company_tests ──└──< company_questions
```

### Key Tables

| Table | Purpose |
|---|---|
| `users` | Student & admin accounts with role enum |
| `topics` | 10 placement topics (DSA, Aptitude, etc.) |
| `questions` | 6000+ MCQs with SHA-256 hash for duplicate detection |
| `tests` | Test sessions (practice / adaptive / company) |
| `test_questions` | Questions served per session + difficulty at time |
| `user_answers` | Every submitted answer with response time |
| `performance` | Denormalized per-user-per-topic aggregates |
| `placement_score` | Score history (trend graph support) |
| `company_tests` | Company mock test configs |
| `recommendations` | Rule-based weak-topic suggestions |
| `activity_logs` | Full audit trail + adaptive engine decisions |

> 📄 Full annotated schema in [`docs/database-schema.md`](docs/database-schema.md)

---

## 🔌 API Reference

Base URL: `/api` | Auth: `Authorization: Bearer <jwt>` on all protected routes.

**Response envelope (all endpoints):**
```json
{ "success": true, "data": {}, "message": "" }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

### Endpoint Groups

| Group | Prefix | Access |
|---|---|---|
| Authentication | `/auth` | Public |
| Student Profile | `/profile` | Student |
| Topics | `/topics`, `/admin/topics` | Student / Admin |
| Questions | `/admin/questions` | Admin |
| Practice (Non-Adaptive) | ~~`/practice`~~ | *(removed — all tests are adaptive)* |
| Adaptive Test (Topic or Full) | `/adaptive` | Student |
| Placement Score | `/placement-score` | Student |
| Company Tests | `/company-tests`, `/admin/company-tests` | Student / Admin |
| Performance & Analytics | `/performance`, `/admin/analytics` | Student / Admin |
| Recommendations | `/recommendations` | Student |
| Activity Logs | `/admin/activity-logs` | Admin |

### HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | Success (GET, PUT) |
| `201` | Resource created (POST) |
| `400` | Validation error |
| `401` | Missing / invalid token |
| `403` | Valid token, insufficient role (e.g. locked company test) |
| `404` | Resource not found |
| `409` | Conflict (duplicate question, email already registered) |
| `422` | Semantically invalid (e.g. bad CSV row) |
| `500` | Server error |

> 📄 Full endpoint specification in [`docs/api-endpoints.md`](docs/api-endpoints.md)

---

## ⚙️ Adaptive Engine

The adaptive engine (`services/adaptiveEngine.js`) is entirely **rule-based** — no ML, fully transparent, and every decision is logged to `activity_logs`.

### How It Works

Every **5 questions** (one batch), the engine evaluates:

```
batchAccuracy       = correctInBatch / 5
avgResponseTime     = totalTimeInBatch / 5
historicalAccuracy  = weighted average of past batches at this difficulty

IF batchAccuracy >= 0.8 AND avgResponseTime <= topicTimeThreshold:
    → Increase difficulty

ELSE IF batchAccuracy < 0.4 OR avgResponseTime > topicTimeThreshold × 1.5:
    → Decrease difficulty

ELSE:
    → Maintain current difficulty
```

**Rules:**
- Difficulty is bounded: `Easy → Medium → Hard` (cannot go below Easy or above Hard)
- Question selection at any difficulty **excludes already-seen questions** in the active session
- Every difficulty decision is written to `ActivityLogs` for full debuggability

---

## 📊 Placement Readiness Score

Recalculated after every completed **Miscellaneous (full_adaptive) test batch** and persisted to `placement_score` (history, not just latest). **Topic-wise tests do not affect this score.**

```
score = (accuracy × 0.6)
      + (speedScore × 0.2)
      + (difficultyMastery × 0.2)
```

| Component | Weight | Definition |
|---|---|---|
| `accuracy` | 60% | Correct % across all Miscellaneous (full_adaptive) attempts |
| `speedScore` | 20% | Normalized against expected time per difficulty (0–1, higher = faster) |
| `difficultyMastery` | 20% | % of Hard-level questions answered correctly in full_adaptive sessions |

> **Score ≥ 80 AND ≥ 5 Miscellaneous tests completed** unlocks Company Mock Tests.
> - If < 5 misc tests done → *"Complete at least 5 Miscellaneous tests to unlock"*
> - If 5+ tests done but score < 80 → shows full score breakdown so students know exactly what to improve.

---

## 🗓️ Development Phases

| Phase | Week | Description |
|---|---|---|
| **Phase 1** | 1 | Database schema + phpMyAdmin setup |
| **Phase 2** | 1 | Express backend skeleton + MVC structure |
| **Phase 3** | 2 | JWT auth (register/login/refresh) + middleware |
| **Phase 4** | 3 | Admin panel: topic/question/user CRUD |
| **Phase 5** | 3–4 | CSV bulk import with validation + import report |
| **Phase 6** | 4 | Student dashboard shell + profile page |
| **Phase 7** | 5 | Topic-wise adaptive test — same engine, topic-scoped sessions |
| **Phase 8** | 6 | **Adaptive engine** — unified service for topic & full adaptive modes |
| **Phase 9** | 7 | Placement Readiness Score calculation |
| **Phase 10** | 8 | Company mock tests + score-gated unlock |
| **Phase 11** | 9 | Analytics dashboard + charts + recommendations |
| **Phase 12** | 10 | Security hardening, testing, deployment |

> 📄 Full detailed plan in [`docs/plan.md`](docs/plan.md)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- XAMPP (MySQL 8 + phpMyAdmin)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Jigar-CS/AdaptIQ.git
cd AdaptIQ
```

### 2. Set up the database

1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin → Create a database named `adaptiq`
3. Import `database/schema.sql`
4. (Optional) Import `database/seed.sql` for sample data

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=adaptiq
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Install dependencies and start:
```bash
npm install
npm run dev
```

### 4. Configure the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (Vite) and the API at `http://localhost:5000/api`.

---

## 🔒 Security

| Concern | Mitigation |
|---|---|
| SQL Injection | Parameterized queries (`mysql2` prepared statements) everywhere |
| XSS | Output sanitization on all user-generated content |
| Brute Force | `express-rate-limit` on `/auth/login` |
| Sensitive Data | Passwords hashed with `bcrypt` (no plaintext storage) |
| HTTP Headers | `helmet.js` for security headers |
| Auth | Short-lived JWTs (15m) + refresh tokens (7d) |
| Role Abuse | `authorize(role)` middleware on every admin route |
| CSV Corruption | Validate-then-insert in transactions; bad rows rejected with reasons, never silently inserted |

---

## 📚 Documentation

| Document | Description |
|---|---|
| [`docs/plan.md`](docs/plan.md) | Full 12-phase development plan with tasks, deliverables, and exit criteria |
| [`docs/skills.md`](docs/skills.md) | Technology learning roadmap mapped to build phases |
| [`docs/database-schema.md`](docs/database-schema.md) | Full annotated SQL schema with design decisions |
| [`docs/api-endpoints.md`](docs/api-endpoints.md) | Complete REST API specification with request/response examples |
| [`docs/folder-structure.md`](docs/folder-structure.md) | Detailed folder annotations explaining the MVC architecture |

---

## ⚠️ Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| 6000+ questions makes random selection slow | Index `(topic_id, difficulty)`, avoid `ORDER BY RAND()` — use offset-based selection |
| Adaptive engine oscillates difficulty | Batch-of-5 evaluation only + every decision logged to `activity_logs` |
| CSV import with bad data corrupts question bank | Validate → insert in a transaction; reject bad rows with reasons, never partial silent corruption |
| Score gate frustrates near-80% students | Show full score breakdown — students see exactly what to improve |

---

<div align="center">
  <p>Built for placement preparation · Rule-based adaptive engine · No ML required</p>
  <p><strong>AdaptIQ</strong> — Learn smarter, not harder.</p>
</div>
