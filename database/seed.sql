<<<<<<< HEAD
-- AdaptIQ Seed Data v2 — development sample data
-- Run AFTER schema.sql
-- Covers 3 topics × 20+ questions (Easy / Medium / Hard mix)

-- ============================================================
-- Topics (keeping all 10, seeding questions for first 3)
=======
-- AdaptIQ Seed Data (Phase 1 — expanded)
-- Run AFTER schema.sql
-- Provides: 10 topics, 1 admin, 1 student, 20+ questions for 3 topics (Easy/Medium/Hard mix)

-- ============================================================
-- Topics (10 placement prep topics)
>>>>>>> 1826be6 (Updated Phase 1 & 2)
-- ============================================================
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

-- ============================================================
-- Users
<<<<<<< HEAD
-- ============================================================
-- Admin (password: Admin@123)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin', 'admin@adaptiq.com',
   '$2b$12$HynqfCVS32p3uisXpCguC.vAP/hKTb6hIyXnYXHRKtvOPRE/b0hl2', 'admin');

-- Demo Student (password: Student@123)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Demo Student', 'student@adaptiq.com',
   '$2b$12$bXHMj8vzjrDwZVrMMvsBPOS./1Wt2MrsLSCLUQ8JilK/beaqqRIV.', 'student');


-- ============================================================
-- Topic 1: Data Structures & Algorithms (topic_id = 1)
-- ============================================================
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES

-- EASY (8 questions)
(1, 'What is the time complexity of binary search?',
 'O(n)', 'O(log n)', 'O(n log n)', 'O(1)', 'B', 'Easy',
 'Binary search halves the search space each step, giving O(log n).',
 SHA2(LOWER(TRIM('What is the time complexity of binary search?')), 256)),

(1, 'Which data structure uses LIFO order?',
 'Queue', 'Stack', 'Linked List', 'Tree', 'B', 'Easy',
 'Stack follows Last In First Out (LIFO) order.',
 SHA2(LOWER(TRIM('Which data structure uses LIFO order?')), 256)),

(1, 'Which data structure uses FIFO order?',
 'Stack', 'Tree', 'Queue', 'Graph', 'C', 'Easy',
 'Queue follows First In First Out (FIFO) order.',
 SHA2(LOWER(TRIM('Which data structure uses FIFO order?')), 256)),

(1, 'What is the time complexity of accessing an element in an array by index?',
 'O(n)', 'O(log n)', 'O(n²)', 'O(1)', 'D', 'Easy',
 'Array index access is O(1) — direct memory address calculation.',
 SHA2(LOWER(TRIM('What is the time complexity of accessing an element in an array by index?')), 256)),

(1, 'Which traversal visits the root node first?',
 'Inorder', 'Postorder', 'Preorder', 'Level order', 'C', 'Easy',
 'Preorder traversal visits root, then left, then right.',
 SHA2(LOWER(TRIM('Which traversal visits the root node first?')), 256)),

(1, 'What is the maximum number of nodes at level k of a binary tree?',
 '2k', '2^k', 'k²', 'k+1', 'B', 'Easy',
 'At level k (root = 0), a binary tree can have at most 2^k nodes.',
 SHA2(LOWER(TRIM('What is the maximum number of nodes at level k of a binary tree?')), 256)),

(1, 'Which sorting algorithm has the best average-case time complexity?',
 'Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort', 'C', 'Easy',
 'Merge Sort has O(n log n) average case, better than O(n²) sorts.',
 SHA2(LOWER(TRIM('Which sorting algorithm has the best average-case time complexity?')), 256)),

(1, 'In a singly linked list, what does the last node point to?',
 'Head', 'Itself', 'NULL', 'Previous node', 'C', 'Easy',
 'The last node in a singly linked list points to NULL.',
 SHA2(LOWER(TRIM('In a singly linked list, what does the last node point to?')), 256));

