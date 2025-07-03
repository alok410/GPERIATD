const express = require('express');
const router = express.Router();
const {
  getAllClasses,
  getClassesByDepartment,
  createClass,
  updateClass,
  deleteClass
} = require('../controllers/class.controller');

// GET: All Classes
router.get('/getAllClasses', getAllClasses);

// GET: Classes by Department ID
router.get('/byDept/:deptId', getClassesByDepartment);

// POST: Create a new class
router.post('/createClass', createClass);

// PUT: Update a class by ID
router.put('/updateClass/:id', updateClass);

// DELETE: Delete a class by ID
router.delete('/deleteClass/:id', deleteClass);

module.exports = router;
