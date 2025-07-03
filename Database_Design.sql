use attendence_sys;


CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);

INSERT INTO departments (name) VALUES 
('Computer'), ('Mechanical'), ('Electrical'), ('Civil');


CREATE TABLE programs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);

INSERT INTO programs (name) VALUES 
('BE'), ('Diploma'), ('MSc IT');

CREATE TABLE semesters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
);

INSERT INTO semesters (name) 
VALUES ('Sem 1'), ('Sem 2'), ('Sem 3'), ('Sem 4'), ('Sem 5'), ('Sem 6'), ('Sem 7'), ('Sem 8');



CREATE TABLE classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  department_id INT,
  semester_id INT,
  program_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (semester_id) REFERENCES semesters(id),
  FOREIGN KEY (program_id) REFERENCES programs(id)
);


CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  department_id INT,
  class_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

ALTER TABLE students 
ADD COLUMN email VARCHAR(100) UNIQUE,
ADD COLUMN password VARCHAR(255);


CREATE TABLE faculty (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);
ALTER TABLE faculty 
ADD COLUMN email VARCHAR(100) UNIQUE,
ADD COLUMN password VARCHAR(255);



CREATE TABLE class_coordinators (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT UNIQUE,
  class_id INT UNIQUE,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);
CREATE TABLE hods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT UNIQUE,
  department_id INT UNIQUE,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);
CREATE TABLE principals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100)
);


ALTER TABLE principals 
ADD COLUMN email VARCHAR(100) UNIQUE,
ADD COLUMN password VARCHAR(255);

CREATE TABLE subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  class_id INT,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);
CREATE TABLE lectures (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_id INT,
  faculty_id INT,
  date DATE,
  duration INT, -- in hours (1 for theory, 2 for lab)
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (faculty_id) REFERENCES faculty(id)
);
CREATE TABLE attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lecture_id INT,
  student_id INT,
  status ENUM('Present', 'Absent') NOT NULL,
  FOREIGN KEY (lecture_id) REFERENCES lectures(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);
INSERT INTO departments (name) VALUES 
('Computer'), 
('Mechanical'), 
('Electrical'), 
('Civil');
INSERT INTO programs (name) VALUES 
('BE'), 
('Diploma'), 
('MSc IT');
INSERT INTO semesters (name) VALUES 
('Sem 1'), ('Sem 2'), ('Sem 3'), ('Sem 4'), ('Sem 5'), ('Sem 6'), ('Sem 7'), ('Sem 8');
INSERT INTO classes (name, department_id, semester_id, program_id) VALUES
('CSE_Sem3_BE', 1, 3, 1),
('CSE_Sem4_BE', 1, 4, 1),
('MECH_Sem3_BE', 2, 3, 1),
('ELEC_Sem5_Diploma', 3, 5, 2),
('CIVIL_Sem6_BE', 4, 6, 1),
('CSE_Sem1_MScIT', 1, 1, 3),
('MECH_Sem7_BE', 2, 7, 1);
	-- First 10: CSE_Sem3_BE
INSERT INTO students (name, department_id, class_id) VALUES
('Student 1', 1, 1), ('Student 2', 1, 1), ('Student 3', 1, 1), ('Student 4', 1, 1), ('Student 5', 1, 1),
('Student 6', 1, 1), ('Student 7', 1, 1), ('Student 8', 1, 1), ('Student 9', 1, 1), ('Student 10', 1, 1);

-- Next 10: MECH_Sem3_BE
INSERT INTO students (name, department_id, class_id) VALUES
('Student 11', 2, 3), ('Student 12', 2, 3), ('Student 13', 2, 3), ('Student 14', 2, 3), ('Student 15', 2, 3),
('Student 16', 2, 3), ('Student 17', 2, 3), ('Student 18', 2, 3), ('Student 19', 2, 3), ('Student 20', 2, 3);

