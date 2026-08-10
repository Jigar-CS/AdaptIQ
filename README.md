# 🎓 AdaptIQ — Adaptive Placement Preparation Platform

> An intelligent, rule-based adaptive learning platform that personalizes MCQ practice difficulty in real-time based on student performance — purpose-built for placement exam preparation.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [User Stories](#-user-stories)
- [Use Cases](#-use-cases)
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

## 🧾 User Stories

| ID | Actor | User Story |
|---|---|---|
| US-01 | Student | As a student, I want to register on AdaptIQ so that I can create my personal learning account. |
| US-02 | Student | As a student, I want to securely log in so that I can access my personalized dashboard and assessments. |
| US-03 | Student | As a student, I want to select a specific aptitude topic so that I can practice that topic individually. |
| US-04 | Student | As a student, I want to attempt an adaptive test so that the difficulty of subsequent questions can respond to my performance. |
| US-05 | Student | As a student, I want the first batch of questions to assess my initial ability so that the system can understand my current performance level. |
| US-06 | Student | As a student, I want the next batch of questions to be selected according to my performance so that I can receive more relevant practice. |
| US-07 | Student | As a student, I want the system to avoid repeating questions that I have already attempted in the current assessment so that my test remains meaningful. |
| US-08 | Student | As a student, I want to see my topic-wise performance so that I can identify the areas in which I am strong or weak. |
| US-09 | Student | As a student, I want to see my difficulty-wise performance so that I can understand how I perform on Easy, Medium, and Hard questions. |
| US-10 | Student | As a student, I want to view my previous test attempts so that I can track my preparation progress over time. |
| US-11 | Student | As a student, I want to receive AI-generated feedback so that I can understand my strengths, weaknesses, and areas requiring improvement. |
| US-12 | Student | As a student, I want personalized recommendations so that I know which topics I should revise or practice next. |
| US-13 | Student | As a student, I want to view my placement readiness so that I can understand my current level of preparation. |
| US-14 | Student | As a student, I want to attempt miscellaneous aptitude tests so that I can evaluate my preparation across multiple topics. |
| US-15 | Student | As a student, I want to attempt company-oriented mock tests so that I can practice for specific placement recruitment patterns. |
| US-16 | Student | As a student, I want to view my learning trends so that I can understand whether my performance is improving over time. |
| US-17 | Student | As a student, I want to manage my profile so that my personal information remains updated. |
| US-18 | Administrator | As an administrator, I want to securely log in so that only authorized users can access administrative functions. |
| US-19 | Administrator | As an administrator, I want to manage student accounts so that I can maintain the platform's user database. |
| US-20 | Administrator | As an administrator, I want to add aptitude topics so that the platform can support different areas of preparation. |
| US-21 | Administrator | As an administrator, I want to add, edit, and delete questions so that I can maintain the question bank. |
| US-22 | Administrator | As an administrator, I want to assign a topic and difficulty level to each question so that the adaptive engine can select appropriate questions. |
| US-23 | Administrator | As an administrator, I want to import questions using CSV files so that I can add a large number of questions efficiently. |
| US-24 | Administrator | As an administrator, I want to manage company-oriented mock tests so that students can practice company-specific assessments. |
| US-25 | Administrator | As an administrator, I want to view platform and student performance analytics so that I can monitor the effectiveness of the platform. |
| US-26 | Administrator | As an administrator, I want to manage the question bank efficiently so that sufficient questions are available for adaptive assessment. |

---

## 🧩 Use Cases

### Actors

- Student
- Administrator
- Adaptive Decision Engine (ADE)
- Question Selection Engine (QSE)
- AI Learning Agent (AILA)

### UC-01: Student Registration

**Actor:**  
Student

**Description:**  
Allows a new student to create an AdaptIQ account.

**Preconditions:**
- Student does not already have an account.

**Main Flow:**
1. Student opens the registration page.
2. Student enters the required information.
3. System validates the information.
4. System securely stores the credentials.
5. System creates the account.
6. Student can log in.

**Postconditions:**
- Student account is created.

### UC-02: Student Login

**Actor:**  
Student

**Description:**  
Allows a registered student to securely access AdaptIQ.

**Main Flow:**
1. Student enters credentials.
2. System validates credentials.
3. System authenticates the student.
4. System generates an authentication token.
5. Student is redirected to the dashboard.

**Postconditions:**
- Student is authenticated.

### UC-03: Start Topic-wise Adaptive Test

**Actor:**  
Student

**Description:**  
Allows a student to begin an adaptive assessment for a selected aptitude topic.

**Main Flow:**
1. Student selects a topic.
2. System checks question availability.
3. System initializes the assessment.
4. System loads Batch 1 containing five diagnostic questions.
5. Student attempts the questions.
6. System records responses.

**Postconditions:**
- First batch is completed and performance data is available.

### UC-04: Evaluate Student Batch Performance

**Actor:**  
Adaptive Decision Engine

**Description:**  
Analyzes student performance after a batch of five questions.

**Main Flow:**
1. Student submits the batch.
2. System records responses.
3. System identifies the difficulty of each question.
4. System calculates difficulty-wise performance.
5. System updates performance history.
6. Performance data is passed to the ADE.

**Postconditions:**
- Updated performance is available for adaptive decision-making.

### UC-05: Determine Next Question Difficulty

**Actor:**  
Adaptive Decision Engine

**Description:**  
Determines the difficulty distribution for the next batch.

**Main Flow:**
1. ADE receives performance data.
2. ADE compares Easy, Medium, and Hard performance.
3. ADE ranks difficulty levels according to observed performance.
4. ADE identifies relatively weaker and stronger difficulty levels.
5. ADE generates the next difficulty distribution.
6. ADE sends the distribution to the QSE.

**Postconditions:**
- Difficulty distribution for the next batch is determined.

### UC-06: Select Next Questions

**Actor:**  
Question Selection Engine

**Description:**  
Retrieves actual questions that satisfy the difficulty distribution.

**Main Flow:**
1. QSE receives topic and difficulty distribution.
2. QSE checks the question bank.
3. QSE excludes previously attempted question IDs.
4. QSE retrieves eligible questions.
5. QSE selects the required number of questions.
6. QSE returns the questions.

**Postconditions:**
- Next batch of five questions is generated.

### UC-07: Complete Adaptive Assessment

**Actors:**  
Student, ADE, QSE

**Description:**  
Manages the complete 20-question adaptive assessment.

**Main Flow:**
1. Student starts the test.
2. System loads Batch 1.
3. Student answers five questions.
4. System evaluates performance.
5. ADE determines the next difficulty distribution.
6. QSE retrieves Batch 2.
7. Student answers Batch 2.
8. System updates performance.
9. ADE determines the next difficulty distribution.
10. QSE retrieves Batch 3.
11. Student answers Batch 3.
12. System updates performance.
13. ADE determines the next difficulty distribution.
14. QSE retrieves Batch 4.
15. Student completes the final five questions.
16. System generates final performance results.

**Postconditions:**
- A 20-question adaptive assessment is completed.

### UC-08: Generate AI Learning Feedback

**Actor:**  
AI Learning Agent

**Description:**  
Provides personalized learning guidance based on student performance.

**Main Flow:**
1. Student completes the assessment.
2. System collects performance information.
3. Information is provided to AILA.
4. AILA analyzes strengths and weaknesses.
5. AILA generates feedback.
6. AILA recommends revision areas.
7. Recommendations are shown to the student.

**Postconditions:**
- Personalized feedback is available.

### UC-09: View Performance Analytics

**Actor:**  
Student

**Description:**  
Allows students to analyze preparation progress.

**Main Flow:**
1. Student opens the analytics dashboard.
2. System retrieves performance history.
3. System displays topic-wise performance.
4. System displays difficulty-wise performance.
5. System displays learning trends.
6. Student reviews performance.

**Postconditions:**
- Student can understand current learning progress.

### UC-10: View Placement Readiness

**Actor:**  
Student

**Description:**  
Provides an overview of the student's placement preparation.

**Main Flow:**
1. Student opens Placement Readiness.
2. System retrieves relevant performance data.
3. System analyzes topic and assessment performance.
4. System displays placement preparation status.
5. System highlights improvement areas.

**Postconditions:**
- Student receives placement readiness information.

### UC-11: Attempt Miscellaneous Test

**Actor:**  
Student

**Description:**  
Allows students to evaluate aptitude preparation across multiple topics.

**Main Flow:**
1. Student selects a Miscellaneous Test.
2. System selects questions from configured topics.
3. Student attempts the test.
4. System evaluates responses.
5. Results are stored.
6. Analytics are updated.

**Postconditions:**
- Overall aptitude performance is available.

### UC-12: Attempt Company Mock Test

**Actor:**  
Student

**Description:**  
Allows students to practice company-oriented placement assessments.

**Main Flow:**
1. Student selects a company mock test.
2. System loads the configured assessment.
3. Student attempts the test.
4. System evaluates responses.
5. Result is stored.
6. Performance is displayed.

**Postconditions:**
- Company-oriented mock test result is available.

### UC-13: Manage Questions

**Actor:**  
Administrator

**Description:**  
Allows the administrator to maintain the question bank.

**Main Flow:**
1. Administrator opens question management.
2. Administrator adds, edits, or deletes questions.
3. Administrator specifies the topic and difficulty.
4. System validates the information.
5. System updates the question bank.

**Postconditions:**
- Question bank is updated.

### UC-14: Import Questions Using CSV

**Actor:**  
Administrator

**Description:**  
Allows the administrator to bulk import questions.

**Main Flow:**
1. Administrator selects a CSV file.
2. System validates the file.
3. System validates the question fields.
4. System validates the topic and difficulty.
5. Valid questions are inserted into MySQL.
6. Invalid records are reported.

**Postconditions:**
- Valid questions are added to the question bank.

### UC-15: Manage Users

**Actor:**  
Administrator

**Description:**  
Allows the administrator to manage registered users.

**Main Flow:**
1. Administrator opens user management.
2. System displays users.
3. Administrator views or manages user information.
4. System applies authorized changes.

**Postconditions:**
- User information is maintained.

### UC-16: Manage Company Tests

**Actor:**  
Administrator

**Description:**  
Allows the administrator to create and maintain company-oriented mock tests.

**Main Flow:**
1. Administrator opens company test management.
2. Administrator creates or edits a company test.
3. Administrator configures test parameters and questions.
4. System validates the configuration.
5. System saves the test.

**Postconditions:**
- Company mock test is available according to its configuration.

### Adaptive Workflow Summary

Student
  ↓
Start Adaptive Test
  ↓
Batch of 5 Questions
  ↓
Submit Answers
  ↓
Calculate Difficulty-wise Performance
  ↓
Adaptive Decision Engine
  ↓
Difficulty Distribution
  ↓
Question Selection Engine
  ↓
Next 5 Questions
  ↓
Repeat Until 20 Questions
  ↓
Performance Analytics
  ↓
AI Learning Agent
  ↓
Personalized Feedback & Recommendations

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
