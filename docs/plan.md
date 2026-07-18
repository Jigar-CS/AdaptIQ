# Project Plan — AI-Powered Adaptive Aptitude Assessment & Learning Platform

## 1. Overview

A full-stack web platform where students practice aptitude questions and the system adjusts difficulty using a **rule-based adaptive engine** (no ML). Admins manage a question bank of 6000+ questions imported via CSV. Students get a Placement Readiness Score, weak/strong topic analysis, and company-specific mock tests.

**Stack:** React + Node/Express + MySQL + JWT, dev via XAMPP/phpMyAdmin.

This plan is written as a sequence of **12 phases**, each with tasks, deliverables, and exit criteria. Build strictly in this order — later phases depend on earlier ones (e.g., the adaptive engine needs Tests/UserAnswers tables and auth working first).

---

## 2. Phase-by-Phase Plan

### Phase 1 — Database Design (Week 1)
**Tasks**
- Finalize ER diagram for all 12 tables (see `database-schema.md`)
- Create schema in MySQL via phpMyAdmin/XAMPP
- Add indexes on foreign keys and frequently filtered columns (`topic_id`, `difficulty`, `user_id`)
- Seed 2–3 topics with ~20 sample questions each for early dev/testing

**Deliverable:** `schema.sql`, ER diagram, seeded dev database
**Exit criteria:** All tables created with correct FK constraints; can run test queries in phpMyAdmin

---

### Phase 2 — Backend Skeleton (Week 1–2)
**Tasks**
- Initialize Express app with MVC structure (see `folder-structure.md`)
- Set up `config/db.js` (MySQL connection pool via `mysql2`)
- Set up global error-handling middleware and consistent JSON response format:
  ```json
  { "success": true, "data": {}, "message": "" }
  { "success": false, "error": { "code": "", "message": "" } }
  ```
- Set up environment config (`.env` for DB creds, JWT secret)
- Add request logging (morgan) and CORS

**Deliverable:** Running Express server with health-check route
**Exit criteria:** `GET /api/health` returns 200 with DB connection confirmed

---

### Phase 3 — Authentication & Authorization (Week 2)
**Tasks**
- `POST /api/auth/register` (student) — bcrypt hash password, validate input
- `POST /api/auth/login` — issue JWT (short-lived access token + refresh token)
- `POST /api/auth/forgot-password` — token-based reset flow (email or OTP stub)
- Middleware: `authenticate` (verify JWT), `authorize(role)` (student/admin)
- Rate-limit login endpoint to prevent brute force

**Deliverable:** Full auth module + protected route middleware
**Exit criteria:** Student and Admin can register/login; protected routes reject invalid/missing tokens

---

### Phase 4 — Admin Panel Backend + Frontend (Week 3)
**Tasks**
- Admin CRUD APIs: Topics, Questions, Users
- Admin dashboard UI: topic list, question list with filters (topic/difficulty), user management table
- Role-guarded routes on frontend (React Router + context-based auth guard)

**Deliverable:** Admin can manually create/edit/delete topics and questions end-to-end
**Exit criteria:** CRUD verified through UI, not just Postman

---

### Phase 5 — CSV Import Pipeline (Week 3–4)
**Tasks**
- Admin upload UI (drag-and-drop CSV per topic)
- Backend: `multer` for upload → `csv-parser` for streaming parse
- Validation layer before insert:
  - Missing required fields (question text, options, correct answer, difficulty)
  - Duplicate detection (hash of normalized question text within topic)
  - Invalid difficulty value (must be Easy/Medium/Hard)
  - Invalid answer key (must match one of the provided options)
- Return an import report: `{ inserted, skipped, errors: [{row, reason}] }`
- Batch insert (transactions) for performance with 600+ rows per file

**Deliverable:** CSV import service + admin-facing import report UI
**Exit criteria:** Importing a 600-row CSV completes in <10s, invalid rows rejected with reasons, no duplicates inserted

---

### Phase 6 — Student Dashboard (Week 4)
**Tasks**
- Student registration/login flow (frontend)
- Dashboard shell: nav, profile summary, quick stats placeholders
- Profile page (edit name, email, password change)

**Deliverable:** Student can log in and see a working dashboard shell
**Exit criteria:** Auth-guarded student routes render correctly; logout works

---

### Phase 7 — Topic-wise Practice (Week 5)
**Tasks**
- `GET /api/practice/:topicId` — fetch N random questions at a chosen difficulty, excluding previously seen questions in the active session
- Question attempt flow: submit answer → `POST /api/answers` → store in `UserAnswers` (with response time)
- Immediate feedback (correct/incorrect + explanation if available)
- Prevent question repeats within same test session (track served question IDs per session)

**Deliverable:** Full non-adaptive practice mode, fully functional
**Exit criteria:** Student can complete a practice set with no repeated questions and see instant results

---