-- Next 10: CIVIL_Sem6_BE
INSERT INTO students (name, department_id, class_id) VALUES
('Student 21', 4, 5), ('Student 22', 4, 5), ('Student 23', 4, 5), ('Student 24', 4, 5), ('Student 25', 4, 5),
('Student 26', 4, 5), ('Student 27', 4, 5), ('Student 28', 4, 5), ('Student 29', 4, 5), ('Student 30', 4, 5);
INSERT INTO faculty (name, department_id) VALUES
('Faculty 1', 1), -- Computer
('Faculty 2', 1),
('Faculty 3', 2), -- Mechanical
('Faculty 4', 2),
('Faculty 5', 3), -- Electrical
('Faculty 6', 3),
('Faculty 7', 4), -- Civil
('Faculty 8', 4),
('Faculty 9', 1), -- Additional CSE
('Faculty 10', 2); -- Additional MECH
INSERT INTO hods (faculty_id, department_id) VALUES
(1, 1), -- Faculty 1 → Computer
(3, 2), -- Faculty 3 → Mechanical
(5, 3), -- Faculty 5 → Electrical
(7, 4); -- Faculty 7 → Civil
INSERT INTO class_coordinators (faculty_id, class_id) VALUES
(2, 1), -- CSE_Sem3_BE
(9, 2), -- CSE_Sem4_BE
(4, 3), -- MECH_Sem3_BE
(6, 4), -- ELEC_Sem5_Diploma
(8, 5), -- CIVIL_Sem6_BE
(1, 6), -- CSE_Sem1_MScIT
(10, 7); -- MECH_Sem7_BE
INSERT INTO principals (name) VALUES
('Dr. A. Principal');
-- Subjects for class_id = 1 (CSE_Sem3_BE)
INSERT INTO subjects (name, class_id) VALUES
('Data Structures', 1),
('DBMS', 1),
('OOPs with Java', 1),
('Computer Networks', 1),
('Digital Electronics', 1);

-- class_id = 2 (CSE_Sem4_BE)
INSERT INTO subjects (name, class_id) VALUES
('Operating Systems', 2),
('Web Technologies', 2),
('Software Engineering', 2),
('Compiler Design', 2),
('Mobile Computing', 2);

-- class_id = 3 (MECH_Sem3_BE)
INSERT INTO subjects (name, class_id) VALUES
('Thermodynamics', 3),
('Machine Design', 3),
('Fluid Mechanics', 3),
('Engineering Drawing', 3),
('Material Science', 3);

-- class_id = 4 (ELEC_Sem5_Diploma)
INSERT INTO subjects (name, class_id) VALUES
('Circuit Theory', 4),
('Power Electronics', 4),
('Electrical Machines', 4),
('Control Systems', 4),
('Microcontrollers', 4);

-- class_id = 5 (CIVIL_Sem6_BE)
INSERT INTO subjects (name, class_id) VALUES
('Structural Analysis', 5),
('Geotechnical Engineering', 5),
('Hydraulics', 5),
('Transportation Engg.', 5),
('Environmental Engg.', 5);

-- class_id = 6 (CSE_Sem1_MScIT)
INSERT INTO subjects (name, class_id) VALUES
('Python Programming', 6),
('Data Analytics', 6),
('Advanced DBMS', 6),
('AI & ML', 6),
('Cloud Computing', 6);

-- class_id = 7 (MECH_Sem7_BE)
INSERT INTO subjects (name, class_id) VALUES
('CAD/CAM', 7),
('Heat Transfer', 7),
('Dynamics of Machinery', 7),
('Industrial Engineering', 7),
('Project Management', 7);
INSERT INTO lectures (subject_id, faculty_id, date, duration) VALUES
(1, 1, '2025-06-01', 1),
(1, 1, '2025-06-03', 1),
(1, 1, '2025-06-05', 1),
(1, 1, '2025-06-07', 1),
(1, 1, '2025-06-10', 1),
(1, 1, '2025-06-12', 2);  -- lab
INSERT INTO lectures (subject_id, faculty_id, date, duration) VALUES
(2, 2, '2025-06-02', 1),
(2, 2, '2025-06-04', 1),
(2, 2, '2025-06-06', 1),
(2, 2, '2025-06-08', 1),
(2, 2, '2025-06-11', 1),
(2, 2, '2025-06-13', 2);
INSERT INTO lectures (subject_id, faculty_id, date, duration) VALUES
(3, 1, '2025-06-01', 1),
(3, 1, '2025-06-04', 1),
(3, 1, '2025-06-07', 1),
(3, 1, '2025-06-09', 1),
(3, 1, '2025-06-11', 1),
(3, 1, '2025-06-14', 2);
-- Subject 4 to 35
-- Format: (subject_id, faculty_id, date, duration)
INSERT INTO lectures (subject_id, faculty_id, date, duration) VALUES
(14, 20, '2025-06-01', 1),
(14, 20, '2025-06-04', 1),
(14, 20, '2025-06-07', 2),
-- Subject 4 – Computer Networks
INSERT INTO lectures (subject_id, faculty_id, date, duration) VALUES
(4, 2, '2025-06-01', 1), (4, 2, '2025-06-04', 1), (4, 2, '2025-06-06', 1),
(4, 2, '2025-06-08', 1), (4, 2, '2025-06-10', 1), (4, 2, '2025-06-12', 2);

