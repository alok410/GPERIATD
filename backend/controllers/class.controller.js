const connection = require('../config/db');

// Get all classes with JOINs
const getAllClasses = (req, res) => {
  const query = `
    SELECT 
      c.id, c.name, c.batch,
      d.name AS department_name,
      d.id As department_id,
      s.name AS semester_name,
      c.semester_id,
      p.name AS program_name
    FROM classes c
    LEFT JOIN departments d ON c.department_id = d.id
    LEFT JOIN semesters s ON c.semester_id = s.id
    LEFT JOIN programs p ON c.program_id = p.id
    order by id desc
  `;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Classes fetched', classes: results });
  });
};

// Create new class
const createClass = (req, res) => {
  const { name, department_id, semester_id, program_id, batch } = req.body;

  const query = `
    INSERT INTO classes (name, department_id, semester_id, program_id, batch)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(query, [name, department_id, semester_id, program_id, batch], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Class created', classId: result.insertId });
  });
};

// Update class
const updateClass = (req, res) => {
  const { id } = req.params;
  const { name, department_id, semester_id, program_id, batch } = req.body;

  const query = `
    UPDATE classes
    SET name = ?, department_id = ?, semester_id = ?, program_id = ?, batch = ?
    WHERE id = ?
  `;

  connection.query(query, [name, department_id, semester_id, program_id, batch, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Class updated' });
  });
};

// Delete class
const deleteClass = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM classes WHERE id = ?`;
  connection.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Class deleted' });
  });
};


const getClassesByDepartment = (req, res) => {
  const { deptId } = req.params;

  const query = `SELECT * FROM classes WHERE department_id = ?`;

  connection.query(query, [deptId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json(results);
  });
};

module.exports = {
  getAllClasses, createClass,updateClass,deleteClass,getClassesByDepartment
}