### Phase 8 — Adaptive Engine (Week 6) — Core Feature
**Tasks**
- Implement as a standalone backend service: `services/adaptiveEngine.js`
- Track state per test session: current difficulty, batch counter, running accuracy/time
- **Every 5 questions**, run evaluation:
  ```
  batchAccuracy = correctInBatch / 5
  avgResponseTime = totalTimeInBatch / 5
  historicalAccuracy = weighted avg of past batches at this difficulty

  IF batchAccuracy >= 0.8 AND avgResponseTime <= topicTimeThreshold:
      increaseDifficulty()
  ELSE IF batchAccuracy < 0.4 OR avgResponseTime > topicTimeThreshold * 1.5:
      decreaseDifficulty()
  ELSE:
      keepSameDifficulty()
  ```
- Difficulty floor/ceiling: cannot go below Easy or above Hard
- Log every decision to `ActivityLogs` for transparency/debugging
- Ensure question selection at new difficulty excludes already-seen questions

**Deliverable:** Adaptive test mode where difficulty visibly shifts based on performance
**Exit criteria:** Manually verified — a student answering 5 easy questions correctly gets bumped to medium; struggling drops back down

---

### Phase 9 — Placement Readiness Score (Week 7)
**Tasks**
- Scoring service, recalculated after every completed adaptive batch:
  ```
  score = (accuracy * 0.5) + (speedScore * 0.2) + (difficultyMastery * 0.2) + (topicCoverage * 0.1)
  ```
  - `accuracy`: overall correct % across all attempts
  - `speedScore`: normalized against expected time per difficulty
  - `difficultyMastery`: % of Hard-level questions answered correctly
  - `topicCoverage`: fraction of the 10 topics attempted with sufficient volume
- Store snapshot in `PlacementScore` table (historical trend, not just latest)
- Expose `GET /api/placement-score` for dashboard + unlock logic

**Deliverable:** Live, recalculating Placement Readiness Score
**Exit criteria:** Score updates correctly after each adaptive batch and persists history

---

### Phase 10 — Company Tests & Unlock Logic (Week 8)
**Tasks**
- `CompanyTests` + `CompanyQuestions` CRUD (admin side): time limit, question count, difficulty distribution per company (TCS, Infosys, Accenture, etc.)
- Student-facing "Miscellaneous Test" page with two cards:
  - Adaptive Test — always available
  - Company Mock Test — locked unless `placementScore >= 80`, else show the specified unlock message
- Timed test-taking flow with auto-submit on timeout
- Result analysis screen per company test (score, section-wise breakdown)

**Deliverable:** Company test module with score-gated access
**Exit criteria:** Locked/unlocked states behave correctly at the 80% boundary

---

### Phase 11 — Analytics, Recommendations & Charts (Week 9)
**Tasks**
- `Performance` aggregation queries: accuracy, avg time, topic-wise breakdown
- Recommendation rules engine (simple conditionals, e.g. `topicAccuracy < 50% → "You are weak in {topic}"`)
- Dashboard visualizations with Recharts: accuracy pie chart, topic bar chart, score trend line graph
- Attempt history table with filters

**Deliverable:** Full performance dashboard
**Exit criteria:** Charts render real data end-to-end; recommendations reflect actual weak topics

---

### Phase 12 — Security Hardening, Testing & Deployment (Week 10)
**Tasks**
- Audit: parameterized queries everywhere (no string-concatenated SQL), input validation on every route (`express-validator` or `joi`), XSS sanitization on rendered user content, helmet.js headers
- Load-test CSV import and adaptive engine endpoints
- Write a minimal test suite (Jest/Supertest) for auth, adaptive engine logic, and score calculation — these are the highest-risk-of-bug areas
- Prepare deployment: environment separation (dev/prod `.env`), production build of React app, deployment doc for your DB host + Node host

**Deliverable:** Hardened, tested, deployable application
**Exit criteria:** No SQL injection/XSS on manual pentest pass; core logic covered by automated tests

---

## 3. Milestone Checklist

- [ ] Phase 1 — Database live in phpMyAdmin
- [ ] Phase 2 — Backend skeleton running
- [ ] Phase 3 — Auth working (student + admin)
- [ ] Phase 4 — Admin CRUD complete
- [ ] Phase 5 — CSV import validated and working at scale
- [ ] Phase 6 — Student dashboard shell live
- [ ] Phase 7 — Topic practice functional
- [ ] Phase 8 — Adaptive engine verified with real difficulty shifts
- [ ] Phase 9 — Placement score calculating and persisting
- [ ] Phase 10 — Company tests + unlock logic working
- [ ] Phase 11 — Analytics/recommendations dashboard complete
- [ ] Phase 12 — Security audit passed, deployed

## 4. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| 6000+ questions makes random selection slow | Index `(topic_id, difficulty)`, avoid `ORDER BY RAND()` on large tables — use offset-based or pre-shuffled selection |
| Adaptive engine oscillates difficulty unpredictably | Batch-of-5 evaluation only (already specified) + log every decision for debuggability |
| CSV import with bad data corrupts question bank | Validate-then-insert in a transaction; reject the whole batch or the specific bad rows, never partial silent corruption |
| Placement score gate frustrates students near 80% | Show score breakdown so students know exactly what to improve, not just a locked message |

## 5. Suggested File Companions
See also: `skills.md`, `database-schema.md`, `api-endpoints.md`, `folder-structure.md` (generated alongside this plan).
