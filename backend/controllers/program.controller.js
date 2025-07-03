const connection = require('../config/db');

// -------------------------
// Get All Programs
// -------------------------
exports.getAllPrograms = (req, res) => {
  const query = `SELECT * FROM programs;`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({
      message: 'Programs fetched successfully',
      programs: results
    });
  });
};
