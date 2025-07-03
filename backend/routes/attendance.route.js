const express = require('express');
const router = express.Router();
const {
  markOrUpdateAttendance,
  getAttendanceByLecture,
  getAttendanceReport,
  getAttendanceByStudentId
} = require('../controllers/attendance.controller');

router.post('/markOrUpdate', markOrUpdateAttendance);
router.get('/byLecture/:lectureId', getAttendanceByLecture);
router.get('/report/:subjectId/:facultyId', getAttendanceReport); // ✅ new
router.get('/student/:id',getAttendanceByStudentId);



module.exports = router;
