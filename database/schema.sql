-- AdaptIQ Database Schema
-- Run this in phpMyAdmin after creating the `adaptiq` database
-- MySQL 8.0+

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- 2. Topics
CREATE TABLE IF NOT EXISTS topics (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Questions
CREATE TABLE IF NOT EXISTS questions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  topic_id        INT NOT NULL,
  question_text   TEXT NOT NULL,
  option_a        VARCHAR(500) NOT NULL,
  option_b        VARCHAR(500) NOT NULL,
  option_c        VARCHAR(500) NOT NULL,
  option_d        VARCHAR(500) NOT NULL,
  correct_option  ENUM('A','B','C','D') NOT NULL,
  difficulty      ENUM('Easy','Medium','Hard') NOT NULL,
  explanation     TEXT,
  question_hash   CHAR(64) NOT NULL COMMENT 'SHA-256 of normalized question_text for duplicate detection',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_topic_question (topic_id, question_hash),
  INDEX idx_topic_difficulty (topic_id, difficulty)
);

-- 4. Tests
CREATE TABLE IF NOT EXISTS tests (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  test_type       ENUM('practice','adaptive','company') NOT NULL,
  company_test_id INT NULL COMMENT 'set only if test_type = company',
  status          ENUM('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
  started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at    TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_type (user_id, test_type)
);

-- 5. TestQuestions
CREATE TABLE IF NOT EXISTS test_questions (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  test_id             INT NOT NULL,
  question_id         INT NOT NULL,
  sequence_number     INT NOT NULL,
  difficulty_at_time  ENUM('Easy','Medium','Hard') NOT NULL,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_test_question (test_id, question_id),
  INDEX idx_test_sequence (test_id, sequence_number)
);

-- 6. UserAnswers
CREATE TABLE IF NOT EXISTS user_answers (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  test_id               INT NOT NULL,
  question_id           INT NOT NULL,
  user_id               INT NOT NULL,
  selected_option       ENUM('A','B','C','D') NULL,
  is_correct            BOOLEAN NOT NULL,
  response_time_seconds DECIMAL(6,2) NOT NULL,
  answered_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_question (user_id, question_id),
  INDEX idx_test (test_id)
);

-- 7. Performance (denormalized per-user-per-topic aggregate)
CREATE TABLE IF NOT EXISTS performance (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT NOT NULL,
  topic_id          INT NOT NULL,
  total_attempted   INT NOT NULL DEFAULT 0,
  total_correct     INT NOT NULL DEFAULT 0,
  avg_response_time DECIMAL(6,2) NOT NULL DEFAULT 0,
  accuracy_percent  DECIMAL(5,2) NOT NULL DEFAULT 0,
  last_updated      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_topic (user_id, topic_id)
);

-- 8. PlacementScore (history for trend graphs)
CREATE TABLE IF NOT EXISTS placement_score (
  id                              INT AUTO_INCREMENT PRIMARY KEY,
  user_id                         INT NOT NULL,
  score                           DECIMAL(5,2) NOT NULL,
  accuracy_component              DECIMAL(5,2) NOT NULL,
  speed_component                 DECIMAL(5,2) NOT NULL,
  difficulty_mastery_component    DECIMAL(5,2) NOT NULL,
  topic_coverage_component        DECIMAL(5,2) NOT NULL,
  calculated_at                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_time (user_id, calculated_at)
);

-- 9. CompanyTests
CREATE TABLE IF NOT EXISTS company_tests (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  company_name        VARCHAR(100) NOT NULL,
  time_limit_minutes  INT NOT NULL,
  question_count      INT NOT NULL,
  easy_count          INT NOT NULL DEFAULT 0,
  medium_count        INT NOT NULL DEFAULT 0,
  hard_count          INT NOT NULL DEFAULT 0,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add FK to tests after company_tests exists
ALTER TABLE tests
  ADD CONSTRAINT fk_tests_company
  FOREIGN KEY (company_test_id) REFERENCES company_tests(id) ON DELETE SET NULL;

-- 10. CompanyQuestions
CREATE TABLE IF NOT EXISTS company_questions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  company_test_id INT NOT NULL,
  question_id     INT NOT NULL,
  FOREIGN KEY (company_test_id) REFERENCES company_tests(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_company_question (company_test_id, question_id)
);

-- 11. Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  user_id             INT NOT NULL,
  topic_id            INT NULL,
  message             VARCHAR(255) NOT NULL,
  recommendation_type ENUM('weak_topic','strong_topic','difficulty_suggestion','revision') NOT NULL,
  is_dismissed        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
  INDEX idx_user (user_id)
);

-- 12. ActivityLogs
CREATE TABLE IF NOT EXISTS activity_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NULL,
  action_type VARCHAR(100) NOT NULL COMMENT 'e.g. LOGIN, CSV_IMPORT, DIFFICULTY_CHANGE, TEST_COMPLETED',
  details     JSON NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_action (user_id, action_type),
  INDEX idx_created (created_at)
);

SET FOREIGN_KEY_CHECKS = 1;
