const bcrypt = require('bcrypt');
const db = require('../config/db'); // ✅ use `db` consistently

// Get All Faculty
exports.getAllFaculty = (req, res) => {
  const query = `SELECT 
    f.id, 
    f.name AS faculty_name, 
    d.name AS department_name,
    f.email AS faculty_email,
    f.department_id
    FROM faculty AS f
    LEFT JOIN departments AS d ON d.id = f.department_id
    ORDER BY f.id DESC`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Faculty fetched successfully', faculty: results });
  });
};

// Create Faculty
exports.createFaculty = async (req, res) => {
  const { name, email, department_id, password } = req.body;


  if (!password) {
    console.log("❌ Password missing");
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO faculty (name, email, department_id, password) VALUES (?, ?, ?, ?)`;
    db.query(query, [name, email, department_id, hashedPassword], (err, result) => {
      if (err) {
        console.error("❌ DB Error:", err); // ✅ Show the actual SQL error
        return res.status(500).json({ error: err.message });
      }

      console.log("✅ Faculty inserted", result);
      res.status(201).json({ message: "Faculty created successfully" });
    });
  } catch (err) {
    console.error("❌ Hashing error:", err);
    res.status(500).json({ error: "Error hashing password" });
  }
};


// Update Faculty
exports.updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { name, email, department_id, password } = req.body;

  // Decide query depending on whether password is provided
  let query;
  let values;

  if (password && password.trim() !== "") {
    const hashedPassword = await bcrypt.hash(password, 10); // only if you're hashing
    query = `UPDATE faculty SET name = ?, email = ?, department_id = ?, password = ? WHERE id = ?`;
    values = [name, email, department_id, hashedPassword, id];
  } else {
    query = `UPDATE faculty SET name = ?, email = ?, department_id = ? WHERE id = ?`;
    values = [name, email, department_id, id];
  }

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Faculty updated successfully" });
  });
};

// Delete Faculty
exports.deleteFaculty = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM faculty WHERE id = ?`;

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Faculty deleted successfully" });
  });
};

// Get Faculty by Department ID
exports.getFacultyByDepartment = (req, res) => {
  const { deptId } = req.params;
  const query = `
    SELECT 
      f.id, 
      f.name AS faculty_name, 
      f.email AS faculty_email, 
      f.department_id,
      d.name AS department_name
    FROM faculty AS f
    LEFT JOIN departments AS d ON f.department_id = d.id
    WHERE f.department_id = ?`;

  db.query(query, [deptId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({
      message: 'Faculty fetched by department successfully',
      faculty: results
    });
  });
};
