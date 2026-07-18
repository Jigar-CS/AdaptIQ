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
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | Student | Get own profile |
| PUT | `/profile` | Student | Update name/email |
| PUT | `/profile/password` | Student | Change password |

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

## Practice (Non-Adaptive)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/practice/start` | Student | Body: `{topic_id, difficulty, count}` → creates a `test` (type=practice), returns question set |
| POST | `/practice/:testId/answer` | Student | Submit one answer: `{question_id, selected_option, response_time_seconds}` |
| POST | `/practice/:testId/complete` | Student | Marks test completed, triggers performance recalculation |

## Adaptive Test
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/adaptive/start` | Student | Body: `{topic_id}` → creates adaptive test session, starts at Easy or last-known difficulty |
| GET | `/adaptive/:testId/next-batch` | Student | Returns next 5 questions at current difficulty |
| POST | `/adaptive/:testId/answer` | Student | Submit answer; every 5th answer triggers engine evaluation |
| GET | `/adaptive/:testId/status` | Student | Current difficulty, batch number, running accuracy |
| POST | `/adaptive/:testId/complete` | Student | Ends session, triggers Placement Score recalculation |

## Placement Score
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/placement-score` | Student | Latest score + component breakdown |
| GET | `/placement-score/history` | Student | Score history for trend graph |

## Company Tests
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/company-tests` | Student | List available company tests (with lock/unlock status) |
| POST | `/admin/company-tests` | Admin | Create company test config |
| PUT | `/admin/company-tests/:id` | Admin | Update config |
| POST | `/admin/company-tests/:id/questions` | Admin | Attach questions to a company test |
| POST | `/company-tests/:id/start` | Student | Blocked with `403` + unlock message if score < 80 |
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
