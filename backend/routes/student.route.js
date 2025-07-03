const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');

router.get('/getAllStudents', studentController.getAllStudents);
router.post('/create', studentController.createStudent);
router.delete('/delete/:id', studentController.deleteStudent);
router.put('/update/:id', studentController.updateStudent);
router.get('/bySubject/:subjectId', studentController.getStudentsBySubject);
router.get('/dashboard/:id', studentController.getStudentDashboardData);
router.get('/getById/:id', studentController.getStudentById); // ✅ NEW

module.exports = router;
