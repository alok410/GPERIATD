const connection = require('../config/db');

// -------------------------
// Get All Programs
// -------------------------
exports.getAllSem = (req, res) => {
  const query = `SELECT * FROM semesters;`;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({
      message: 'Sems fetched successfully',
      sems: results
    });
  });
};
