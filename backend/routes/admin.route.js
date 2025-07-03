const express = require('express');
const router = express.Router();
const {
  createAdmin
} = require('../controllers/admins.controller');


// POST new faculty
router.post('/createAdmin', createAdmin);


module.exports = router;
