const express = require('express');

const router = express.Router();
const {getAllLecture,getLectureSummary, getLectureSummaryByFaculty, getLectureCountsByFaculty, getLecturesBySubject, createLecture} = require('../controllers/lecture.controller');

router.get('/getAllLecture', getAllLecture);
router.get('/getLectureSummary', getLectureSummary);
router.get('/getLectureSummaryByFaculty', getLectureSummaryByFaculty);
router.get('/lectureCounts/:facultyId', getLectureCountsByFaculty);
router.get('/bySubject/:subjectId', getLecturesBySubject);
router.post('/createLecture', createLecture);




module.exports = router;
