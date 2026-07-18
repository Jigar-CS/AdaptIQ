# Database Schema — MySQL (3NF Normalized)

Naming convention: `snake_case` tables/columns, `id` as PK everywhere, `created_at`/`updated_at` on all tables for audit trails.

## 1. Users
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','admin') NOT NULL DEFAULT 'student',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```
*Note:* Single `users` table with a `role` enum, rather than a separate `admins` table — avoids duplicating auth logic. If admin-only fields grow (e.g. permissions), split into `admin_profiles` later.

## 2. Topics
```sql
CREATE TABLE topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Questions
```sql
CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic_id INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a VARCHAR(500) NOT NULL,
  option_b VARCHAR(500) NOT NULL,
  option_c VARCHAR(500) NOT NULL,
  option_d VARCHAR(500) NOT NULL,
  correct_option ENUM('A','B','C','D') NOT NULL,
  difficulty ENUM('Easy','Medium','Hard') NOT NULL,
  explanation TEXT,
  question_hash CHAR(64) NOT NULL COMMENT 'SHA-256 of normalized question_text, for duplicate detection',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_topic_question (topic_id, question_hash),
  INDEX idx_topic_difficulty (topic_id, difficulty)
);
```
*Note:* `idx_topic_difficulty` is the single most important index in the schema — nearly every question-selection query filters on both columns.

## 4. Tests
```sql
CREATE TABLE tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  test_type ENUM('practice','adaptive','company') NOT NULL,
  company_test_id INT NULL COMMENT 'set only if test_type = company',
  status ENUM('in_progress','completed','abandoned') DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_test_id) REFERENCES company_tests(id) ON DELETE SET NULL,
  INDEX idx_user_type (user_id, test_type)
);
```

## 5. TestQuestions
Join table tracking which questions were served in which test, in what order, at what difficulty (important for adaptive test history).
```sql
CREATE TABLE test_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT NOT NULL,
  question_id INT NOT NULL,
  sequence_number INT NOT NULL,
  difficulty_at_time ENUM('Easy','Medium','Hard') NOT NULL,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_test_question (test_id, question_id),
  INDEX idx_test_sequence (test_id, sequence_number)
);
```
*Note:* `UNIQUE KEY uniq_test_question` is what enforces "questions never repeat inside the same test" at the database level, not just in application logic.

## 6. UserAnswers
```sql
CREATE TABLE user_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT NOT NULL,
  question_id INT NOT NULL,
  user_id INT NOT NULL,
  selected_option ENUM('A','B','C','D') NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_seconds DECIMAL(6,2) NOT NULL,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_question (user_id, question_id),
  INDEX idx_test (test_id)
);
```

## 7. Performance
Aggregated, denormalized summary per user per topic — recomputed periodically rather than queried live from `user_answers` every time (this is the standard denormalization-for-read-speed tradeoff).
```sql
CREATE TABLE performance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic_id INT NOT NULL,
  total_attempted INT DEFAULT 0,
  total_correct INT DEFAULT 0,
  avg_response_time DECIMAL(6,2) DEFAULT 0,
  accuracy_percent DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_topic (user_id, topic_id)
);
```

## 8. PlacementScore
Stores a **history** of scores (not just latest) to support trend graphs.
```sql
CREATE TABLE placement_score (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  accuracy_component DECIMAL(5,2) NOT NULL,
  speed_component DECIMAL(5,2) NOT NULL,
  difficulty_mastery_component DECIMAL(5,2) NOT NULL,
  topic_coverage_component DECIMAL(5,2) NOT NULL,
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_time (user_id, calculated_at)
);
```

## 9. CompanyTests
```sql
CREATE TABLE company_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  time_limit_minutes INT NOT NULL,
  question_count INT NOT NULL,
  easy_count INT NOT NULL DEFAULT 0,
  medium_count INT NOT NULL DEFAULT 0,
  hard_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 10. CompanyQuestions
Join table mapping which questions belong to which company test.
```sql
CREATE TABLE company_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_test_id INT NOT NULL,
  question_id INT NOT NULL,
  FOREIGN KEY (company_test_id) REFERENCES company_tests(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_company_question (company_test_id, question_id)
);
```

## 11. Recommendations
```sql
CREATE TABLE recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  topic_id INT NULL,
  message VARCHAR(255) NOT NULL,
  recommendation_type ENUM('weak_topic','strong_topic','difficulty_suggestion','revision') NOT NULL,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
  INDEX idx_user (user_id)
);
```

## 12. ActivityLogs
Used for audit trail and, importantly, for debugging the adaptive engine's decisions.
```sql
CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action_type VARCHAR(100) NOT NULL COMMENT 'e.g. LOGIN, CSV_IMPORT, DIFFICULTY_CHANGE, TEST_COMPLETED',
  details JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_action (user_id, action_type),
  INDEX idx_created (created_at)
);
```

## Entity Relationship Summary

```
users 1───* tests
users 1───* user_answers
users 1───* performance
users 1───* placement_score
users 1───* recommendations
users 1───* activity_logs

topics 1───* questions
topics 1───* performance

tests 1───* test_questions
tests 1───* user_answers
tests *───1 company_tests (nullable)

questions 1───* test_questions
questions 1───* user_answers
questions 1───* company_questions

company_tests 1───* company_questions
```

## Design Notes
- **Normalization:** schema is in 3NF — no repeating groups, no transitive dependencies (e.g. `performance` is a computed/denormalized aggregate table, an intentional exception for read performance, not a normalization violation of the transactional tables).
- **Duplicate detection:** `question_hash` (SHA-256 of normalized question text) with a unique constraint per topic gives you database-enforced duplicate prevention, not just application-level checks — safer for concurrent CSV imports.
- **Cascading deletes:** used where child data is meaningless without the parent (e.g. deleting a user deletes their answers). `ON DELETE SET NULL` used where the relationship is informational, not ownership (e.g. `activity_logs.user_id`).
- **Scale consideration:** with 6000+ questions and potentially thousands of `user_answers` rows per active student, the `idx_topic_difficulty` and `idx_user_question` indexes are what keep question-selection and analytics queries fast — don't skip them.
