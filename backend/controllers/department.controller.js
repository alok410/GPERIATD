const connection = require('../config/db');

// -------------------------
// Get All Departments
// -------------------------
exports.getAllDepartments = (req, res) => {
  const query = `SELECT * FROM departments;`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({
      message: 'Departments fetched successfully',
      departments: results
    });
  });
};

// -------------------------
// Get Department By ID
// -------------------------
exports.getDepartmentById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM departments WHERE id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json(results[0]); 
  });
};
