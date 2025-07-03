const db = require('../config/db'); 

const markOrUpdateAttendance = (req, res) => {
  const { attendance } = req.body;

  if (!attendance || !Array.isArray(attendance)) {
    return res.status(400).json({ message: 'Invalid attendance data.' });
  }

  const tasks = attendance.map(entry => {
    const { student_id, lecture_id, status } = entry;

    return new Promise((resolve, reject) => {
      const checkQuery = `
        SELECT * FROM attendance 
        WHERE student_id = ? AND lecture_id = ?
      `;

      db.query(checkQuery, [student_id, lecture_id], (err, result) => {
        if (err) return reject(err);

        if (result.length > 0) {
          const updateQuery = `
            UPDATE attendance SET status = ? 
            WHERE student_id = ? AND lecture_id = ?
          `;
          db.query(updateQuery, [status, student_id, lecture_id], (err2) => {
            if (err2) return reject(err2);
            resolve('updated');
          });
        } else {
          const insertQuery = `
            INSERT INTO attendance (student_id, lecture_id, status)
            VALUES (?, ?, ?)
          `;
          db.query(insertQuery, [student_id, lecture_id, status], (err3) => {
            if (err3) return reject(err3);
            resolve('inserted');
          });
        }
      });
    });
  });

  Promise.all(tasks)
    .then(() => res.status(200).json({ message: 'Attendance saved successfully.' }))
    .catch((err) => {
      console.error('Attendance error:', err);
      res.status(500).json({ message: 'Error processing attendance.' });
    });
};

const getAttendanceByLecture = (req, res) => {
  const { lectureId } = req.params;

  const query = `
    SELECT student_id, status 
    FROM attendance 
    WHERE lecture_id = ?
  `;

  db.query(query, [lectureId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const attendanceMap = {};
    results.forEach(row => {
      attendanceMap[row.student_id] = row.status;
    });

    res.status(200).json(attendanceMap);
  });
};
const getAttendanceReport = (req, res) => {
  const { subjectId, facultyId } = req.params;

  if (!facultyId) {
    return res.status(400).json({ message: 'facultyId is required in route params' });
  }

  const getSubjectQuery = `
    SELECT s.id AS subject_id, s.class_id, c.name AS class_name
    FROM subjects s
    JOIN classes c ON s.class_id = c.id
    WHERE s.id = ?
  `;

  db.query(getSubjectQuery, [subjectId], (err, subjectResults) => {
    if (err || subjectResults.length === 0) {
      return res.status(500).json({ message: 'Subject not found' });
    }

    const { class_id } = subjectResults[0];

    const getLecturesQuery = `
      SELECT 
        l.id,
        l.topic,
        DATE_FORMAT(l.date, '%Y-%m-%d') AS date,
        l.duration,
        l.faculty_id,
        s.name AS subject_name,
        f.name AS faculty_name
      FROM lectures l
      JOIN subjects s ON l.subject_id = s.id
      JOIN faculty f ON l.faculty_id = f.id
      WHERE l.subject_id = ? AND l.faculty_id = ?
      ORDER BY l.date, l.id
    `;

    db.query(getLecturesQuery, [subjectId, facultyId], (err2, lectures) => {
      if (err2) return res.status(500).json({ message: 'Error fetching lectures' });

      const lectureIds = lectures.map(l => l.id);
      const lectureMeta = lectures.map(l => ({ id: l.id, date: l.date , duration:l.duration}));

      const getStudentsQuery = `SELECT id, name, erno FROM students WHERE class_id = ?`;

      db.query(getStudentsQuery, [class_id], (err3, students) => {
        if (err3) return res.status(500).json({ message: 'Error fetching students' });

        const getAttendanceQuery = `
          SELECT student_id, lecture_id, status FROM attendance
          WHERE lecture_id IN (?)
        `;

        db.query(getAttendanceQuery, [lectureIds], (err4, attendanceRows) => {
          if (err4) return res.status(500).json({ message: 'Error fetching attendance' });

          const attendanceMap = {};
          attendanceRows.forEach(row => {
            const key = `${row.student_id}_${row.lecture_id}`;
            attendanceMap[key] = row.status;
          });

          const studentReport = students.map(student => {
            const attendance = {};
            lectureMeta.forEach(lec => {
              const key = `${student.id}_${lec.id}`;
              attendance[lec.id] = attendanceMap[key] || 'Absent';
            });

            return {
              id: student.id,
              name: student.name,
              erno: student.erno,
              attendance
            };
          });

          res.json({
            lectureDates: lectureMeta, // now includes lectureId
            students: studentReport
          });
        });
      });
    });
  });
};
const getAttendanceByStudentId = (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: 'Student ID is required.' });

  const query = `
    SELECT 
      a.id AS attendance_id,
      a.lecture_id,
      a.student_id,
      l.date,
      l.topic,
      l.duration,
      l.subject_id,
      s.name AS subject_name,
      f.name AS faculty_name,
      CASE 
        WHEN l.duration = 1 THEN 'lecture'
        WHEN l.duration = 2 THEN 'lab'
        ELSE 'other'
      END AS type
    FROM attendance a
    JOIN lectures l ON a.lecture_id = l.id
    JOIN subjects s ON l.subject_id = s.id
    JOIN faculty f ON l.faculty_id = f.id
    WHERE a.student_id = ?
    ORDER BY l.date DESC, l.id DESC
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });

    return res.status(200).json({
      message: 'Attendance fetched successfully.',
      records: result
    });
  });
};



module.exports = {
  markOrUpdateAttendance,
  getAttendanceByStudentId,
  getAttendanceByLecture,
  getAttendanceReport
};
