require('dotenv').config(); // ✅ Load .env FIRST

const connection = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

// -------------------------
// Register - Student
// -------------------------
exports.registerStudent = (req, res) => {
  const { name, email, password, department_id, class_id } = req.body;

  if (!name || !email || !password || !department_id || !class_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  connection.query('SELECT * FROM students WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `INSERT INTO students (name, email, password, department_id, class_id) VALUES (?, ?, ?, ?, ?)`;

    connection.query(insertQuery, [name, email, hashedPassword, department_id, class_id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Student registered successfully', student_id: result.insertId });
    });
  });
};

// -------------------------
// Register - Faculty
// -------------------------
exports.registerFaculty = (req, res) => {
  const { name, email, password, department_id } = req.body;

  if (!name || !email || !password || !department_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  connection.query('SELECT * FROM faculty WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `INSERT INTO faculty (name, email, password, department_id) VALUES (?, ?, ?, ?)`;

    connection.query(insertQuery, [name, email, hashedPassword, department_id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Faculty registered successfully', faculty_id: result.insertId });
    });
  });
};

// -------------------------
// Register - Principal
// -------------------------
exports.registerPrincipal = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  connection.query('SELECT * FROM principals WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `INSERT INTO principals (name, email, password) VALUES (?, ?, ?)`;

    connection.query(insertQuery, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Principal registered successfully', principal_id: result.insertId });
    });
  });
};

// -------------------------
// Register - Admin
// -------------------------
exports.registerAdmin = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  connection.query('SELECT * FROM admins WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)`;

    connection.query(insertQuery, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Admin registered successfully', admin_id: result.insertId });
    });
  });
};

// -------------------------
// Login for All Roles
// -------------------------
exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for:', email);

  const userTypes = [
    { table: 'students', role: 'student' },
    { table: 'faculty', role: 'faculty' },
    { table: 'principals', role: 'principal' },
    { table: 'admins', role: 'admin' }
  ];

  const tryLogin = (index) => {
    if (index >= userTypes.length) {
      console.log('No user matched any role for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { table, role } = userTypes[index];

    connection.query(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, results) => {
      if (err) {
        console.error(`DB error checking ${table}:`, err.message);
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return tryLogin(index + 1);
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error during password comparison:', err.message);
          return res.status(500).json({ error: err.message });
        }

        if (!isMatch) {
          console.log('Password mismatch for:', email);
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        let roles = [role];

        if (role === 'faculty') {
          const facultyId = user.id;

          connection.query('SELECT * FROM hods WHERE faculty_id = ?', [facultyId], (err, hodResults) => {
            if (err) return res.status(500).json({ error: err.message });
            if (hodResults.length > 0) roles.push('hod');

            connection.query('SELECT * FROM class_coordinators WHERE faculty_id = ?', [facultyId], (err, ccResults) => {
              if (err) return res.status(500).json({ error: err.message });
              if (ccResults.length > 0) roles.push('class_coordinator');

              const token = jwt.sign({ id: user.id, roles }, JWT_SECRET, { expiresIn: '2h' });

                 

              return res.status(200).json({
                message: 'Login successful',
                token,
                roles,
                user: {
                  department_id : user.department_id,
                  id: user.id,
                  name: user.name,
                  email: user.email
                }
      
              });
            });
          });
        } else {
          const token = jwt.sign({ id: user.id, roles }, JWT_SECRET, { expiresIn: '2h' });
          console.log('Bearer ' + token);
          console.log('Login successful with roles:', roles);

          return res.status(200).json({
            message: 'Login successful',
            token,
            roles,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
      });
    });
  };

  tryLogin(0);
};
