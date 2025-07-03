const connection = require('../config/db');
const bcrypt = require('bcrypt');

// -------------------------
// Get All Principals
// -------------------------
exports.getPrincipal = (req, res) => {
  const query = `SELECT id, name, email FROM principals`; // Avoid sending passwords

  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({
      message: 'Principal fetched successfully',
      principal: results
    });
  });
};

// -------------------------
// Create Principal (with bcrypt)
// -------------------------
exports.createPrincipal = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO principals (name, email, password) VALUES (?, ?, ?)`;

    connection.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ message: 'Principal created successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error hashing password' });
  }
};

// -------------------------
// Update Principal (with bcrypt)
// -------------------------
exports.updatePrincipal = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `UPDATE principals SET name = ?, email = ?, password = ? WHERE id = ?`;

    connection.query(query, [name, email, hashedPassword, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json({ message: 'Principal updated successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error hashing password' });
  }
};

// -------------------------
// Delete Principal
// -------------------------
exports.deletePrincipal = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM principals WHERE id = ?`;

  connection.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({ message: 'Principal deleted successfully' });
  });
};
