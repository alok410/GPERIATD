const connection = require('../config/db');
const db = require('../config/db'); 

// -------------------------
// Get Subjects by Class ID
// -------------------------
exports.getSubjectsByClass = (req, res) => {
  const { classId } = req.params;

  const query = `SELECT * FROM subjects WHERE class_id = ?`;

  connection.query(query, [classId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json(results);
  });
};

// -------------------------
// Get Faculty by Department ID
// -------------------------
exports.getFacultyByDepartment = (req, res) => {
  const { deptId } = req.params;

  const query = `SELECT id, name FROM faculty WHERE department_id = ?`;

  connection.query(query, [deptId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json(results);
  });
};

// -------------------------
// Assign Faculty to Subject
// -------------------------
exports.assignFacultyToSubject = (req, res) => {
  const { subjectId } = req.params;
  const { fac_1, fac_2, fac_3, fac_4 } = req.body;

  console.log("➡️ Faculty assignment request for subject:", subjectId);
  console.log("Received:", req.body);

  const query = `
    UPDATE subjects 
    SET fac_1 = ?, fac_2 = ?, fac_3 = ?, fac_4 = ?
    WHERE id = ?
  `;

  connection.query(query, [fac_1 || null, fac_2 || null, fac_3 || null, fac_4 || null, subjectId], (err) => {
    if (err) {
      console.error("❌ DB Update Error:", err);
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({ message: 'Faculty assigned successfully' });
  });
};



exports.getSubjectsByDepartmentFull = (req, res) => {
  const { deptId } = req.params;

  const query = `
    SELECT 
      s.id,
      s.name,
      c.name AS class_name,
      c.batch,
      f1.id AS fac_1_id, f1.name AS fac_1_name,
      f2.id AS fac_2_id, f2.name AS fac_2_name,
      f3.id AS fac_3_id, f3.name AS fac_3_name,
      f4.id AS fac_4_id, f4.name AS fac_4_name
    FROM subjects s
    JOIN classes c ON s.class_id = c.id
    LEFT JOIN faculty f1 ON s.fac_1 = f1.id
    LEFT JOIN faculty f2 ON s.fac_2 = f2.id
    LEFT JOIN faculty f3 ON s.fac_3 = f3.id
    LEFT JOIN faculty f4 ON s.fac_4 = f4.id
    WHERE c.department_id = ?
  `;

  connection.query(query, [deptId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = results.map(row => ({
      id: row.id,
      name: row.name,
      class_name: row.class_name,
      batch: row.batch,
      fac_1: row.fac_1_id ? { id: row.fac_1_id, name: row.fac_1_name } : null,
      fac_2: row.fac_2_id ? { id: row.fac_2_id, name: row.fac_2_name } : null,
      fac_3: row.fac_3_id ? { id: row.fac_3_id, name: row.fac_3_name } : null,
      fac_4: row.fac_4_id ? { id: row.fac_4_id, name: row.fac_4_name } : null,
    }));

    res.status(200).json(formatted);
  });
};


// ------------------------------------------
// Get Subjects Assigned to a Particular Faculty
// ------------------------------------------
exports.getSubjectsByFaculty = (req, res) => {
  const { facultyId } = req.params;

  const query = `
    SELECT 
      s.id,
      s.name,
      c.name AS class_name,
      c.batch
    FROM subjects s
    JOIN classes c ON s.class_id = c.id
    WHERE s.fac_1 = ? OR s.fac_2 = ? OR s.fac_3 = ? OR s.fac_4 = ?
  `;

  connection.query(query, [facultyId, facultyId, facultyId, facultyId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json(results);
  });
};

exports.createSubject = (req, res) => {
  const { name, class_id } = req.body;

  if (!name || !class_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO subjects (name, class_id)
    VALUES (?, ?)
  `;

  connection.query(query, [name, class_id], (err, result) => {
    if (err) {
      console.error("❌ SQL Error:", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: "Subject created successfully" });
  });
};

exports.getSubjectAndClassDetails = (req, res) => {
  const { subjectId } = req.params;

  const query = `
    SELECT 
      s.name AS subject_name,
      c.name AS class_name,
      c.id
    FROM subjects s
    JOIN classes c ON s.class_id = c.id
    WHERE s.id = ?
  `;

  db.query(query, [subjectId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Subject not found' });

    res.status(200).json(results[0]);
  });
};
