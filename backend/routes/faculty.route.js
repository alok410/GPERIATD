const express = require('express');
const router = express.Router();
const {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyByDepartment
} = require('../controllers/faculty.controller');

// GET all faculty
router.get('/getAllFaculty', getAllFaculty);

// POST new faculty
router.post('/createFaculty', createFaculty);

// PUT update faculty by ID
router.put('/updateFaculty/:id', updateFaculty);

// DELETE faculty by ID
router.delete('/deleteFaculty/:id', deleteFaculty);


router.get('/getByDepartment/:deptId', getFacultyByDepartment);

module.exports = router;
