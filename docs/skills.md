# Skills Roadmap — What You Need to Learn/Use, and In What Order

This maps directly to the phases in `plan.md`. Learn just-in-time — don't try to master everything before starting.

## 1. Core Skills by Category

### Frontend
| Skill | Needed For | Priority |
|---|---|---|
| React fundamentals (components, hooks, state) | Everything UI | Must-have |
| React Router | Multi-page navigation (dashboard, admin, tests) | Must-have |
| Axios + async data fetching, loading/error states | All API calls | Must-have |
| Context API or a lightweight state manager | Auth state, user session across app | Must-have |
| Recharts or Chart.js | Performance dashboard (Phase 11) | Must-have |
| Tailwind CSS (or plain CSS with a design system) | Consistent, fast styling | Recommended |
| Form validation (react-hook-form or manual) | Register/login/admin forms | Recommended |

### Backend
| Skill | Needed For | Priority |
|---|---|---|
| Node.js + Express fundamentals | Entire backend | Must-have |
| MVC pattern in Express (routes/controllers/services/models) | Clean architecture | Must-have |
| `mysql2` driver, connection pooling | DB access | Must-have |
| JWT (issuing, verifying, refresh tokens) | Auth (Phase 3) | Must-have |
| bcrypt | Password hashing | Must-have |
| `multer` (file upload) + `csv-parser` | CSV import (Phase 5) | Must-have |
| Middleware design (auth, validation, error handling) | Security, clean controllers | Must-have |
| `express-validator` or `joi` | Input validation | Recommended |
| Transactions in MySQL (`BEGIN`/`COMMIT`/`ROLLBACK`) | Safe batch CSV inserts | Must-have |

### Database
| Skill | Needed For | Priority |
|---|---|---|
| Relational schema design + normalization (up to 3NF) | Phase 1 | Must-have |
| Primary/foreign keys, indexes | Query performance at 6000+ rows | Must-have |
| Writing efficient `JOIN` queries | Analytics, performance dashboard | Must-have |
| phpMyAdmin basics (import/export, running SQL) | DB management during dev | Must-have |
| Query optimization basics (avoid `ORDER BY RAND()` at scale) | Question selection at scale | Recommended |

### Security
| Skill | Needed For | Priority |
|---|---|---|
| Parameterized queries (prepared statements) | Preventing SQL injection everywhere | Must-have |
| XSS prevention (escaping/sanitizing output) | Any user-generated content rendered in UI | Must-have |
| Role-based access control | Admin vs Student route protection | Must-have |
| Rate limiting | Login/auth endpoints | Recommended |
| `helmet.js` | HTTP security headers | Recommended |

### Tooling / Environment
| Skill | Needed For | Priority |
|---|---|---|
| Git + GitHub (branching, commits, PRs) | Version control across the whole project | Must-have |
| XAMPP (Apache/MySQL stack) | Local dev environment | Must-have |
| VS Code + REST client (Postman/Thunder Client) | API testing during development | Must-have |
| Basic testing (Jest/Supertest) | Phase 12 test coverage | Recommended |
| Environment variables (`dotenv`) | Config separation, secrets | Must-have |

## 2. Learning Order (Matches Build Order in plan.md)

1. **SQL & schema design** — before writing any backend code, you need the schema solid.
2. **Express + MVC basics** — build the skeleton before anything else.
3. **JWT + bcrypt** — auth is a dependency for almost every other feature.
4. **React basics + Router + Axios** — needed as soon as you build the admin panel UI.
5. **File upload (multer) + CSV parsing** — isolated skill, needed only for Phase 5.
6. **State machines / conditional logic design** — useful mental model for the adaptive engine (Phase 8) — it's just a rules engine, not ML.
7. **Recharts** — only needed once you reach Phase 11.
8. **Security hardening checklist** — apply continuously, but do a formal pass in Phase 12.

## 3. Explicitly NOT Needed
Per project constraints, do **not** invest time learning:
- Machine learning / model training (adaptive engine is rule-based only)
- MongoDB or NoSQL patterns (MySQL only)
- Native mobile development

## 4. Quick Reference — npm Packages You'll Actually Install

**Backend**
```
express mysql2 jsonwebtoken bcrypt csv-parser multer dotenv cors morgan
express-validator helmet express-rate-limit
```

**Backend (dev/test)**
```
nodemon jest supertest
```

**Frontend**
```
react react-dom react-router-dom axios recharts
```
(add `tailwindcss` if using Tailwind)
