const connection = require('../config/db');

// -------------------------
// Get All HODs
// -------------------------
exports.getAllHOD = (req, res) => {
  const query = `SELECT 
    h.id,
    h.faculty_id, 
    f.name AS faculty_name, 
    f.email as faculty_email,
    d.name AS department_name 
    FROM hods AS h
    INNER JOIN faculty AS f ON f.id = h.faculty_id
    INNER JOIN departments AS d ON d.id = h.department_id;`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'HOD fetched successfully', hod: results });
  });
};

// -------------------------
// Create HOD
// -------------------------
exports.createHOD = (req, res) => {
  const { faculty_id, department_id } = req.body;
  const query = 'INSERT INTO hods (faculty_id, department_id) VALUES (?, ?)';
  connection.query(query, [faculty_id, department_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'HOD created successfully', id: result.insertId });
  });
};

// -------------------------
// Update HOD
// -------------------------
exports.updateHOD = (req, res) => {
  const { id } = req.params;
  const { faculty_id, department_id } = req.body;
  const query = 'UPDATE hods SET faculty_id = ?, department_id = ? WHERE id = ?';
  connection.query(query, [faculty_id, department_id, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'HOD updated successfully' });
  });
};

// -------------------------
// Delete HOD
// -------------------------
exports.deleteHOD = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM hods WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'HOD deleted successfully' });
  });
};

// -------------------------
// Get HOD by Department ID (filter)
// -------------------------
exports.getHODByDepartment = (req, res) => {
  const { department_id } = req.params;
  const query = `SELECT 
    h.id,
    h.faculty_id, 
    f.name AS faculty_name, 
    f.email as faculty_email,
    d.name AS department_name 
    FROM hods AS h
    INNER JOIN faculty AS f ON f.id = h.faculty_id
    INNER JOIN departments AS d ON d.id = h.department_id
    WHERE h.department_id = ?`;

  connection.query(query, [department_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Filtered HODs fetched successfully', hod: results });
  });
};