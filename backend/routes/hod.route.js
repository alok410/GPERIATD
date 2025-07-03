const express = require('express');
const router = express.Router();
const {
  getAllHOD,
  createHOD,
  updateHOD,
  deleteHOD,
  getHODByDepartment
} = require('../controllers/hod.controller');

router.get('/getAllHOD', getAllHOD);
router.post('/create', createHOD);
router.post('/update/:id', updateHOD);
router.post('/delete/:id', deleteHOD);
router.get('/getByDepartment/:department_id', getHODByDepartment);

module.exports = router;
