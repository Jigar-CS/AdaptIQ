-- AdaptIQ Seed Data v2 — development sample data
-- Run AFTER schema.sql
-- Covers 3 topics × 20+ questions (Easy / Medium / Hard mix)

-- ============================================================
-- Topics (keeping all 10, seeding questions for first 3)
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
