const bcrypt = require('bcrypt');
const db = require('../config/db');

// -------------------------
// Get All Students
// -------------------------
const getAllStudents = (req, res) => {
  const query = `
    SELECT 
      students.id, 
      students.name, 
      students.email, 
      students.batch,
      students.department_id, 
      students.class_id, 
      departments.name AS department_name,
      classes.name AS class_name
    FROM 
      students
    JOIN 
      departments ON students.department_id = departments.id
    JOIN 
      classes ON students.class_id = classes.id
    ORDER BY students.id DESC;
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({
      message: 'Students fetched successfully',
      students: results
    });
  });
};

// -------------------------
// Create Student
// -------------------------
const createStudent = (req, res) => {
  const { name, email, password, batch, department_id, class_id } = req.body;

  if (!name || !email || !password || !batch || !department_id || !class_id) {
    return res.status(400).json({ message: "All fields are required." });
  }

  db.query("SELECT id FROM students WHERE email = ?", [email], async (err, existing) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (existing.length > 0) {
      return res.status(409).json({ message: "Student with this email already exists." });
    }

    db.query("SELECT id FROM departments WHERE id = ?", [department_id], (err, dept) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      if (dept.length === 0) return res.status(404).json({ message: "Department not found." });

      db.query("SELECT id FROM classes WHERE id = ?", [class_id], async (err, cls) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        if (cls.length === 0) return res.status(404).json({ message: "Class not found." });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO students (name, email, password, batch, department_id, class_id) VALUES (?, ?, ?, ?, ?, ?)",
          [name, email, hashedPassword, batch, department_id, class_id],
          (err, result) => {
            if (err) return res.status(500).json({ message: "DB error", error: err });

            return res.status(201).json({
              message: "Student created successfully.",
              student_id: result.insertId,
            });
          }
        );
      });
    });
  });
};

// -------------------------
// Delete Student by ID
// -------------------------
const deleteStudent = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Student ID is required." });

  db.query("DELETE FROM students WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found." });
    }
    return res.status(200).json({ message: "Student deleted successfully." });
  });
};

// -------------------------
// Update Student
// -------------------------
const updateStudent = (req, res) => {
  const studentId = req.params.id;
  const { name, email, password, batch, department_id, class_id } = req.body;

  if (!name || !email || !batch || !department_id || !class_id) {
    return res.status(400).json({ message: "All fields except password are required." });
  }

  db.query("SELECT * FROM students WHERE id = ?", [studentId], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (results.length === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    let hashedPassword = results[0].password;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateQuery = `
      UPDATE students SET 
        name = ?, 
        email = ?, 
        password = ?, 
        batch = ?, 
        department_id = ?, 
        class_id = ?
      WHERE id = ?
    `;

    db.query(updateQuery, [name, email, hashedPassword, batch, department_id, class_id, studentId], (err) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      return res.status(200).json({ message: "Student updated successfully." });
    });
  });
};

// -------------------------
// Get Students by Subject
// -------------------------
const getStudentsBySubject = (req, res) => {
  const { subjectId } = req.params;

  const getClassQuery = 'SELECT class_id FROM subjects WHERE id = ?';
  db.query(getClassQuery, [subjectId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Subject not found' });

    const classId = result[0].class_id;
    const getStudentsQuery = 'SELECT * FROM students WHERE class_id = ?';

    db.query(getStudentsQuery, [classId], (err, students) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ class_id: classId, students });
    });
  });
};

// -------------------------
// Get Dashboard Info for a Student
// -------------------------
const getStudentDashboardData = (req, res) => {
  const studentId = req.params.id;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID is required." });
  }

  const studentQuery = `
    SELECT 
      s.id,
      s.name,
      s.email,
      s.batch,
      s.class_id,
      s.department_id,
      c.name AS class_name,
      c.semester_id,
      d.name AS department_name
    FROM students s
    JOIN classes c ON s.class_id = c.id
    JOIN departments d ON s.department_id = d.id
    WHERE s.id = ?
  `;

  db.query(studentQuery, [studentId], (err, studentResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (studentResults.length === 0) return res.status(404).json({ message: "Student not found." });

    const student = studentResults[0];

    const subjectsQuery = `SELECT id, name FROM subjects WHERE class_id = ?`;

    const attendanceQuery = `
      SELECT 
        a.lecture_id,
        a.student_id,
        l.duration,
        CASE 
          WHEN l.duration = 1 THEN 'lecture'
          WHEN l.duration = 2 THEN 'lab'
          ELSE 'unknown'
        END AS type,
        l.date,
        s.name AS subject_name
      FROM attendance a
      JOIN lectures l ON a.lecture_id = l.id
      JOIN subjects s ON l.subject_id = s.id
      WHERE a.student_id = ?
    `;

    db.query(subjectsQuery, [student.class_id], (err, subjects) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(attendanceQuery, [studentId], (err, attendance) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json({
          student: {
            id: student.id,
            name: student.name,
            email: student.email,
            batch: student.batch,
            classDetails: {
              id: student.class_id,
              name: student.class_name,
              semester_id: student.semester_id,
              department_id: student.department_id,
              department_name: student.department_name
            }
          },
          subjects,
          records: attendance
        });
      });
    });
  });
};
const getStudentById = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Student ID is required." });
  }

  const query = `
    SELECT 
      s.id,
      s.name,
      s.email,
      s.batch,
      s.class_id,
      s.department_id,
      c.name AS class_name,
      c.semester_id,
      d.name AS department_name
    FROM students s
    JOIN classes c ON s.class_id = c.id
    JOIN departments d ON s.department_id = d.id
    WHERE s.id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.status(200).json(result[0]);
  });
};


module.exports = {
  getAllStudents,
  createStudent,
  deleteStudent,
  updateStudent,
  getStudentsBySubject,
  getStudentDashboardData,
    getStudentById

};
