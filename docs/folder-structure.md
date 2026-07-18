# Project Folder Structure

## Backend (`/backend`)

```
backend/
├── config/
│   ├── db.js                 # MySQL pool connection
│   └── env.js                # Loads/validates .env
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── topicController.js
│   ├── questionController.js
│   ├── practiceController.js
│   ├── adaptiveController.js
│   ├── placementScoreController.js
│   ├── companyTestController.js
│   ├── performanceController.js
│   └── recommendationController.js
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js         # mounts topic/question/user/analytics admin routes
│   ├── practiceRoutes.js
│   ├── adaptiveRoutes.js
│   ├── companyTestRoutes.js
│   ├── performanceRoutes.js
│   └── index.js                # aggregates all routers under /api
├── middleware/
│   ├── authenticate.js         # verifies JWT
│   ├── authorize.js            # role-based guard
│   ├── validate.js             # wraps express-validator / joi checks
│   ├── errorHandler.js         # global error handler (last middleware)
│   └── rateLimiter.js
├── services/
│   ├── authService.js
│   ├── csvImportService.js     # parsing + validation + batch insert
│   ├── adaptiveEngine.js       # core rule-based engine
│   ├── placementScoreService.js
│   ├── performanceService.js
│   └── recommendationService.js
├── models/
│   ├── User.js
│   ├── Topic.js
│   ├── Question.js
│   ├── Test.js
│   ├── UserAnswer.js
│   ├── Performance.js
│   ├── PlacementScore.js
│   ├── CompanyTest.js
│   └── ActivityLog.js
├── utils/
│   ├── hashUtils.js             # bcrypt wrappers
│   ├── jwtUtils.js
│   ├── questionHash.js          # SHA-256 for duplicate detection
│   └── responseFormatter.js     # consistent success/error envelope
├── uploads/                     # temp storage for CSV files pre-import
├── tests/                       # Jest/Supertest test files
├── .env
├── app.js                       # Express app setup, middleware registration
└── server.js                    # entry point, starts the HTTP server
```

**Why this structure:**
- **Controllers** stay thin — parse request, call a service, format response. No business logic here.
- **Services** hold all business logic (adaptive engine, scoring, CSV validation) — this is what makes the logic unit-testable independent of HTTP.
- **Models** are data-access only (queries), no business rules.
- This separation is what "MVC" means in practice for an Express app — Express doesn't enforce it, so the discipline is on you.

---

## Frontend (`/frontend/src`)

```
frontend/src/
├── components/
│   ├── common/                  # Button, Card, Modal, LoadingSpinner, etc.
│   ├── charts/                  # AccuracyPieChart, TopicBarChart, ScoreTrendLine
│   ├── questions/                # QuestionCard, OptionSelector, Timer
│   └── layout/                  # Navbar, Sidebar, DashboardLayout
├── pages/
│   ├── auth/                    # Login, Register, ForgotPassword
│   ├── student/
│   │   ├── Dashboard.jsx
│   │   ├── TopicPractice.jsx
│   │   ├── AdaptiveTest.jsx
│   │   ├── CompanyTests.jsx
│   │   ├── PerformanceDashboard.jsx
│   │   └── Profile.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── TopicManagement.jsx
│       ├── QuestionManagement.jsx
│       ├── CsvImport.jsx
│       ├── UserManagement.jsx
│       └── Analytics.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js                # wraps axios with token injection + error handling
│   └── useAdaptiveTest.js       # manages batch state client-side
├── services/
│   ├── apiClient.js             # axios instance, base URL, interceptors
│   ├── authService.js
│   ├── questionService.js
│   ├── adaptiveService.js
│   └── performanceService.js
├── context/
│   ├── AuthContext.jsx          # user, token, login/logout
│   └── ThemeContext.jsx         # optional dark/light mode
├── assets/
│   ├── images/
│   └── styles/
├── routes/
│   ├── AppRouter.jsx
│   ├── ProtectedRoute.jsx       # redirects unauthenticated users
│   └── RoleRoute.jsx            # restricts by role (admin/student)
├── App.jsx
└── main.jsx
```

**Why this structure:**
- **`services/`** isolates all API calls from components — components never call `axios` directly, they call a service function. Makes it trivial to mock in tests and to change the API base URL in one place.
- **`hooks/`** centralizes stateful logic that's reused across pages (e.g. `useAdaptiveTest` manages the current batch/difficulty state so `AdaptiveTest.jsx` stays a thin view).
- **`routes/ProtectedRoute` + `RoleRoute`** give you two composable guards instead of duplicating auth checks in every page component.

---

## Root-Level Files

```
project-root/
├── backend/
├── frontend/
├── database/
│   ├── schema.sql               # full CREATE TABLE statements
│   └── seed.sql                 # sample data for dev
├── docs/
│   ├── plan.md
│   ├── skills.md
│   ├── database-schema.md
│   ├── api-endpoints.md
│   └── folder-structure.md
├── .gitignore                   # node_modules, .env, uploads/*
└── README.md
```