-- Subject 5 – Digital Electronics
INSERT INTO lectures (subject_id, faculty_id, date, duration) VALUES
(5, 3, '2025-06-01', 1), (5, 3, '2025-06-03', 1), (5, 3, '2025-06-06', 1),
(5, 3, '2025-06-08', 1), (5, 3, '2025-06-11', 1), (5, 3, '2025-06-13', 2);

-- Subject 6 – Operating Systems
INSERT INTO lectures (subject_id, faculty_id, date, duration) VALUES
(6, 4, '2025-06-01', 1), (6, 4, '2025-06-04', 1), (6, 4, '2025-06-07', 1),
(6, 4, '2025-06-09', 1), (6, 4, '2025-06-12', 1), (6, 4, '2025-06-14', 2);

-- Repeat same logic for 7 to 35
SELECT * FROM subjects WHERE id = 6;

INSERT INTO subjects (name, class_id) VALUES ('Operating Systems', 2);
-- Subject 4 to 35
-- Format: (subject_id, faculty_id, date, duration)

-- Subject 4 – Computer Networks
INSERT INTO lectures (subject_id, faculty_id, date, duration) VALUES
(4, 2, '2025-06-01', 1), (4, 2, '2025-06-04', 1), (4, 2, '2025-06-06', 1),
(4, 2, '2025-06-08', 1), (4, 2, '2025-06-10', 1), (4, 2, '2025-06-12', 2);

-- Subject 5 – Digital Electronics
INSERT INTO lectures (subject_id, faculty_id, date, duration) VALUES
(5, 3, '2025-06-01', 1), (5, 3, '2025-06-03', 1), (5, 3, '2025-06-06', 1),
(5, 3, '2025-06-08', 1), (5, 3, '2025-06-11', 1), (5, 3, '2025-06-13', 2);

-- Subject 6 – Operating Systems
INSERT INTO lectures (subject_id, faculty_id, date, duration) VALUES
(6, 4, '2025-06-01', 1), (6, 4, '2025-06-04', 1), (6, 4, '2025-06-07', 1),
(6, 4, '2025-06-09', 1), (6, 4, '2025-06-12', 1), (6, 4, '2025-06-14', 2);

-- Repeat same logic for 7 to 35


-- Lecture 1 attendance
INSERT INTO attendance (lecture_id, student_id, status) VALUES
(1, 1, 'Present'), (1, 2, 'Present'), (1, 3, 'Absent'), (1, 4, 'Present'), (1, 5, 'Present'),
(1, 6, 'Absent'), (1, 7, 'Present'), (1, 8, 'Present'), (1, 9, 'Present'), (1, 10, 'Absent'),
(1, 11, 'Present'), (1, 12, 'Present'), (1, 13, 'Absent'), (1, 14, 'Present'), (1, 15, 'Present'),
(1, 16, 'Present'), (1, 17, 'Absent'), (1, 18, 'Present'), (1, 19, 'Present'), (1, 20, 'Absent'),
(1, 21, 'Present'), (1, 22, 'Present'), (1, 23, 'Present'), (1, 24, 'Absent'), (1, 25, 'Present'),
(1, 26, 'Present'), (1, 27, 'Present'), (1, 28, 'Absent'), (1, 29, 'Present'), (1, 30, 'Present');

