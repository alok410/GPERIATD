const express = require('express');
const router = express.Router();
const {
  login,
  registerStudent,
  registerFaculty,
  registerPrincipal,
  registerAdmin // ✅ Admin register controller
} = require('../controllers/auth.controller');

// Login (for all roles)
router.post('/login', login);

// Registration routes
router.post('/register/student', registerStudent);
router.post('/register/faculty', registerFaculty);
router.post('/register/principal', registerPrincipal);
router.post('/register/admin', registerAdmin); // ✅ Admin registration route

module.exports = router;
