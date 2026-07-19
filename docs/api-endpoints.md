# REST API Specification

Base URL: `/api`
Auth: `Authorization: Bearer <jwt>` header on all protected routes.
Response envelope (all endpoints):
```json
{ "success": true, "data": {}, "message": "" }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

## Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Student registration |
| POST | `/auth/login` | Public | Returns access + refresh JWT |
| POST | `/auth/refresh` | Public (refresh token) | Issue new access token |
| POST | `/auth/forgot-password` | Public | Sends reset token |
| POST | `/auth/reset-password` | Public (reset token) | Sets new password |
| POST | `/auth/logout` | Student/Admin | Invalidate refresh token |

## Users (Admin)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/users` | Admin | List/search users, paginated |
| GET | `/admin/users/:id` | Admin | Get single user detail |
| PUT | `/admin/users/:id` | Admin | Update user (activate/deactivate, role) |
| DELETE | `/admin/users/:id` | Admin | Soft-delete user |

## Profile (Student)
> **Profile Completion Gate:** After completing the **3rd topic-wise test**, all test-start endpoints return `403 PROFILE_INCOMPLETE` until the profile is fully filled in.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | Student | Get own profile (includes `is_profile_complete`, `profile_prompt_triggered`) |
| PUT | `/profile` | Student | Update text fields: `{ name, email, phone, college, branch, graduation_year, cgpa, linkedin_url }` |
| PUT | `/profile/password` | Student | Change password: `{ current_password, new_password }` |
| POST | `/profile/photo` | Student | Upload profile photo (multipart/form-data, image file); returns `profile_photo_path` |
| POST | `/profile/resume` | Student | Upload resume (multipart/form-data, PDF only); returns `resume_path` |

**Required fields for `is_profile_complete = true`:**
`phone`, `college`, `branch`, `graduation_year`, `cgpa`, `profile_photo_path`, `resume_path`

**Profile gate 403 response shape:**
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_INCOMPLETE",
    "message": "Please complete your profile to continue taking tests.",
    "data": { "is_profile_complete": false, "profile_prompt_triggered": true }
  }
}
```

## Topics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/topics` | Student/Admin | List all active topics |
| POST | `/admin/topics` | Admin | Create topic |
| PUT | `/admin/topics/:id` | Admin | Update topic |
| DELETE | `/admin/topics/:id` | Admin | Soft-delete topic |

## Questions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/questions?topic_id=&difficulty=&page=` | Admin | Paginated question list with filters |
| POST | `/admin/questions` | Admin | Create a single question |
| PUT | `/admin/questions/:id` | Admin | Edit a question |
| DELETE | `/admin/questions/:id` | Admin | Soft-delete a question |
| POST | `/admin/questions/import` | Admin | Upload CSV (multipart), returns import report |

**CSV Import response shape:**
```json
{
  "success": true,
  "data": {
    "total_rows": 600,
    "inserted": 585,
    "skipped_duplicates": 10,
    "errors": [
      { "row": 42, "reason": "Missing correct_option" },
      { "row": 88, "reason": "Invalid difficulty value: 'medum'" }
    ]
  }
}
```

## Adaptive Test
> **All student-facing tests are adaptive.** There is no separate non-adaptive practice mode.
> Supplying `topic_id` in the body creates a **topic-scoped** session (`test_type = 'topic_adaptive'`).
> Omitting `topic_id` creates a **cross-topic** session (`test_type = 'full_adaptive'`).
> Both modes run the same adaptive engine (`services/adaptiveEngine.js`).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/adaptive/start` | Student | Body: `{ topic_id? }` — `topic_id` optional. Creates adaptive test session, starts at Easy or last-known difficulty for the topic |
| GET | `/adaptive/:testId/next-batch` | Student | Returns next 5 questions at current difficulty (scoped to `topic_id` if topic session) |
| POST | `/adaptive/:testId/answer` | Student | Submit answer: `{ question_id, selected_option, response_time_seconds }`; every 5th answer triggers engine evaluation |
| GET | `/adaptive/:testId/status` | Student | Current difficulty, batch number, running accuracy, `topic_id` (if scoped), `test_type` |
| POST | `/adaptive/:testId/complete` | Student | Ends session; triggers Performance update + Placement Score recalculation |

## Placement Score
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/placement-score` | Student | Latest score + component breakdown |
| GET | `/placement-score/history` | Student | Score history for trend graph |

## Company Tests
> **Unlock condition (both required):**
> 1. Student has completed **≥ 5 Miscellaneous (`full_adaptive`) tests**
> 2. **Placement Readiness Score ≥ 80**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/company-tests` | Student | List company tests; response includes `{ locked: true/false, misc_tests_completed: N, placement_score: X, unlock_message: "..." }` |
| POST | `/admin/company-tests` | Admin | Create company test config |
| PUT | `/admin/company-tests/:id` | Admin | Update config |
| POST | `/admin/company-tests/:id/questions` | Admin | Attach questions to a company test |
| POST | `/company-tests/:id/start` | Student | `403` with `unlock_message` if conditions unmet — two distinct cases: (1) `"Complete at least 5 Miscellaneous tests to unlock"` when misc_count < 5; (2) `"Your score is X/100. Reach 80 to unlock."` when count ≥ 5 but score < 80 |
| POST | `/company-tests/:testId/answer` | Student | Submit answer within timed session |
| POST | `/company-tests/:testId/complete` | Student | Submit test, returns result analysis |

## Performance & Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/performance/summary` | Student | Overall accuracy, avg time, score |
| GET | `/performance/by-topic` | Student | Per-topic breakdown for bar chart |
| GET | `/performance/history` | Student | Attempt history, paginated |
| GET | `/admin/analytics/overview` | Admin | Platform-wide stats (users, questions, avg accuracy) |
| GET | `/admin/analytics/topic-difficulty` | Admin | Question distribution by topic/difficulty |

## Recommendations
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/recommendations` | Student | Active (non-dismissed) recommendations |
| PUT | `/recommendations/:id/dismiss` | Student | Mark as dismissed |

## Activity Logs (Admin only, read)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/activity-logs?user_id=&action_type=&page=` | Admin | Paginated audit log |

## Status Code Conventions
| Code | Meaning |
|---|---|
| 200 | Success (GET, PUT) |
| 201 | Resource created (POST) |
| 400 | Validation error |
| 401 | Missing/invalid token |
| 403 | Valid token, insufficient role/permission (e.g. locked company test) |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate question, email already registered) |
| 422 | Semantically invalid (e.g. CSV row invalid) |
| 500 | Server error |