-- Lecture 2 attendance
INSERT INTO attendance (lecture_id, student_id, status) VALUES
(2, 1, 'Present'), (2, 2, 'Absent'), (2, 3, 'Present'), (2, 4, 'Present'), (2, 5, 'Absent'),
(2, 6, 'Present'), (2, 7, 'Present'), (2, 8, 'Absent'), (2, 9, 'Present'), (2, 10, 'Present'),
(2, 11, 'Present'), (2, 12, 'Absent'), (2, 13, 'Present'), (2, 14, 'Present'), (2, 15, 'Present'),
(2, 16, 'Absent'), (2, 17, 'Present'), (2, 18, 'Present'), (2, 19, 'Present'), (2, 20, 'Present'),
(2, 21, 'Absent'), (2, 22, 'Present'), (2, 23, 'Absent'), (2, 24, 'Present'), (2, 25, 'Present'),
(2, 26, 'Present'), (2, 27, 'Absent'), (2, 28, 'Present'), (2, 29, 'Present'), (2, 30, 'Present');

-- Lecture 3 attendance
INSERT INTO attendance (lecture_id, student_id, status) VALUES
(3, 1, 'Absent'), (3, 2, 'Present'), (3, 3, 'Present'), (3, 4, 'Present'), (3, 5, 'Present'),
(3, 6, 'Present'), (3, 7, 'Absent'), (3, 8, 'Present'), (3, 9, 'Present'), (3, 10, 'Present'),
(3, 11, 'Absent'), (3, 12, 'Present'), (3, 13, 'Present'), (3, 14, 'Absent'), (3, 15, 'Present'),
(3, 16, 'Present'), (3, 17, 'Present'), (3, 18, 'Absent'), (3, 19, 'Present'), (3, 20, 'Present'),
(3, 21, 'Present'), (3, 22, 'Absent'), (3, 23, 'Present'), (3, 24, 'Present'), (3, 25, 'Absent'),
(3, 26, 'Present'), (3, 27, 'Present'), (3, 28, 'Present'), (3, 29, 'Absent'), (3, 30, 'Present');

SELECT * FROM students;
-- Lecture 1 Attendance
INSERT INTO attendance (lecture_id, student_id, status) VALUES
(1, 1, 'Present'), (1, 2, 'Absent'), (1, 3, 'Present'), (1, 4, 'Present'), (1, 5, 'Present'),
(1, 6, 'Absent'), (1, 7, 'Present'), (1, 8, 'Present'), (1, 9, 'Present'), (1, 10, 'Absent');

-- Lecture 2 Attendance
INSERT INTO attendance (lecture_id, student_id, status) VALUES
(2, 1, 'Present'), (2, 2, 'Present'), (2, 3, 'Absent'), (2, 4, 'Present'), (2, 5, 'Absent'),
(2, 6, 'Present'), (2, 7, 'Present'), (2, 8, 'Present'), (2, 9, 'Absent'), (2, 10, 'Present');

-- Lecture 3 Attendance
INSERT INTO attendance (lecture_id, student_id, status) VALUES
(3, 1, 'Absent'), (3, 2, 'Present'), (3, 3, 'Present'), (3, 4, 'Absent'), (3, 5, 'Present'),
(3, 6, 'Present'), (3, 7, 'Present'), (3, 8, 'Absent'), (3, 9, 'Present'), (3, 10, 'Present');


SELECT 
    a.lecture_id,
    st.name AS student_name,
    sub.name AS subject_name,
    c.name AS class_name,
    p.name AS program_name,
    s.name AS semester_name,
    a.status
FROM attendance a
JOIN students st ON a.student_id = st.id
JOIN lectures l ON a.lecture_id = l.id
JOIN subjects sub ON l.subject_id = sub.id
JOIN classes c ON sub.class_id = c.id
JOIN programs p ON c.program_id = p.id
JOIN semesters s ON c.semester_id = s.id
WHERE a.lecture_id = 11
LIMIT 1000;

select * from hods;
select * from attendance;

SELECT f.name AS hod_name, d.name AS department_name
FROM hods h
JOIN faculty f ON h.faculty_id = f.id
JOIN departments d ON h.department_id = d.id;


select * from hods;
