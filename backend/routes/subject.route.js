const express = require('express');
const router = express.Router();
const {
  getSubjectsByClass,
  assignFacultyToSubject,
  getSubjectsByDepartmentFull, // ✅ newly added
  getSubjectsByFaculty,
  createSubject,
  getSubjectAndClassDetails
} = require('../controllers/subject.controller');

const { getFacultyByDepartment } = require('../controllers/faculty.controller');

// Existing route
router.get('/byClass/:classId', getSubjectsByClass);
router.get('/facultyByDept/:deptId', getFacultyByDepartment);
router.post('/assignFaculty/:subjectId', assignFacultyToSubject);
router.post('/createSubject', createSubject);
router.get('/byDeptFull/:deptId', getSubjectsByDepartmentFull);
router.get('/byFaculty/:facultyId', getSubjectsByFaculty);
router.get('/details/:subjectId', getSubjectAndClassDetails);


module.exports = router;