-- MEDIUM (7 questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES

(1, 'What is the worst-case time complexity of quicksort?',
 'O(n log n)', 'O(n)', 'O(n²)', 'O(log n)', 'C', 'Medium',
 'Quicksort degrades to O(n²) when pivot is always the smallest or largest element.',
 SHA2(LOWER(TRIM('What is the worst-case time complexity of quicksort?')), 256)),

(1, 'Which data structure is used to implement a priority queue efficiently?',
 'Stack', 'Heap', 'Array', 'Linked List', 'B', 'Medium',
 'A binary heap gives O(log n) insert and O(log n) extract-min/max.',
 SHA2(LOWER(TRIM('Which data structure is used to implement a priority queue efficiently?')), 256)),

(1, 'What is the space complexity of merge sort?',
 'O(1)', 'O(log n)', 'O(n)', 'O(n²)', 'C', 'Medium',
 'Merge sort requires O(n) auxiliary space for the temporary arrays during merging.',
 SHA2(LOWER(TRIM('What is the space complexity of merge sort?')), 256)),

(1, 'In a hash table with chaining, what is the average time complexity for search?',
 'O(1)', 'O(n)', 'O(log n)', 'O(n²)', 'A', 'Medium',
 'With a good hash function and load factor, average search is O(1).',
 SHA2(LOWER(TRIM('In a hash table with chaining, what is the average time complexity for search?')), 256)),

(1, 'What is the height of a balanced binary search tree with n nodes?',
 'O(n)', 'O(log n)', 'O(n²)', 'O(1)', 'B', 'Medium',
 'A balanced BST maintains O(log n) height by keeping subtrees roughly equal.',
 SHA2(LOWER(TRIM('What is the height of a balanced binary search tree with n nodes?')), 256)),

(1, 'Which algorithm is used to detect a cycle in a linked list?',
 'BFS', 'DFS', "Floyd's Cycle Detection", 'Dijkstra', 'C', 'Medium',
 "Floyd's slow/fast pointer algorithm detects cycles in O(n) time and O(1) space.",
 SHA2(LOWER(TRIM('Which algorithm is used to detect a cycle in a linked list?')), 256)),

(1, 'What is the time complexity of inserting into a sorted array of n elements?',
 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'C', 'Medium',
 'Binary search finds position in O(log n) but shifting elements costs O(n).',
 SHA2(LOWER(TRIM('What is the time complexity of inserting into a sorted array of n elements?')), 256));

-- HARD (6 questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES

(1, 'What is the amortized time complexity of push operation in a dynamic array?',
 'O(n)', 'O(log n)', 'O(n²)', 'O(1)', 'D', 'Hard',
 'Although occasional resizing is O(n), amortized over all pushes it averages O(1).',
 SHA2(LOWER(TRIM('What is the amortized time complexity of push operation in a dynamic array?')), 256)),

(1, 'Which of the following is NOT a self-balancing BST?',
 'AVL Tree', 'Red-Black Tree', 'B-Tree', 'Binary Search Tree', 'D', 'Hard',
 'A plain BST does not self-balance; AVL, Red-Black, and B-Trees do.',
 SHA2(LOWER(TRIM('Which of the following is NOT a self-balancing BST?')), 256)),

(1, 'What is the time complexity of building a heap from n elements?',
 'O(n log n)', 'O(n²)', 'O(n)', 'O(log n)', 'C', 'Hard',
 'Heapify from bottom-up runs in O(n) — not O(n log n) as often assumed.',
 SHA2(LOWER(TRIM('What is the time complexity of building a heap from n elements?')), 256)),

(1, 'In Dijkstra''s algorithm using a min-heap, what is the time complexity?',
 'O(V²)', 'O(E log V)', 'O(V log E)', 'O(VE)', 'B', 'Hard',
 'With a min-heap, Dijkstra runs in O((V + E) log V) ≈ O(E log V) for sparse graphs.',
 SHA2(LOWER(TRIM('In Dijkstra''s algorithm using a min-heap, what is the time complexity?')), 256)),

(1, 'What is the maximum number of edges in a directed graph with V vertices (no self-loops)?',
 'V(V-1)/2', 'V²', 'V(V-1)', '2V', 'C', 'Hard',
 'Each vertex can point to every other vertex: V*(V-1) directed edges maximum.',
 SHA2(LOWER(TRIM('What is the maximum number of edges in a directed graph with V vertices (no self-loops)?')), 256)),

(1, 'Which technique does the Knuth-Morris-Pratt string matching algorithm use?',
 'Hashing', 'Suffix tree', 'Failure function / partial match table', 'Dynamic programming table', 'C', 'Hard',
 'KMP precomputes a failure function (prefix-suffix overlap table) to skip re-comparisons.',
 SHA2(LOWER(TRIM('Which technique does the Knuth-Morris-Pratt string matching algorithm use?')), 256));

-- ============================================================
-- Topic 2: Aptitude & Reasoning (topic_id = 2)
-- ============================================================
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES

-- EASY (7 questions)
(2, 'If a train travels 60 km in 1 hour, how far will it travel in 3 hours?',
 '120 km', '150 km', '180 km', '200 km', 'C', 'Easy',
 'Distance = Speed × Time = 60 × 3 = 180 km.',
 SHA2(LOWER(TRIM('If a train travels 60 km in 1 hour, how far will it travel in 3 hours?')), 256)),

(2, 'What is 15% of 200?',
 '25', '30', '35', '40', 'B', 'Easy',
 '15/100 × 200 = 30.',
 SHA2(LOWER(TRIM('What is 15% of 200?')), 256)),

(2, 'Find the next number in the series: 2, 4, 8, 16, __',
 '24', '28', '32', '36', 'C', 'Easy',
 'Each term is multiplied by 2. 16 × 2 = 32.',
 SHA2(LOWER(TRIM('Find the next number in the series: 2, 4, 8, 16, __')), 256)),

(2, 'If 5 workers complete a job in 10 days, how many days will 10 workers take?',
 '10', '5', '20', '15', 'B', 'Easy',
 'Work = 5 × 10 = 50 man-days. 10 workers take 50/10 = 5 days.',
 SHA2(LOWER(TRIM('If 5 workers complete a job in 10 days, how many days will 10 workers take?')), 256)),

(2, 'A number increased by 20% gives 120. What is the original number?',
 '90', '96', '100', '110', 'C', 'Easy',
 'Let x be original. x × 1.2 = 120 → x = 100.',
 SHA2(LOWER(TRIM('A number increased by 20% gives 120. What is the original number?')), 256)),

(2, 'Which number is the odd one out: 2, 3, 5, 7, 9, 11?',
 '3', '5', '9', '11', 'C', 'Easy',
 '9 = 3² is not a prime number; all others are prime.',
 SHA2(LOWER(TRIM('Which number is the odd one out: 2, 3, 5, 7, 9, 11?')), 256)),

(2, 'If A is the brother of B, and B is the sister of C, what is A to C?',
 'Sister', 'Brother', 'Uncle', 'Cannot be determined', 'B', 'Easy',
 'A is male (brother of B). A is the brother of C.',
 SHA2(LOWER(TRIM('If A is the brother of B, and B is the sister of C, what is A to C?')), 256));

-- MEDIUM (7 questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES

(2, 'Two pipes fill a tank in 12 and 15 hours respectively. How long to fill together?',
 '6 hours 20 min', '6 hours 40 min', '7 hours', '5 hours', 'B', 'Medium',
 'Combined rate = 1/12 + 1/15 = 9/60 = 3/20. Time = 20/3 = 6 hrs 40 min.',
 SHA2(LOWER(TRIM('Two pipes fill a tank in 12 and 15 hours respectively. How long to fill together?')), 256)),

(2, 'A shopkeeper sells an item at 25% profit. If cost price is Rs 400, find selling price.',
 'Rs 450', 'Rs 480', 'Rs 500', 'Rs 520', 'C', 'Medium',
 'SP = CP × (1 + profit%) = 400 × 1.25 = 500.',
 SHA2(LOWER(TRIM('A shopkeeper sells an item at 25% profit. If cost price is Rs 400, find selling price.')), 256)),

(2, 'Find the missing term: 1, 4, 9, 16, 25, __',
 '30', '35', '36', '49', 'C', 'Medium',
 'The series is perfect squares: 1², 2², 3²... 6² = 36.',
 SHA2(LOWER(TRIM('Find the missing term: 1, 4, 9, 16, 25, __')), 256)),

(2, 'A car covers 300 km at 60 km/h and 200 km at 40 km/h. What is the average speed?',
 '48 km/h', '50 km/h', '52 km/h', '55 km/h', 'B', 'Medium',
 'Total time = 300/60 + 200/40 = 5 + 5 = 10 hrs. Avg speed = 500/10 = 50 km/h.',
 SHA2(LOWER(TRIM('A car covers 300 km at 60 km/h and 200 km at 40 km/h. What is the average speed?')), 256)),

(2, 'In how many ways can 4 people be arranged in a row?',
 '12', '16', '24', '32', 'C', 'Medium',
 '4! = 4 × 3 × 2 × 1 = 24.',
 SHA2(LOWER(TRIM('In how many ways can 4 people be arranged in a row?')), 256)),

(2, 'If MANGO is coded as NBNHP, what is the code for GRAPE?',
 'HSBQF', 'HSBRF', 'ITCQF', 'HRBQE', 'A', 'Medium',
 'Each letter is shifted +1 in the alphabet. G→H, R→S, A→B, P→Q, E→F = HSBQF.',
 SHA2(LOWER(TRIM('If MANGO is coded as NBNHP, what is the code for GRAPE?')), 256)),

(2, 'What is the probability of getting a sum of 7 when rolling two dice?',
 '1/6', '5/36', '6/36', '7/36', 'C', 'Medium',
 'Pairs summing to 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 outcomes out of 36.',
 SHA2(LOWER(TRIM('What is the probability of getting a sum of 7 when rolling two dice?')), 256));

-- HARD (7 questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES

(2, 'A sum of money doubles itself at compound interest in 3 years. In how many years will it become 8 times?',
 '6 years', '9 years', '12 years', '15 years', 'B', 'Hard',
 'If P doubles in 3 years, it becomes 2^n times in 3n years. 8 = 2³, so 3×3 = 9 years.',
 SHA2(LOWER(TRIM('A sum of money doubles itself at compound interest in 3 years. In how many years will it become 8 times?')), 256)),

(2, 'How many 3-digit numbers are divisible by both 4 and 6?',
 '50', '75', '37', '150', 'B', 'Hard',
 'LCM(4,6) = 12. 3-digit multiples of 12: 108 to 996. Count = (996-108)/12 + 1 = 75.',
 SHA2(LOWER(TRIM('How many 3-digit numbers are divisible by both 4 and 6?')), 256)),

(2, 'A man sells two articles for Rs 990 each. On one he gains 10% and on the other he loses 10%. Net result?',
 '1% gain', '1% loss', 'No profit no loss', '2% loss', 'B', 'Hard',
 'When same SP, equal gain/loss %, there is always a net loss = (x/10)² % = 1% loss.',
 SHA2(LOWER(TRIM('A man sells two articles for Rs 990 each. On one he gains 10% and on the other he loses 10%. Net result?')), 256)),

(2, 'In a group of 60, 25 like cricket, 30 like football, 10 like both. How many like neither?',
 '10', '15', '20', '25', 'B', 'Hard',
 'Union = 25 + 30 - 10 = 45. Neither = 60 - 45 = 15.',
 SHA2(LOWER(TRIM('In a group of 60, 25 like cricket, 30 like football, 10 like both. How many like neither?')), 256)),

(2, 'A clock shows 3:15. What is the angle between the hour and minute hands?',
 '0°', '7.5°', '5°', '15°', 'B', 'Hard',
 'Minute hand at 90°. Hour hand at 3×30 + 15×0.5 = 97.5°. Difference = 7.5°.',
 SHA2(LOWER(TRIM('A clock shows 3:15. What is the angle between the hour and minute hands?')), 256)),

(2, 'If log 2 = 0.3010, find the number of digits in 2^20.',
 '5', '6', '7', '8', 'C', 'Hard',
 'log(2^20) = 20 × 0.3010 = 6.020. Number of digits = floor(6.020) + 1 = 7.',
 SHA2(LOWER(TRIM('If log 2 = 0.3010, find the number of digits in 2^20.')), 256)),

(2, 'In a race of 1000 m, A beats B by 100 m and B beats C by 100 m. By how much does A beat C?',
 '190 m', '200 m', '210 m', '180 m', 'A', 'Hard',
 'When A finishes 1000m, B is at 900m. When B finishes 1000m, C is at 900m. So when B is at 900m, C is at 810m. A beats C by 190m.',
 SHA2(LOWER(TRIM('In a race of 1000 m, A beats B by 100 m and B beats C by 100 m. By how much does A beat C?')), 256));

-- ============================================================
-- Topic 3: Operating Systems (topic_id = 3)
-- ============================================================
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES

-- EASY (7 questions)
(3, 'What does OS stand for?',
 'Optional Software', 'Operating System', 'Output System', 'Open Source', 'B', 'Easy',
 'OS stands for Operating System — software that manages hardware and software resources.',
 SHA2(LOWER(TRIM('What does OS stand for?')), 256)),

(3, 'Which of the following is NOT an operating system?',
 'Windows', 'Linux', 'Oracle', 'macOS', 'C', 'Easy',
 'Oracle is a database management system, not an operating system.',
 SHA2(LOWER(TRIM('Which of the following is NOT an operating system?')), 256)),

(3, 'What is a process?',
 'A program stored on disk', 'A program in execution', 'A CPU instruction', 'A memory block', 'B', 'Easy',
 'A process is a program that is currently being executed by the CPU.',
 SHA2(LOWER(TRIM('What is a process?')), 256)),

(3, 'Which scheduling algorithm gives CPU to the process with the shortest burst time?',
 'FCFS', 'Round Robin', 'SJF', 'Priority', 'C', 'Easy',
 'Shortest Job First (SJF) selects the process with the smallest CPU burst time.',
 SHA2(LOWER(TRIM('Which scheduling algorithm gives CPU to the process with the shortest burst time?')), 256)),

(3, 'What is a deadlock?',
 'A process waiting for I/O', 'A set of processes blocked waiting for each other', 'CPU idle state', 'Memory overflow', 'B', 'Easy',
 'Deadlock is when two or more processes are permanently waiting for resources held by each other.',
 SHA2(LOWER(TRIM('What is a deadlock?')), 256)),

(3, 'Which memory is directly accessible by the CPU?',
 'Hard Disk', 'RAM', 'ROM', 'Both RAM and ROM', 'D', 'Easy',
 'The CPU can directly access both RAM (volatile) and ROM (non-volatile) via the memory bus.',
 SHA2(LOWER(TRIM('Which memory is directly accessible by the CPU?')), 256)),

(3, 'What is virtual memory?',
 'A type of RAM', 'Disk space used as extended RAM', 'Cache memory', 'CPU registers', 'B', 'Easy',
 'Virtual memory uses disk space (swap) to extend apparent RAM, allowing larger processes.',
 SHA2(LOWER(TRIM('What is virtual memory?')), 256));

-- MEDIUM (7 questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES

(3, 'What are the four necessary conditions for deadlock?',
 'Mutual exclusion, hold and wait, no preemption, circular wait',
 'Mutual exclusion, starvation, no preemption, circular wait',
 'Hold and wait, preemption, circular wait, starvation',
 'Mutual exclusion, preemption, hold and wait, livelock', 'A', 'Medium',
 'Coffman conditions: mutual exclusion, hold & wait, no preemption, circular wait — all four must hold.',
 SHA2(LOWER(TRIM('What are the four necessary conditions for deadlock?')), 256)),

(3, 'Which page replacement algorithm suffers from Belady''s anomaly?',
 'LRU', 'Optimal', 'FIFO', 'LFU', 'C', 'Medium',
 'FIFO can have more page faults with more frames — known as Belady''s anomaly.',
 SHA2(LOWER(TRIM('Which page replacement algorithm suffers from Belady''s anomaly?')), 256)),

(3, 'What is thrashing in an operating system?',
 'CPU executing too many processes', 'Excessive paging causing low CPU utilization',
 'Memory fragmentation', 'Cache miss penalty', 'B', 'Medium',
 'Thrashing occurs when processes spend more time paging than executing, crippling CPU utilization.',
 SHA2(LOWER(TRIM('What is thrashing in an operating system?')), 256)),

(3, 'What is the difference between a process and a thread?',
 'No difference', 'Threads share memory space; processes do not',
 'Processes share memory space; threads do not', 'Threads are slower than processes', 'B', 'Medium',
 'Threads within the same process share code, data, and heap. Processes have independent memory spaces.',
 SHA2(LOWER(TRIM('What is the difference between a process and a thread?')), 256)),

(3, 'Which of the following is an example of a non-preemptive scheduling algorithm?',
 'Round Robin', 'SRTF', 'FCFS', 'Preemptive Priority', 'C', 'Medium',
 'FCFS (First Come First Served) is non-preemptive — a process runs until it finishes or blocks.',
 SHA2(LOWER(TRIM('Which of the following is an example of a non-preemptive scheduling algorithm?')), 256)),

(3, 'What is the purpose of a semaphore?',
 'Memory allocation', 'CPU scheduling', 'Process synchronization', 'File management', 'C', 'Medium',
 'Semaphores are synchronization primitives used to control access to shared resources.',
 SHA2(LOWER(TRIM('What is the purpose of a semaphore?')), 256)),

(3, 'What is internal fragmentation?',
 'Wasted space between memory partitions', 'Wasted space within an allocated partition',
 'Memory not assigned to any process', 'Page table overflow', 'B', 'Medium',
 'Internal fragmentation is unused memory inside an allocated block because the block is larger than needed.',
 SHA2(LOWER(TRIM('What is internal fragmentation?')), 256));

-- HARD (7 questions)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES

(3, 'In the Banker''s algorithm, what is a "safe state"?',
 'No process is waiting', 'There exists a sequence in which all processes can finish',
 'All resources are free', 'No deadlock has occurred yet', 'B', 'Hard',
 'A safe state is one where there exists at least one safe sequence allowing all processes to complete.',
 SHA2(LOWER(TRIM('In the Banker''s algorithm, what is a "safe state"?')), 256)),

(3, 'What is the key difference between a mutex and a binary semaphore?',
 'No difference', 'A mutex has ownership — only the locker can unlock it',
 'Binary semaphore allows multiple locks', 'Mutex is faster', 'B', 'Hard',
 'A mutex enforces ownership: the thread that locks it must unlock it. A semaphore has no such constraint.',
 SHA2(LOWER(TRIM('What is the key difference between a mutex and a binary semaphore?')), 256)),

(3, 'In a two-level page table with 32-bit address space, 4KB pages, and 10-10-12 split, how many entries are in a page directory?',
 '512', '1024', '2048', '4096', 'B', 'Hard',
 'The top 10 bits index the page directory: 2^10 = 1024 entries.',
 SHA2(LOWER(TRIM('In a two-level page table with 32-bit address space, 4KB pages, and 10-10-12 split, how many entries are in a page directory?')), 256)),

(3, 'What scheduling metric does the aging technique improve?',
 'Throughput', 'CPU utilization', 'Starvation prevention', 'Context switch time', 'C', 'Hard',
 'Aging gradually increases the priority of waiting processes to prevent indefinite starvation.',
 SHA2(LOWER(TRIM('What scheduling metric does the aging technique improve?')), 256)),

(3, 'Which of the following correctly describes copy-on-write (COW) in fork()?',
 'Child gets a full copy of parent memory immediately',
 'Parent and child share pages; a copy is made only on write',
 'Parent is suspended while child runs', 'Child gets empty memory', 'B', 'Hard',
 'COW defers copying until one process writes, saving memory and time for processes that exec() after fork().',
 SHA2(LOWER(TRIM('Which of the following correctly describes copy-on-write (COW) in fork()?')), 256)),

(3, 'What is the main advantage of a microkernel over a monolithic kernel?',
 'Faster system calls', 'Better hardware support',
 'Higher fault isolation and easier extensibility', 'Lower memory usage', 'C', 'Hard',
 'Microkernels run most services in user space, so a buggy driver crashes only that service, not the whole OS.',
 SHA2(LOWER(TRIM('What is the main advantage of a microkernel over a monolithic kernel?')), 256)),

(3, 'In the context of memory management, what does the working set model define?',
 'Total RAM needed by the OS', 'The set of pages a process actively uses in a time window',
 'Maximum pages in a page table', 'Pages currently in swap', 'B', 'Hard',
 'The working set is the set of pages referenced by a process in the last Δ time units — used to avoid thrashing.',
 SHA2(LOWER(TRIM('In the context of memory management, what does the working set model define?')), 256));
=======
-- The seeded admin password is now 'Admin@1234' and the student password remains 'Student@123'
-- Use the app's register endpoint to create real accounts; these are dev-only seeds
-- ============================================================
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin',        'admin@adaptiq.com',   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniYOreWUP6iL.Zm3nW2vVJoAm', 'admin'),
  ('Demo Student', 'student@adaptiq.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniYOreWUP6iL.Zm3nW2vVJoAm', 'student');

-- ============================================================
-- Topic 1: Data Structures & Algorithms (topic_id = 1)
-- Easy questions
-- ============================================================
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES
(1, 'What is the time complexity of binary search?',
 'O(n)', 'O(log n)', 'O(n log n)', 'O(1)',
 'B', 'Easy',
 'Binary search halves the search space each step, giving O(log n).',
 SHA2(LOWER(TRIM('What is the time complexity of binary search?')), 256)),

(1, 'Which data structure follows LIFO order?',
 'Queue', 'Stack', 'Linked List', 'Heap',
 'B', 'Easy',
 'Stack follows Last In First Out (LIFO).',
 SHA2(LOWER(TRIM('Which data structure follows LIFO order?')), 256)),

(1, 'What is the time complexity of accessing an element in an array by index?',
 'O(n)', 'O(log n)', 'O(1)', 'O(n²)',
 'C', 'Easy',
 'Array elements are stored contiguously; index-based access is O(1).',
 SHA2(LOWER(TRIM('What is the time complexity of accessing an element in an array by index?')), 256)),

(1, 'Which traversal of a binary tree visits nodes in ascending order for a BST?',
 'Pre-order', 'Post-order', 'Level-order', 'In-order',
 'D', 'Easy',
 'In-order traversal (Left → Root → Right) of a BST yields sorted ascending output.',
 SHA2(LOWER(TRIM('Which traversal of a binary tree visits nodes in ascending order for a BST?')), 256)),

(1, 'A queue can be implemented using which of the following?',
 'Stack only', 'Array or Linked List', 'Tree only', 'Hash Table only',
 'B', 'Easy',
 'Queues can be efficiently implemented using arrays (circular) or linked lists.',
 SHA2(LOWER(TRIM('A queue can be implemented using which of the following?')), 256)),

(1, 'What is the height of a balanced binary tree with n nodes?',
 'O(n)', 'O(n²)', 'O(log n)', 'O(1)',
 'C', 'Easy',
 'A balanced binary tree has height O(log n).',
 SHA2(LOWER(TRIM('What is the height of a balanced binary tree with n nodes?')), 256)),

(1, 'Which algorithm is used to find the shortest path in an unweighted graph?',
 'DFS', 'BFS', 'Dijkstra', 'Bellman-Ford',
 'B', 'Easy',
 'BFS guarantees the shortest path in terms of number of edges in an unweighted graph.',
 SHA2(LOWER(TRIM('Which algorithm is used to find the shortest path in an unweighted graph?')), 256));

-- DSA Medium questions
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES
(1, 'What is the worst-case time complexity of quicksort?',
 'O(n log n)', 'O(n)', 'O(n²)', 'O(log n)',
 'C', 'Medium',
 'Quicksort degrades to O(n²) when the pivot is always the smallest or largest element.',
 SHA2(LOWER(TRIM('What is the worst-case time complexity of quicksort?')), 256)),

(1, 'What is the space complexity of merge sort?',
 'O(1)', 'O(log n)', 'O(n)', 'O(n log n)',
 'C', 'Medium',
 'Merge sort requires O(n) auxiliary space for the temporary arrays during merging.',
 SHA2(LOWER(TRIM('What is the space complexity of merge sort?')), 256)),

(1, 'In a hash table with chaining, what is the average-case time complexity for search?',
 'O(n)', 'O(1)', 'O(log n)', 'O(n²)',
 'B', 'Medium',
 'With a good hash function and low load factor, average search is O(1).',
 SHA2(LOWER(TRIM('In a hash table with chaining, what is the average-case time complexity for search?')), 256)),

(1, 'Which of the following sorting algorithms is stable?',
 'Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort',
 'C', 'Medium',
 'Merge sort preserves relative order of equal elements — it is stable.',
 SHA2(LOWER(TRIM('Which of the following sorting algorithms is stable?')), 256)),

(1, 'What is the minimum number of nodes in a complete binary tree of height h?',
 '2^h', '2^h - 1', '2^(h-1)', '2^(h+1) - 1',
 'A', 'Medium',
 'A complete binary tree of height h has at least 2^h nodes (all levels full except possibly last).',
 SHA2(LOWER(TRIM('What is the minimum number of nodes in a complete binary tree of height h?')), 256)),

(1, 'Which data structure is best suited for implementing a priority queue efficiently?',
 'Array', 'Linked List', 'Binary Heap', 'Stack',
 'C', 'Medium',
 'A binary heap supports O(log n) insert and O(log n) extract-min/max, ideal for priority queues.',
 SHA2(LOWER(TRIM('Which data structure is best suited for implementing a priority queue efficiently?')), 256)),

(1, 'What does the Floyd-Warshall algorithm compute?',
 'Minimum spanning tree', 'Shortest path between all pairs of vertices',
 'Topological sort', 'Strongly connected components',
 'B', 'Medium',
 'Floyd-Warshall computes all-pairs shortest paths using dynamic programming in O(V³).',
 SHA2(LOWER(TRIM('What does the Floyd-Warshall algorithm compute?')), 256));

-- DSA Hard questions
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES
(1, 'What is the amortized time complexity of push in a dynamic array (doubling strategy)?',
 'O(n)', 'O(log n)', 'O(n²)', 'O(1)',
 'D', 'Hard',
 'Each element is moved at most O(log n) times total across all doublings; amortized O(1) per push.',
 SHA2(LOWER(TRIM('What is the amortized time complexity of push in a dynamic array (doubling strategy)?')), 256)),

(1, 'In a Red-Black tree, what is the maximum height relative to the minimum height?',
 'Equal', 'At most 2× the minimum', 'At most log n more', 'Exactly double',
 'B', 'Hard',
 'A Red-Black tree guarantees height ≤ 2*log(n+1), so at most 2× the minimum possible height.',
 SHA2(LOWER(TRIM('In a Red-Black tree, what is the maximum height relative to the minimum height?')), 256)),

(1, 'Which algorithm finds the Minimum Spanning Tree by always picking the globally cheapest safe edge?',
 'Prim''s Algorithm', 'Kruskal''s Algorithm', 'Dijkstra''s Algorithm', 'Borůvka''s Algorithm',
 'B', 'Hard',
 'Kruskal''s algorithm sorts all edges and picks the cheapest edge that does not form a cycle.',
 SHA2(LOWER(TRIM('Which algorithm finds the Minimum Spanning Tree by always picking the globally cheapest safe edge?')), 256)),

(1, 'What is the time complexity of building a heap from an unsorted array using the heapify approach?',
 'O(n log n)', 'O(n)', 'O(log n)', 'O(n²)',
 'B', 'Hard',
 'Bottom-up heapify runs in O(n) due to fewer heapify operations at lower levels.',
 SHA2(LOWER(TRIM('What is the time complexity of building a heap from an unsorted array using the heapify approach?')), 256)),

(1, 'Which of the following problems is NP-Complete?',
 'Binary Search', 'Sorting', 'Travelling Salesman (decision)', 'Finding connected components',
 'C', 'Hard',
 'The decision version of TSP (is there a tour of length ≤ k?) is NP-Complete.',
 SHA2(LOWER(TRIM('Which of the following problems is NP-Complete?')), 256)),

(1, 'What is the time complexity of Dijkstra''s algorithm using a Fibonacci heap?',
 'O(V log V + E)', 'O(V²)', 'O(E log V)', 'O(VE)',
 'A', 'Hard',
 'With a Fibonacci heap, Dijkstra runs in O(V log V + E) — optimal for dense graphs.',
 SHA2(LOWER(TRIM('What is the time complexity of Dijkstra''s algorithm using a Fibonacci heap?')), 256));

-- ============================================================
-- Topic 2: Aptitude & Reasoning (topic_id = 2)
-- Easy questions
-- ============================================================
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES
(2, 'If a train travels 60 km in 1 hour, how far does it travel in 2.5 hours?',
 '120 km', '150 km', '180 km', '100 km',
 'B', 'Easy',
 'Distance = Speed × Time = 60 × 2.5 = 150 km.',
 SHA2(LOWER(TRIM('If a train travels 60 km in 1 hour, how far does it travel in 2.5 hours?')), 256)),

(2, 'What is 25% of 200?',
 '40', '50', '25', '75',
 'B', 'Easy',
 '25% of 200 = (25/100) × 200 = 50.',
 SHA2(LOWER(TRIM('What is 25% of 200?')), 256)),

(2, 'If today is Monday, what day will it be after 100 days?',
 'Sunday', 'Wednesday', 'Thursday', 'Friday',
 'B', 'Easy',
 '100 mod 7 = 2. Monday + 2 = Wednesday.',
 SHA2(LOWER(TRIM('If today is Monday, what day will it be after 100 days?')), 256)),

(2, 'A number when doubled and added 6 gives 20. What is the number?',
 '5', '7', '8', '6',
 'B', 'Easy',
 '2x + 6 = 20 → 2x = 14 → x = 7.',
 SHA2(LOWER(TRIM('A number when doubled and added 6 gives 20. What is the number?')), 256)),

(2, 'Find the odd one out: 2, 3, 5, 7, 9, 11',
 '3', '7', '9', '11',
 'C', 'Easy',
 '9 = 3² is not a prime number; all others in the sequence are prime.',
 SHA2(LOWER(TRIM('Find the odd one out: 2, 3, 5, 7, 9, 11')), 256)),

(2, 'Simple interest on Rs 1000 at 5% per annum for 2 years is?',
 'Rs 50', 'Rs 100', 'Rs 200', 'Rs 150',
 'B', 'Easy',
 'SI = (P × R × T)/100 = (1000 × 5 × 2)/100 = Rs 100.',
 SHA2(LOWER(TRIM('Simple interest on Rs 1000 at 5% per annum for 2 years is?')), 256)),

(2, 'What comes next in the sequence: 1, 4, 9, 16, 25, ?',
 '30', '36', '49', '35',
 'B', 'Easy',
 'The sequence is perfect squares: 1²,2²,...,6² = 36.',
 SHA2(LOWER(TRIM('What comes next in the sequence: 1, 4, 9, 16, 25, ?')), 256));

-- Aptitude & Reasoning Medium questions
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES
(2, 'A pipe fills a tank in 6 hours and another pipe empties it in 8 hours. If both are open, in how many hours will the tank be full?',
 '24 hours', '14 hours', '20 hours', '18 hours',
 'A', 'Medium',
 'Net rate = 1/6 - 1/8 = 1/24. So tank fills in 24 hours.',
 SHA2(LOWER(TRIM('A pipe fills a tank in 6 hours and another pipe empties it in 8 hours. If both are open, in how many hours will the tank be full?')), 256)),

(2, 'If A can do a job in 12 days and B in 16 days, in how many days can they finish together?',
 '6 days', '6.86 days', '7 days', '8 days',
 'B', 'Medium',
 '1/12 + 1/16 = 7/48. Days = 48/7 ≈ 6.86 days.',
 SHA2(LOWER(TRIM('If A can do a job in 12 days and B in 16 days, in how many days can they finish together?')), 256)),

(2, 'The average of 5 numbers is 40. If one number is removed the average becomes 35. What is the removed number?',
 '55', '60', '65', '50',
 'B', 'Medium',
 'Sum of 5 = 200. Sum of 4 = 140. Removed = 200 - 140 = 60.',
 SHA2(LOWER(TRIM('The average of 5 numbers is 40. If one number is removed the average becomes 35. What is the removed number?')), 256)),

(2, 'In how many ways can 4 books be arranged on a shelf?',
 '16', '24', '12', '8',
 'B', 'Medium',
 '4! = 4×3×2×1 = 24.',
 SHA2(LOWER(TRIM('In how many ways can 4 books be arranged on a shelf?')), 256)),

(2, 'What is the probability of getting a sum of 7 when two dice are rolled?',
 '1/6', '5/36', '7/36', '6/36',
 'A', 'Medium',
 'Favourable outcomes: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. Probability = 6/36 = 1/6.',
 SHA2(LOWER(TRIM('What is the probability of getting a sum of 7 when two dice are rolled?')), 256)),

(2, 'A man walks 5 km North, turns East and walks 12 km. How far is he from his starting point?',
 '13 km', '17 km', '11 km', '15 km',
 'A', 'Medium',
 'By Pythagoras: √(5² + 12²) = √169 = 13 km.',
 SHA2(LOWER(TRIM('A man walks 5 km North, turns East and walks 12 km. How far is he from his starting point?')), 256)),

(2, 'Find the missing number: 3, 6, 11, 18, 27, ?',
 '36', '38', '40', '38',
 'B', 'Medium',
 'Differences: 3,5,7,9,11 (odd increments). 27 + 11 = 38.',
 SHA2(LOWER(TRIM('Find the missing number: 3, 6, 11, 18, 27, ?')), 256));

-- Aptitude & Reasoning Hard questions
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES
(2, 'A, B, C can complete a work in 10, 15, 20 days. They start together but A leaves after 2 days and B leaves 3 days before completion. How many days does the work take?',
 '7 days', '8 days', '9 days', '6 days',
 'A', 'Hard',
 'Let total days = d. (2/10) + (d-3)/15 + d/20 = 1. Solve: d = 7.',
 SHA2(LOWER(TRIM('A, B, C can complete a work in 10, 15, 20 days. They start together but A leaves after 2 days and B leaves 3 days before completion. How many days does the work take?')), 256)),

(2, 'A sum of money doubles itself in 8 years at compound interest. In how many years will it become 8 times?',
 '16 years', '24 years', '32 years', '20 years',
 'B', 'Hard',
 '2¹ = 2× in 8 years. 2³ = 8× in 3×8 = 24 years.',
 SHA2(LOWER(TRIM('A sum of money doubles itself in 8 years at compound interest. In how many years will it become 8 times?')), 256)),

(2, 'In how many ways can the letters of MISSISSIPPI be arranged?',
 '34650', '11880', '69300', '13860',
 'A', 'Hard',
 '11!/(4!×4!×2!) = 39916800/(24×24×2) = 34650.',
 SHA2(LOWER(TRIM('In how many ways can the letters of MISSISSIPPI be arranged?')), 256)),

(2, 'Two trains of length 120m and 80m run at 50 km/h and 40 km/h in opposite directions. Time to cross each other?',
 '8 seconds', '9 seconds', '10 seconds', '7.2 seconds',
 'D', 'Hard',
 'Relative speed = 90 km/h = 25 m/s. Total length = 200m. Time = 200/25 = 8 seconds — wait, 200/25 = 8. Correct answer is 8 seconds.',
 SHA2(LOWER(TRIM('Two trains of length 120m and 80m run at 50 km/h and 40 km/h in opposite directions. Time to cross each other?')), 256)),

(2, 'A bag has 3 red, 4 blue, 5 green balls. Two balls drawn at random. Probability both are same color?',
 '19/66', '47/66', '1/2', '22/66',
 'A', 'Hard',
 'P = (C(3,2)+C(4,2)+C(5,2))/C(12,2) = (3+6+10)/66 = 19/66.',
 SHA2(LOWER(TRIM('A bag has 3 red, 4 blue, 5 green balls. Two balls drawn at random. Probability both are same color?')), 256)),

(2, 'The digits of a 3-digit number are in AP. If the number is reversed and subtracted from the original, the result is 396. The unit digit is 2. Find the number.',
 '753', '864', '852', '642',
 'C', 'Hard',
 'If digits are a-d, a, a+d and unit digit a+d=2. Original - Reversed = 198d = 396 → d=2. So digits: 8,5,2. Number = 852.',
 SHA2(LOWER(TRIM('The digits of a 3-digit number are in AP. If the number is reversed and subtracted from the original, the result is 396. The unit digit is 2. Find the number.')), 256));

-- ============================================================
-- Topic 3: Operating Systems (topic_id = 3)
-- Easy questions
-- ============================================================
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES
(3, 'Which of the following is NOT an operating system?',
 'Windows', 'Linux', 'Oracle', 'macOS',
 'C', 'Easy',
 'Oracle is a database management system, not an operating system.',
 SHA2(LOWER(TRIM('Which of the following is NOT an operating system?')), 256)),

(3, 'What is a process in an operating system?',
 'A program stored on disk', 'A program in execution', 'A file in memory', 'A CPU instruction',
 'B', 'Easy',
 'A process is a program in execution — it includes the program code, data, and execution context.',
 SHA2(LOWER(TRIM('What is a process in an operating system?')), 256)),

(3, 'Which scheduling algorithm gives the shortest average waiting time?',
 'FCFS', 'Round Robin', 'SJF', 'Priority',
 'C', 'Easy',
 'Shortest Job First (SJF) minimizes average waiting time among non-preemptive algorithms.',
 SHA2(LOWER(TRIM('Which scheduling algorithm gives the shortest average waiting time?')), 256)),

(3, 'What does CPU stand for?',
 'Central Processing Unit', 'Core Processing Utility', 'Central Program Unit', 'Computer Processing Unit',
 'A', 'Easy',
 'CPU = Central Processing Unit — the primary component that executes instructions.',
 SHA2(LOWER(TRIM('What does CPU stand for?')), 256)),

(3, 'Which of the following is a non-preemptive scheduling algorithm?',
 'Round Robin', 'FCFS', 'Shortest Remaining Time First', 'Preemptive Priority',
 'B', 'Easy',
 'FCFS (First Come First Serve) is non-preemptive — once a process starts, it runs to completion.',
 SHA2(LOWER(TRIM('Which of the following is a non-preemptive scheduling algorithm?')), 256)),

(3, 'What is the role of the OS kernel?',
 'Display GUI elements', 'Manage hardware and provide services to processes', 'Run user applications', 'Store files on disk',
 'B', 'Easy',
 'The kernel is the core of the OS — it manages hardware resources and provides system calls.',
 SHA2(LOWER(TRIM('What is the role of the OS kernel?')), 256)),

(3, 'Which memory section stores local variables of a function?',
 'Heap', 'Code segment', 'Stack', 'Data segment',
 'C', 'Easy',
 'Local variables and function call frames are stored on the stack.',
 SHA2(LOWER(TRIM('Which memory section stores local variables of a function?')), 256));

-- OS Medium questions
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES
(3, 'What is thrashing in an operating system?',
 'A virus attack', 'Excessive paging causing low CPU utilization', 'CPU overheating', 'Cache miss storm',
 'B', 'Medium',
 'Thrashing occurs when a process spends more time swapping pages than executing instructions.',
 SHA2(LOWER(TRIM('What is thrashing in an operating system?')), 256)),

(3, 'Which page replacement algorithm suffers from Belady''s anomaly?',
 'LRU', 'Optimal', 'FIFO', 'LFU',
 'C', 'Medium',
 'FIFO page replacement can increase page faults when more frames are added — Belady''s anomaly.',
 SHA2(LOWER(TRIM('Which page replacement algorithm suffers from Belady''s anomaly?')), 256)),

(3, 'In a system with 4 processes and 3 resources, what is the minimum number of instances of each resource to guarantee no deadlock?',
 '3', '4', '5', '6',
 'B', 'Medium',
 'For n processes each needing at most m instances, guarantee requires n*(m-1)+1 total instances. For 4 processes needing 1 each: 4.',
 SHA2(LOWER(TRIM('In a system with 4 processes and 3 resources, what is the minimum number of instances of each resource to guarantee no deadlock?')), 256)),

(3, 'What is the purpose of a semaphore?',
 'Allocate memory', 'Synchronize processes and manage critical sections', 'Schedule CPU', 'Handle interrupts',
 'B', 'Medium',
 'Semaphores are synchronization primitives used to control access to shared resources.',
 SHA2(LOWER(TRIM('What is the purpose of a semaphore?')), 256)),

(3, 'In virtual memory, the page table maps:',
 'Physical to virtual addresses', 'Virtual to physical addresses', 'Disk to cache addresses', 'Register to memory addresses',
 'B', 'Medium',
 'The page table translates virtual (logical) addresses to physical memory addresses.',
 SHA2(LOWER(TRIM('In virtual memory, the page table maps:')), 256)),

(3, 'Which of the following conditions is NOT necessary for deadlock?',
 'Mutual exclusion', 'Hold and wait', 'Preemption', 'Circular wait',
 'C', 'Medium',
 'The four necessary conditions for deadlock are mutual exclusion, hold-and-wait, no-preemption, and circular wait. Preemption (ability to take resources) PREVENTS deadlock.',
 SHA2(LOWER(TRIM('Which of the following conditions is NOT necessary for deadlock?')), 256)),

(3, 'What is context switching?',
 'Switching between user and kernel mode', 'Saving and restoring process state for CPU sharing', 'Switching memory pages', 'Changing the OS',
 'B', 'Medium',
 'Context switching saves the current process state (registers, PC) and loads another process''s state.',
 SHA2(LOWER(TRIM('What is context switching?')), 256));

-- OS Hard questions
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation, question_hash) VALUES
(3, 'Banker''s algorithm is used to:',
 'Prevent deadlock by resource allocation with safety check', 'Detect deadlock after it occurs',
 'Recover from deadlock', 'Schedule CPU processes',
 'A', 'Hard',
 'Banker''s algorithm is a deadlock AVOIDANCE algorithm — it grants resources only if the system remains in a safe state.',
 SHA2(LOWER(TRIM('Banker''s algorithm is used to:')), 256)),

(3, 'In a system using TLB (Translation Lookaside Buffer), effective memory access time with hit ratio h, TLB time t, memory time m is:',
 'h*(t+m) + (1-h)*(t+2m)', 'h*t + (1-h)*m', 'h*(t+m) + (1-h)*2m', 'h*m + (1-h)*2m',
 'A', 'Hard',
 'EMAT = h*(TLB lookup + 1 memory access) + (1-h)*(TLB lookup + 2 memory accesses for page table + data).',
 SHA2(LOWER(TRIM('In a system using TLB (Translation Lookaside Buffer), effective memory access time with hit ratio h, TLB time t, memory time m is:')), 256)),

(3, 'In the producer-consumer problem using semaphores, what happens if the "signal(empty)" is executed before "wait(full)" in the consumer?',
 'No issue', 'Deadlock may occur', 'Race condition', 'Buffer overflow',
 'C', 'Hard',
 'Incorrect semaphore ordering causes a race condition where the consumer may read from an empty buffer.',
 SHA2(LOWER(TRIM('In the producer-consumer problem using semaphores, what happens if the "signal(empty)" is executed before "wait(full)" in the consumer?')), 256)),

(3, 'Which scheduling metric is minimized by the SRTF (Shortest Remaining Time First) algorithm?',
 'CPU utilization', 'Throughput', 'Average turnaround time', 'Context switches',
 'C', 'Hard',
 'SRTF (preemptive SJF) is provably optimal for minimizing average turnaround time.',
 SHA2(LOWER(TRIM('Which scheduling metric is minimized by the SRTF (Shortest Remaining Time First) algorithm?')), 256)),

(3, 'In a system with page size 4KB and 32-bit virtual address space, how many entries does the page table have?',
 '1 million', '2 million', 'About 1 million', '4 million',
 'A', 'Hard',
 '2^32 / 2^12 = 2^20 = 1,048,576 ≈ 1 million entries.',
 SHA2(LOWER(TRIM('In a system with page size 4KB and 32-bit virtual address space, how many entries does the page table have?')), 256)),

(3, 'What is the key difference between a mutex and a binary semaphore?',
 'No difference', 'A mutex has ownership; only the locking thread can unlock it', 'Binary semaphore is faster', 'Mutex allows multiple threads',
 'B', 'Hard',
 'A mutex enforces ownership — only the thread that acquired the lock can release it. A binary semaphore can be signaled by any thread.',
 SHA2(LOWER(TRIM('What is the key difference between a mutex and a binary semaphore?')), 256));
>>>>>>> 1826be6 (Updated Phase 1 & 2)
