-- AdaptIQ Seed Data — development sample data
-- Run AFTER schema.sql

-- Topics (10 placement prep topics)
INSERT INTO topics (name, description) VALUES
  ('Data Structures & Algorithms', 'Arrays, linked lists, trees, graphs, sorting, searching'),
  ('Aptitude & Reasoning',         'Quantitative aptitude, logical reasoning, verbal ability'),
  ('Operating Systems',            'Processes, threads, memory management, scheduling'),
  ('Database Management Systems',  'SQL, normalization, transactions, indexing'),
  ('Computer Networks',            'OSI model, TCP/IP, protocols, routing'),
  ('Object-Oriented Programming',  'Classes, inheritance, polymorphism, design principles'),
  ('System Design',                'Scalability, microservices, caching, load balancing'),
  ('Web Technologies',             'HTML, CSS, JavaScript, REST, HTTP'),
  ('C / C++ Programming',          'Pointers, memory, STL, templates'),
  ('Verbal & Communication',       'Reading comprehension, grammar, vocabulary');

-- Admin user (password: Admin@123)
-- bcrypt hash of 'Admin@123' with 12 rounds:
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin', 'admin@adaptiq.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniYOreWUP6iL.Zm3nW2vVJoAm', 'admin');

-- Sample student (password: Student@123)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Demo Student', 'student@adaptiq.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniYOreWUP6iL.Zm3nW2vVJoAm', 'student');

-- Sample questions for DSA topic (topic_id = 1)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES
(1, 'What is the time complexity of binary search?',
 'O(n)', 'O(log n)', 'O(n log n)', 'O(1)',
 'B', 'Easy',
 'Binary search halves the search space each step, giving O(log n) time complexity.',
 SHA2(LOWER(TRIM('What is the time complexity of binary search?')), 256)),

(1, 'Which data structure uses LIFO order?',
 'Queue', 'Stack', 'Linked List', 'Tree',
 'B', 'Easy',
 'Stack follows Last In First Out (LIFO) order.',
 SHA2(LOWER(TRIM('Which data structure uses LIFO order?')), 256)),

(1, 'What is the worst-case time complexity of quicksort?',
 'O(n log n)', 'O(n)', 'O(n²)', 'O(log n)',
 'C', 'Medium',
 'Quicksort has O(n²) worst-case when the pivot is always the smallest/largest element.',
 SHA2(LOWER(TRIM('What is the worst-case time complexity of quicksort?')), 256));
