const bcrypt = require('bcrypt');
const db = require('../config/db'); // ✅ use `db` consistently
exports.createAdmin = async (req, res) => {
  const { name, email, password } = req.body;


  if (!password) {
    console.log("❌ Password missing");
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)`;
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("❌ DB Error:", err); // ✅ Show the actual SQL error
        return res.status(500).json({ error: err.message });
      }

      console.log("✅ Admin inserted", result);
      res.status(201).json({ message: "Admin created successfully" });
    });
  } catch (err) {
    console.error("❌ Hashing error:", err);
    res.status(500).json({ error: "Error hashing password" });
  }
};

