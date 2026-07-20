# AdaptIQ — Master Build Plan (Final)

> **Stack:** React 18 + Vite · Node/Express · MySQL 8 (XAMPP/phpMyAdmin) · JWT Auth
> **Last assessed:** July 2026
> This is the authoritative plan. It replaces `plan.md` and `plan_new.md`. Where the two disagreed, **this document follows `plan_new.md`'s corrected logic**, since it reflects the actual current state of the codebase and the latest agreed decisions. `plan.md`'s original phase structure, risk table, and milestone framing are preserved where they still add value.

---

## 1. Overview

A full-stack web platform where students practice aptitude questions and a **rule-based adaptive engine** (no ML) adjusts difficulty in real time. Admins manage a question bank of 6000+ questions imported via CSV. Students get a Placement Readiness Score, weak/strong topic analysis, and company-specific mock tests gated behind performance thresholds.

Build strictly in phase order below — later phases depend on earlier ones (the adaptive engine needs `tests`/`user_answers` tables and auth working first; the profile gate needs the adaptive engine's completion hook; placement score needs full_adaptive history; company tests need placement score).

---

## 2. Current State Assessment (as of last codebase review)

### ✅ Already Done
| Area | What Exists |
|---|---|
| Backend skeleton | `app.js`, `server.js`, CORS, helmet, morgan, rate limiter, error handler wired up |
| DB schema | All 12 tables created in `schema.sql` (outdated — needs migration, see Phase 1) |
| Auth backend | Register, login, refresh token fully working (`authService.js`, `authController.js`, `authRoutes.js`) |
| Middleware | `authenticate.js`, `authorize.js`, `validate.js`, `errorHandler.js`, `rateLimiter.js` all working |
| Utils | `hashUtils.js` (bcrypt), `jwtUtils.js`, `questionHash.js` (SHA-256), `responseFormatter.js` |
| Models | `User.js` (findByEmail, findById, create, updateProfile, updatePassword), `Topic.js` |
| Topic CRUD | Admin create/update/delete + student list — fully wired routes + controllers |
| Frontend skeleton | Vite + React 18, React Router v6, Axios, Recharts installed |
| Auth pages | `Login.jsx`, `Register.jsx` working with API |
| Auth context | `AuthContext.jsx` — user/token state, login/logout |
| Routing | `AppRouter.jsx`, `ProtectedRoute.jsx` — route guards working |
| API client | `apiClient.js` — Axios instance with token injection, `authService.js` |
| Dashboards | `Dashboard.jsx` (student) and `AdminDashboard.jsx` — shells with stub data |
| Stub routes | All future routes stubbed with `{ success: true, message: 'Not yet implemented' }` |

### ❌ Not Yet Done
- Profile fields in DB + profile completion gate
- `schema.sql` migration to match current design decisions
- Question model + CRUD, CSV import pipeline
- Adaptive engine, topic-wise and miscellaneous (full_adaptive) test flows
- Placement Readiness Score calculation
- Company mock tests + dual-condition unlock logic
- Performance aggregation, analytics dashboard, recommendations engine
- All frontend pages beyond shells
- File upload infrastructure (photos, resumes)
- Security hardening, testing, deployment prep

---

## 3. Phase-by-Phase Plan

### Phase 1 — Database Migration & Schema Sync
> `schema.sql` exists but is out of sync with current design decisions.

**Tasks**
- Update `schema.sql`:
  - `tests.test_type` ENUM → `'topic_adaptive', 'full_adaptive', 'company'` (drop old `'practice'/'adaptive'` values — **there is no separate non-adaptive practice mode**; every student-facing test is adaptive)
  - `tests.topic_id INT NULL` with FK to `topics` — scopes `topic_adaptive` sessions; `NULL` for `full_adaptive`
  - `users`: add profile fields — `phone`, `college`, `branch`, `graduation_year`, `cgpa`, `linkedin_url` (optional), `profile_photo_path`, `resume_path`
  - `users`: add gate flags — `profile_prompt_triggered BOOLEAN DEFAULT FALSE`, `is_profile_complete BOOLEAN DEFAULT FALSE`
  - `users`: add `updated_at` if missing
  - `placement_score`: remove unused `topic_coverage_component` column; add inline comments on remaining columns
  - `test_questions`: confirm `UNIQUE KEY uniq_test_question (test_id, question_id)` exists — this is the DB-level guarantee against repeated questions in a session
- Add indexes on FKs and frequently filtered columns: `topic_id`, `difficulty`, `user_id`
- Run updated schema against XAMPP/phpMyAdmin, verify constraints hold
- Update `seed.sql`: 3–5 topics, 20+ sample questions each (Easy/Medium/Hard mix)

**Deliverable:** `database/schema.sql` (updated), `database/seed.sql` (expanded), ER diagram
**Exit criteria:** Fresh import of schema + seed runs without errors; all 12 tables visible with correct columns and FKs

---

### Phase 2 — Backend Skeleton ✅ Done
**Already done:** Express app with helmet, CORS, morgan, body parsing, rate limiter, error handler; `authenticate.js` + `authorize.js` solid.

**Remaining micro-tasks**
- Add explicit `GET /api/health` route that pings the DB and returns `{ db: 'ok' }`
- Ensure `.env.example` is current with all required keys

**Exit criteria:** `GET /api/health` returns 200 with DB connection confirmed

---

### Phase 3 — Authentication & Authorization ✅ Mostly Done
**Already done:** `POST /auth/register` (bcrypt hash, duplicate email check), `POST /auth/login` (JWT pair), `POST /auth/refresh`; frontend `Login.jsx`, `Register.jsx`, `AuthContext.jsx`, `ProtectedRoute.jsx`.

**Remaining micro-tasks**
- Add `POST /auth/logout` (client-side token discard is sufficient; optionally blacklist refresh tokens)
- Add `POST /auth/forgot-password` stub (returns 501 for now — full flow out of scope)
- Add `routes/RoleRoute.jsx` frontend component to gate admin-only pages by role (currently only generic `ProtectedRoute` exists)
- Rate-limit login endpoint against brute force (verify limiter is tight enough, e.g. 5 attempts/15min)

**Exit criteria:** Student and Admin can register/login; protected routes reject invalid/missing tokens; admin routes reject student tokens

---

### Phase 4 — Profile Page + File Uploads + Profile Gate

**Backend tasks**
- Migrate `users` table per Phase 1
- `models/User.js`: `findById` (all profile fields), `updateProfile(id, fields)`, `updatePhotoPath(id, path)`, `updateResumePath(id, path)`, `checkProfileComplete(id)`, `triggerProfilePrompt(id)`
- `controllers/userController.js`: `GET /profile`, `PUT /profile` (re-checks completeness on every update), `PUT /profile/password`, `POST /profile/photo` (multer, image only, max 5MB), `POST /profile/resume` (multer, PDF only, max 10MB)
- `middleware/profileGate.js`:
  - If `profile_prompt_triggered = TRUE` and `is_profile_complete = FALSE` → `403` with `{ "code": "PROFILE_INCOMPLETE", "message": "Please complete your profile to continue taking tests." }`
  - Applied to **every** `POST /adaptive/start` call, regardless of `test_type`
- **Trigger logic:** after a student's **3rd completed `topic_adaptive` test**, set `profile_prompt_triggered = TRUE` (implemented as part of the adaptive completion hook in Phase 7, not a separate poller)
- `is_profile_complete` is computed **server-side only** — set to `TRUE` once all required fields are non-NULL. Client cannot fake completion.
- Serve `/uploads` as static; store files under UUID filenames (not original names) to prevent path traversal
- Required profile fields for the gate: `phone`, `college`, `branch`, `graduation_year`, `cgpa`, `profile_photo_path`, `resume_path` (LinkedIn URL stays optional)

**Frontend tasks**
- `pages/student/Profile.jsx`: full field display/edit form, photo upload with preview, resume upload with filename + download link, completion progress indicator
- Profile completion banner/modal on `Dashboard.jsx`, shown after the 3rd topic test
- `services/profileService.js`: `PUT /profile`, `POST /profile/photo`, `POST /profile/resume`

**Deliverable:** Full profile page with uploads + profile-gate middleware
**Exit criteria:** Student can upload photo + resume; after the 3rd topic-wise test, a 4th test-start attempt without a complete profile returns `403 PROFILE_INCOMPLETE`; completing the profile lifts the block immediately; dashboard/analytics remain viewable throughout (only test-start is blocked)

---

### Phase 5 — Admin Panel: Question CRUD + CSV Import

**Backend tasks**
- `models/Question.js`: `findAll({topic_id, difficulty, page, limit})`, `findById`, `create` (with `question_hash`), `update`, `softDelete` (`is_active = FALSE`), `existsByHash(topic_id, hash)`
- `controllers/questionController.js`
- `services/csvImportService.js`:
  - `multer` disk storage → `csv-parser` streaming parse (never load full file into memory)
  - Per-row validation: required fields present (`question_text`, `option_a–d`, `correct_option`, `difficulty`); `correct_option` normalized to `A/B/C/D`; `difficulty` normalized to `Easy/Medium/Hard`; `question_text` non-empty after trim
  - SHA-256 hash of normalized `question_text` per topic — skip duplicates (DB-enforced via unique constraint, not just app-level, so concurrent imports stay safe)
  - Batch insert in a transaction, chunked (~100 rows/insert)
  - Return `{ total_rows, inserted, skipped_duplicates, errors: [{row, reason}] }`
- Routes: `GET/POST/PUT/DELETE /admin/questions`, `POST /admin/questions/import`

**Frontend tasks**
- `pages/admin/QuestionManagement.jsx` — paginated table with topic/difficulty filters, add/edit modal, delete with confirmation
- `pages/admin/CsvImport.jsx` — drag-and-drop upload, required topic selector, import report (success/skipped/error table with row + reason)
- `pages/admin/TopicManagement.jsx` — topic list + add/edit/delete modal (replaces current admin-dashboard stub)

**Deliverable:** Full admin question management + CSV import
**Exit criteria:** A 600-row CSV imports in <10s; invalid rows rejected with reasons; no duplicates inserted; imported questions appear in the filtered list

---

### Phase 6 — Admin Panel: User Management + Analytics Shell

**Backend tasks**
- `userController.js` admin functions: `GET /admin/users` (paginated, searchable), `GET /admin/users/:id`, `PUT /admin/users/:id` (role, active toggle), `DELETE /admin/users/:id` (soft delete)
- `controllers/analyticsController.js`: `GET /admin/analytics/overview` (users, questions per topic, platform avg accuracy), `GET /admin/analytics/topic-difficulty` (question count by topic × difficulty)

**Frontend tasks**
- `pages/admin/UserManagement.jsx` — sortable/searchable table, activate/deactivate toggle
- `pages/admin/Analytics.jsx` — basic charts
- Replace `AdminDashboard.jsx` stub cards with real stats

**Deliverable:** Admin can manage users and see platform stats
**Exit criteria:** Admin can activate/deactivate students; analytics endpoints return real data

---

### Phase 7 — Adaptive Engine (Core Feature)
> The heart of the platform. Topic-wise and miscellaneous tests share one engine.

**Backend tasks**
- `models/Test.js`: `create({user_id, test_type, topic_id, company_test_id})`, `findById`, `complete(id)`, `countCompletedByType(user_id, test_type)`
- `models/TestQuestion.js`: `addQuestion(...)`, `getServedQuestionIds(test_id)`
- `models/UserAnswer.js`: `submit(...)`, `getBatchAnswers(test_id, batch_number)`
- `services/adaptiveEngine.js` — evaluated **every 5 questions**:
  ```
  batchAccuracy = correctInBatch / 5
  avgResponseTime = totalTimeInBatch / 5

  IF batchAccuracy >= 0.8 AND avgResponseTime <= topicTimeThreshold:
      increaseDifficulty()   // Easy→Medium, Medium→Hard, Hard stays Hard
  ELSE IF batchAccuracy < 0.4 OR avgResponseTime > topicTimeThreshold * 1.5:
      decreaseDifficulty()   // Hard→Medium, Medium→Easy, Easy stays Easy
  ELSE:
      keepSameDifficulty()
  ```
  - Difficulty floor/ceiling enforced: never below Easy, never above Hard
  - Log every decision to `activity_logs`: `{ test_id, test_type, topic_id, batch_number, batch_accuracy, avg_response_time, old_difficulty, new_difficulty }`
- `services/questionSelector.js`: `getNextBatch({topic_id, difficulty, exclude_ids, limit: 5})` — **offset-based selection, never `ORDER BY RAND()`** (catastrophic on 6000+ rows); filters by `topic_id` for `topic_adaptive`, spans all topics for `full_adaptive`; always excludes already-served question IDs (backed by the `uniq_test_question` unique key)
- `controllers/adaptiveController.js`:
  - `POST /adaptive/start` — body: `{ topic_id? }`. Present `topic_id` → `topic_adaptive` (topic-scoped); omitted → `full_adaptive` (cross-topic). Runs `profileGate` first. Starts at `Easy`, or the student's last-known difficulty for that topic if prior history exists.
  - `GET /adaptive/:testId/next-batch`
  - `POST /adaptive/:testId/answer` — stores the answer with `response_time_seconds`; on every 5th answer, runs `evaluateBatch` and selects the next batch's difficulty; returns immediate feedback (correct/incorrect + explanation if available)
  - `GET /adaptive/:testId/status`
  - `POST /adaptive/:testId/complete` — marks complete; if `test_type = 'full_adaptive'`, triggers placement score recalculation (Phase 8); if `test_type = 'topic_adaptive'`, recounts completed topic tests and sets `profile_prompt_triggered = TRUE` once the count reaches 3
- Replace stubs in `studentRoutes.js`

**Frontend tasks**
- `hooks/useAdaptiveTest.js` — batch state, difficulty, submission, completion
- `pages/student/TopicPractice.jsx` — topic selector → starts `topic_adaptive`
- `pages/student/AdaptiveTest.jsx` — shared test-taking UI (options, per-question timer, immediate feedback, difficulty indicator, batch progress bar, continue/end)
- `pages/student/MiscellaneousTest.jsx` — starts `full_adaptive` (no topic scoping)
- `services/adaptiveService.js`

**Deliverable:** Unified adaptive engine powering both topic-scoped and miscellaneous sessions
**Exit criteria:** Topic-scoped session: 5 correct fast answers bump Easy→Medium; poor performance drops difficulty; identical behavior confirmed for full_adaptive; no repeated questions within a session; profile gate triggers correctly after the 3rd topic test

---

### Phase 8 — Placement Readiness Score

**Backend tasks**
- `models/PlacementScore.js`: `save(...)`, `getLatest(user_id)`, `getHistory(user_id)` — history is stored, not just the latest snapshot, so the trend chart in Phase 10 has data
- `services/placementScoreService.js`:
  ```
  score = (accuracy × 0.6) + (speedScore × 0.2) + (difficultyMastery × 0.2)
  ```
  - `accuracy` (60%): correct % across all `full_adaptive` attempts only
  - `speedScore` (20%): normalized against expected time per difficulty level
  - `difficultyMastery` (20%): % of Hard-level questions answered correctly, in `full_adaptive` sessions only
  - **Topic-wise (`topic_adaptive`) tests never contribute to this score**
  - Edge case: if no Hard questions attempted yet, `difficultyMastery = 0`
  - Recalculated inside `adaptiveController.complete` whenever `test_type = 'full_adaptive'`
- `controllers/placementScoreController.js`: `GET /placement-score` (latest + breakdown + misc test count), `GET /placement-score/history`

**Frontend tasks**
- `Dashboard.jsx` — real placement score gauge/ring, replacing stub card
- Score breakdown component (each component + its weight)
- Unlock-status card: `<5` misc tests → progress bar; `≥5` but `<80` → score breakdown + "Reach 80 to unlock"; unlocked → green badge

**Deliverable:** Live, recalculating Placement Readiness Score
**Exit criteria:** Score updates after every completed `full_adaptive` session and never after `topic_adaptive` sessions; history accumulates correctly

---

### Phase 9 — Company Mock Tests + Unlock Logic

**Backend tasks**
- `models/CompanyTest.js`: `findAll`, `findById`, `create/update/softDelete`, `attachQuestion`
- `controllers/companyTestController.js`:
  - `GET /company-tests` — returns `{ locked, misc_tests_completed, placement_score, unlock_message }`
  - **Unlock condition (both required):**
    1. `COUNT(tests WHERE test_type='full_adaptive' AND status='completed') >= 5`
    2. Latest `placement_score.score >= 80`
  - Messaging: `<5` misc tests → *"Complete at least 5 Miscellaneous tests to unlock Company Mock Tests"*; `≥5` tests but score `<80` → score breakdown with *"Your score is X/100. Reach 80 to unlock."*; both met → unlocks automatically, even if more than 5 tests were taken to get there
  - `POST /company-tests/:id/start` — `403` with specific `unlock_message` if either condition unmet
  - `POST /company-tests/:testId/answer` — fixed-question, non-adaptive submission
  - `POST /company-tests/:testId/complete` — score + section-wise breakdown
  - Timed session: `time_limit_minutes` stored per session; auto-submit enforced server-side, not just client-side
  - Admin: full CRUD for company test configs + question attachment (per-company time limit, question count, difficulty distribution)

**Frontend tasks**
- `pages/student/CompanyTests.jsx` — two sections: **Miscellaneous Test** (always available) and **Company Mock Tests** (locked/unlocked cards with the specific message logic above)
- `pages/student/CompanyTestTaking.jsx` — countdown timer with auto-submit, question navigator, submit confirmation
- `pages/student/CompanyTestResult.jsx` — score, section-wise breakdown, review

**Deliverable:** Company test module with dual-condition, score-gated access
**Exit criteria:** Locked/unlocked states behave exactly per the rules above; timed auto-submit works even if the client is closed/reloaded

---

### Phase 10 — Performance Analytics + Recommendations

**Backend tasks**
- `models/Performance.js` — denormalized per-topic aggregates (raw `user_answers` queries would be too slow at scale): `upsert`, `findByUser`; recalculated after every test completion (both test types)
- `services/performanceService.js`: `recalculate(user_id, topic_id)`, `getSummary(user_id)`
- `services/recommendationService.js` — pure rule engine, no ML:
  - `topic_accuracy < 50%` → weak-topic flag
  - `topic_accuracy >= 80%` → strong-topic flag, suggests harder questions
  - `avg_response_time > 1.5× expected` → speed flag
  - `hard_attempted < 5 in topic` → "try Hard questions" flag
  - Skip inserting a recommendation if the same message already exists and isn't dismissed
- `models/Recommendation.js`: `findActive`, `dismiss`
- `controllers/performanceController.js`, `controllers/recommendationController.js`

**Frontend tasks**
- `pages/student/PerformanceDashboard.jsx` — Recharts accuracy pie, topic-wise bar chart, placement score trend line, paginated attempt history table
- `Dashboard.jsx` — wire remaining stub stat cards to real data
- Recommendations panel — dismissible cards

**Deliverable:** Full performance dashboard + recommendation engine
**Exit criteria:** Charts render real data end-to-end; recommendations reflect actual weak/strong topics; dismissed recommendations stay dismissed

---

### Phase 11 — Admin Activity Logs + Final Admin Polish

**Backend tasks**
- `controllers/activityLogController.js`: `GET /admin/activity-logs` (paginated, filterable by user/action)
- Ensure key events are logged: `LOGIN`, `REGISTER`, `CSV_IMPORT`, `DIFFICULTY_CHANGE`, `PROFILE_COMPLETE`, `TEST_COMPLETED`, `COMPANY_TEST_UNLOCKED`
- Real aggregation queries for `GET /admin/analytics/overview` and `GET /admin/analytics/topic-difficulty`

**Frontend tasks**
- `pages/admin/Analytics.jsx` — real charts (questions per topic; topic × difficulty heatmap/grouped bar)
- Activity log viewer with filters
- Admin dashboard stat cards wired to real data

**Deliverable:** Admin has full visibility into platform activity and question distribution
**Exit criteria:** Activity log shows login/test/import events; analytics charts reflect real counts

---

### Phase 12 — Security Hardening

**Tasks**
- **SQL injection:** confirm every query is parameterized (`pool.execute(sql, [params])`); grep for string-concatenated SQL
- **Input validation:** `express-validator` on every route accepting body input — email format, password ≥8 chars, phone format, CGPA 0–10, graduation year 2020–2035, `correct_option` in `[A,B,C,D]`, `difficulty` in `[Easy,Medium,Hard]`; CSV re-validated server-side even after client checks
- **File upload security:** MIME + extension filtering (images for photo, PDF for resume), size limits at middleware level, UUID filenames (no path traversal), never execute uploaded files
- **Rate limiting:** auth endpoints tight (e.g. 5/15min); CSV import stricter (e.g. 3/hour per admin); adaptive answer-submit limited against bulk abuse
- **Helmet:** verify CSP doesn't block the React app's own assets
- **JWT:** access token 15m, refresh 7d; logout discards refresh token client-side (DB blacklist optional)
- **Error handling:** production mode suppresses stack traces (`NODE_ENV !== 'development'`)
- **CORS:** lock `origin` to the real domain in production, not `*`
- **Frontend:** never store the access token in `localStorage` (memory/context only); sanitize any user content rendered as HTML

**Deliverable:** Security-hardened application
**Exit criteria:** Manual pentest checklist passes — no SQL injection, no XSS, no path traversal, no stack traces in prod

---

### Phase 13 — Testing

**Backend (Jest + Supertest), priority order:**
1. `adaptiveEngine.js` — all boundary cases (Easy→Medium, Medium→Hard, Hard ceiling, exactly 0.8, exactly 0.4)
2. `placementScoreService.js` — formula with known inputs
3. `csvImportService.js` — good CSV, bad CSV (missing fields, invalid difficulty, duplicates)
4. Auth endpoints — register, login, refresh, protected-route rejection
5. Profile gate middleware — not triggered → no block; triggered + incomplete → 403; triggered + complete → 200
6. Company test unlock — `<5` tests → 403; `≥5` + score `<80` → 403 with breakdown; both met → 200

**Frontend manual checklist**
- [ ] Login/Register on a fresh account
- [ ] Topic-wise adaptive test → difficulty changes after 5 correct answers
- [ ] Complete 3 topic tests → profile gate modal appears
- [ ] Complete profile → tests resume
- [ ] Complete 5 misc tests → score calculates, company tests unlock if ≥80
- [ ] Company test: timed, auto-submits on timeout
- [ ] CSV import: 600-row file → correct import report
- [ ] Admin: deactivate a user → they can't log in

**Deliverable:** Test suite covering all high-risk logic
**Exit criteria:** All unit tests pass; manual checklist has no failures

---

### Phase 14 — UI Polish + Responsive Design

**Tasks**
- Full responsiveness: mobile (375px) / tablet (768px) / desktop (1440px)
- Consistent design system — extend existing CSS vars, typography scale, shared Button/Card/Input styles
- Loading states (spinners/skeletons), error states (toasts/inline), empty states ("No questions imported yet", etc.)
- Navbar active-state indicators; profile photo in navbar/sidebar if uploaded; mobile hamburger nav
- Micro-animations: difficulty badge pulse on change, animated score gauge, chart entrance transitions

**Deliverable:** Polished, responsive, production-quality UI
**Exit criteria:** No layout breaks at any of the three breakpoints

---

### Phase 15 — Deployment Prep + Documentation

**Tasks**
- `docs/deployment.md`: XAMPP→production MySQL migration, production env checklist, Nginx config (serve React build, proxy `/api`), PM2 setup, `npm run build` for the Vite bundle
- Final `schema.sql` ready for prod import
- Verify `NODE_ENV=production` suppresses stack traces/dev logging
- `engines` field in `package.json` (Node 20+)
- Remove all debug `console.log` statements
- Update `README.md`

**Deliverable:** Fully documented, deployable application
**Exit criteria:** A fresh deployment on a new machine works by following the README

---

## 4. Milestone Checklist

- [ ] Phase 1 — Schema migrated, seeded DB live in phpMyAdmin
- [ ] Phase 2 — Backend skeleton confirmed (health check)
- [ ] Phase 3 — Auth complete (register/login/refresh/logout, role guard on frontend)
- [ ] Phase 4 — Profile page + uploads + gate working end-to-end
- [ ] Phase 5 — Question CRUD + CSV import validated at scale
- [ ] Phase 6 — Admin user management + analytics shell
- [ ] Phase 7 — Adaptive engine verified for both `topic_adaptive` and `full_adaptive`
- [ ] Phase 8 — Placement score calculating and persisting history
- [ ] Phase 9 — Company tests + dual-condition unlock working
- [ ] Phase 10 — Analytics dashboard + recommendations live
- [ ] Phase 11 — Admin activity logs + polish
- [ ] Phase 12 — Security audit passed
- [ ] Phase 13 — Test suite passing, manual checklist clean
- [ ] Phase 14 — UI responsive and polished
- [ ] Phase 15 — Deployed, documented

---

## 5. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| 6000+ questions makes random selection slow | Index `(topic_id, difficulty)`; **never** `ORDER BY RAND()` — use offset-based or pre-shuffled selection |
| Adaptive engine oscillates difficulty unpredictably | Batch-of-5 evaluation only; log every decision to `activity_logs` for debuggability |
| CSV import with bad data corrupts the question bank | Validate-then-insert inside a transaction; reject bad rows individually with reasons, never partial silent corruption |
| Placement score gate frustrates students near 80 | Always show the full score breakdown, not just a locked message |
| Client-side profile "completion" spoofing | `is_profile_complete` computed and set server-side only, on every profile update |
| Concurrent CSV imports create duplicate questions | SHA-256 `question_hash` enforced as a DB-level unique constraint per topic, not just app-level checks |
| Company test timer bypass via client manipulation | Auto-submit enforced server-side against `time_limit_minutes`, not just a client-side countdown |

---

## 6. Key Technical Decisions (Reference)

| Decision | Rationale |
|---|---|
| No `ORDER BY RAND()` for question selection | Catastrophically slow on 6000+ rows |
| Adaptive engine is pure rule-based, no ML | Transparent, debuggable, fast — every decision logged |
| Batch-of-5 evaluation (not per-question) | Prevents oscillation; statistically meaningful signal |
| `test_type` enum: `topic_adaptive` / `full_adaptive` / `company` | No separate non-adaptive practice mode exists; only `full_adaptive` feeds the placement score |
| Profile gate via `profile_prompt_triggered` flag | Decouples the trigger event (3rd topic test) from the per-request check — avoids recounting on every request |
| `is_profile_complete` computed server-side | Client can't fake completion |
| SHA-256 `question_hash` per topic | DB-enforced duplicate prevention; safe under concurrent CSV imports |
| `placement_score` stores full history | Trend graph requires history, not just the latest value |
| Denormalized `performance` table | Direct `user_answers` analytics queries would be too slow at scale |

---

## 7. Files Still To Create

### Backend
`middleware/profileGate.js` · `models/Question.js` · `models/Test.js` · `models/TestQuestion.js` · `models/UserAnswer.js` · `models/Performance.js` · `models/PlacementScore.js` · `models/CompanyTest.js` · `models/Recommendation.js` · `services/csvImportService.js` · `services/adaptiveEngine.js` · `services/questionSelector.js` · `services/placementScoreService.js` · `services/performanceService.js` · `services/recommendationService.js` · `controllers/questionController.js` · `controllers/adaptiveController.js` · `controllers/placementScoreController.js` · `controllers/companyTestController.js` · `controllers/performanceController.js` · `controllers/recommendationController.js` · `controllers/analyticsController.js` · `controllers/activityLogController.js`

### Frontend
`routes/RoleRoute.jsx` · `services/profileService.js` · `services/adaptiveService.js` · `services/performanceService.js` · `hooks/useAdaptiveTest.js` · `pages/student/Profile.jsx` · `pages/student/TopicPractice.jsx` · `pages/student/AdaptiveTest.jsx` · `pages/student/MiscellaneousTest.jsx` · `pages/student/CompanyTests.jsx` · `pages/student/CompanyTestTaking.jsx` · `pages/student/CompanyTestResult.jsx` · `pages/student/PerformanceDashboard.jsx` · `pages/admin/TopicManagement.jsx` · `pages/admin/QuestionManagement.jsx` · `pages/admin/CsvImport.jsx` · `pages/admin/UserManagement.jsx` · `pages/admin/Analytics.jsx` · `components/common/` (Button, Card, Modal, Spinner) · `components/charts/` (AccuracyPie, TopicBar, ScoreLine) · `components/questions/` (QuestionCard, OptionSelector, Timer) · `components/layout/` (Navbar, Sidebar, DashboardLayout)

---

## 8. Suggested File Companions
`skills.md`, `database-schema.md`, `api-endpoints.md`, `folder-structure.md` (generated alongside this plan).
